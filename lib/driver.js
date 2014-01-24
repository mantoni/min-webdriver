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
  if (!script) {
    close(context, callback);
    return;
  }
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

function connectBrowser(context, callback) {
  var json = {
    desiredCapabilities : {
      browserName       : context.browser.name,
      version           : context.browser.version,
      platform          : context.browser.platform,
      javascriptEnabled : true
    }
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
    hostname : options.hostname,
    port     : options.port,
    basePath : '/wd/hub',
    browser  : browser,
    out      : out
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
    requests.forEach(function (request) {
      execute(request.context, script, request.callback);
    });
    requests = null;
  });

  return function (context, callback) {
    if (requests) {
      requests.push({ context : context, callback : callback });
    } else {
      execute(context, script, callback);
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
