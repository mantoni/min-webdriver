/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var through = require('through');
var listen  = require('listen');
var http    = require('http');
var fs      = require('fs');
var request = require('./request');


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
      close(context, function () {
        callback(err);
      });
      return;
    }
    var match = res.value.match(/^WEBDRIVER_EXIT\(([0-9]+)\)$/m);
    if (match) {
      context.logs.push(res.value.substring(0, match.index));

      var browser = context.browser;
      var title   = browser.name + ' ' + (browser.version || '*');
      var line    = new Array(76).join('=').substring(title.length);
      context.out.write('= ' + title + ' ' + line + '\n');
      context.out.write(context.logs.join(''));

      close(context, function () {
        if (match[1] === '0') {
          callback();
        } else {
          callback(new Error('Build failed: ' + match[1]));
        }
      });
      return;
    }
    context.logs.push(res.value);
    pollLogs(context, callback);
  });
}


function execute(context, script, callback) {
  request(context, 'POST', '/execute', {
    script : script,
    args   : []
  }, function (err) {
    if (err) {
      close(context, function () {
        callback(err);
      });
      return;
    }
    context.logs = [];
    setTimeout(function () {
      pollLogs(context, callback);
    }, 100);
  });
}

function openUrl(context, script, callback) {
  var url = context.url;
  if (url) {
    request(context, 'POST', '/url', {
      url : url
    }, function (err) {
      if (err) {
        close(context, function () {
          callback(err);
        });
        return;
      }
      execute(context, script, callback);
    });
  } else {
    execute(context, script, callback);
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
    request(context, 'POST', '/timeouts/async_script', {
      ms : 10000
    }, function (err) {
      if (err) {
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
    hostname  : options.hostname,
    port      : options.port,
    url       : options.url,
    basePath  : '/wd/hub',
    browser   : browser,
    out       : out,
    sauceLabs : options.sauceLabs
  };
}


function run(options, out, runner, callback) {
  var listener = listen();
  options.browsers.forEach(function (browser) {
    var cb      = listener();
    var context = createContext(options, browser, out);
    connectBrowser(context, function (err) {
      if (err) {
        cb(err);
        return;
      }
      runner(context, cb);
    });
  });
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
    out.write(null);
    callback(err);
  });

  return out;
};
