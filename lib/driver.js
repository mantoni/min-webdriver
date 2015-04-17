/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var through   = require('through2');
var listen    = require('listen');
var http      = require('http');
var fs        = require('fs');
var sourceMap = require('source-mapper');
var request   = require('./request');


function close(context, callback) {
  request(context, 'DELETE', "/window", null, function () {
    request(context, 'DELETE', '', null, function () {
      callback();
    });
  });
}

function pollLogs(context, callback) {
  request(context, 'POST', '/execute_async', {
    script : 'window._webdriver_poll(arguments[0]);',
    args   : []
  }, function (err, res) {
    if (err) {
      if (context.closeOnError) {
        close(context, function () {
          callback(err);
        });
      } else {
        callback(err);
      }
      return;
    }
    var match = res.value.match(/^WEBDRIVER_EXIT\(([0-9]+)\)$/m);
    if (match) {
      context.out.write(res.value.substring(0, match.index));

      var localCallback = function () {
        if (match[1] === '0') {
          callback();
        } else {
          callback(new Error('Build failed: ' + match[1]));
        }
      };

      if (context.closeOnSuccess) {
        close(context, localCallback);
      } else {
        localCallback();
      }
      return;
    }
    if (context.out.write(res.value)) {
      pollLogs(context, callback);
    } else {
      context.out.once('drain', function () {
        pollLogs(context, callback);
      });
    }
  });
}

function execute(context, script, callback) {
  request(context, 'POST', '/execute', {
    script : script,
    args   : []
  }, function (err) {

    if (err) {
      if (context.closeOnError) {
        close(context, function () {
          callback(err);
        });
      } else {
        callback(err);
      }
      return;
    }

    setTimeout(function () {
      pollLogs(context, callback);
    }, 100);
  });
}

function openUrl(context, script, callback) {
  var browser = context.browser;
  var title   = browser.name + ' ' + (browser.version || '*');
  context.out.write('# ' + title + ':\n');

  var x = sourceMap.extract(script);
  if (x.map) {
    var sm = sourceMap.stream(x.map);
    sm.pipe(context.out);
    context.out = sm;
  }

  var url = browser.url || context.url;
  if (url) {
    request(context, 'POST', '/url', {
      url : url
    }, function (err) {
      if (err) {
        if (context.closeOnError) {
          close(context, function () {
            callback(err);
          });
        } else {
          callback(err);
        }
        return;
      }
      execute(context, x.js, callback);
    });
  } else {
    execute(context, x.js, callback);
  }
}

function connectBrowser(context, callback) {
  var caps = {
    browserName       : context.browser.name,
    version           : context.browser.version,
    platform          : context.browser.platform,
    javascriptEnabled : true
  };
  if (context.sauceLabs) {
    caps.username  = process.env.SAUCE_USERNAME;
    caps.accessKey = process.env.SAUCE_ACCESS_KEY;
  }
  var json = {
    desiredCapabilities : caps
  };

  request(context, 'POST', '/session', json, function (err, res) {
    if (err) {
      callback(err);
      return;
    }
    context.basePath = context.basePath + '/session/' + res.sessionId;
    if (context.timeout === 0) {
      callback(null);
      return;
    }
    request(context, 'POST', '/timeouts/async_script', {
      ms : context.timeout || 10000
    }, function (err) {
      if (err && context.closeOnError) {
        close(context, function () {
          callback(err);
        });
        return;
      }
      callback(null);
    });
  });
}

function createContext(options, browser, out) {
  return {
    hostname      : options.hostname,
    port          : options.port,
    url           : options.url,
    timeout       : options.timeout,
    basePath      : '/wd/hub',
    browser       : browser,
    out           : out,
    sauceLabs     : options.sauceLabs,
    closeOnError  : options.closeOnError,
    closeOnSuccess : options.closeOnSuccess
  };
}

function pipe(streams, out) {
  if (!streams.length) {
    out.end();
    return;
  }
  var stream = streams.shift();
  stream.on('data', function (data) {
    out.write(data);
  });
  stream.on('end', function () {
    pipe(streams, out);
  });
  stream.resume();
}

function run(options, out, runner, callback) {
  var listener = listen();
  var streams  = options.browsers.map(function (browser) {
    var stream = through();
    stream.pause();
    var cb = listener(function () {
      stream.end();
    });
    var context = createContext(options, browser, stream);
    connectBrowser(context, function (err) {
      if (err) {
        cb(err);
        return;
      }
      runner(context, cb);
    });
    return stream;
  });
  pipe(streams, out);
  listener.then(callback);
}

function createRunner(input) {
  var requests = [];
  var script   = '';
  input.on('data', function (chunk) {
    script += chunk;
  });
  input.on('end', function () {
    if (!script) {
      requests.forEach(function (request) {
        close(request.context, request.callback);
      });
    } else {
      requests.forEach(function (request) {
        openUrl(request.context, script, request.callback);
      });
    }
    requests = null;
  });

  return function (context, callback) {
    if (requests) {
      requests.push({ context : context, callback : callback });
    } else {
      if (!script) {
        close(context, callback);
        return;
      }
      openUrl(context, script, callback);
    }
  };
}


module.exports = function (input, options, callback) {
  var out = through();

  run(options, out, createRunner(input), function (err) {
    callback(err);
  });

  return out;
};
