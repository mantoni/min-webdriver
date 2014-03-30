/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var http = require('http');

var contentType = 'application/json;charset=utf-8';


function indent(string) {
  return string.replace(/^/gm, '    ');
}

function fail(options, message, headers, body, callback) {
  process.stderr.write(options.method);
  process.stderr.write(' ');
  process.stderr.write(options.path);
  process.stderr.write('\n\n');
  process.stderr.write(message);
  if (headers) {
    process.stderr.write('\n');
    Object.keys(headers).forEach(function (header) {
      process.stderr.write('\n' + header + ': ' + headers[header]);
    });
    process.stderr.write('\n');
  }
  if (body) {
    process.stderr.write('\n');
    process.stderr.write(indent(body.replace(/^\s+$/gm, '')));
    process.stderr.write('\n');
  }
  process.stderr.write('\n');
  callback(new Error(message));
}

function request(context, method, path, json, callback) {
  var payload = json ? JSON.stringify(json) : null;
  var options = {
    hostname           : context.hostname,
    port               : context.port,
    path               : context.basePath + path,
    method             : method,
    headers            : {
      'Connection'     : 'keep-alive',
      'Accept'         : contentType,
      'Content-Type'   : contentType,
      'Content-Length' : payload ? Buffer.byteLength(payload) : 0
    }
  };

  var req = http.request(options, function (res) {

    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      if ((res.statusCode === 302 || res.statusCode === 303)
          && path === '/session') {
        var sessionId = res.headers.location;
        if (!sessionId) {
          fail(options, 'Received HTTP status ' + res.statucCode
              + ' without location header', res.headers, body, callback);
          return;
        }
        sessionId = sessionId.substring(sessionId.lastIndexOf('/') + 1);
        callback(null, {
          sessionId : sessionId
        });
        return;
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        fail(options, 'Unexpected HTTP status: ' + res.statusCode + ' '
            + http.STATUS_CODES[res.statusCode], res.headers, body, callback);
        return;
      }
      if (body) {
        var parsed;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          fail(options, 'Unexpected response:', null, body, callback);
          return;
        }
        if (parsed.status) {
          fail(options, 'Unexpected response status: ' + parsed.status,
              null, parsed.value.message, callback);
        } else {
          callback(null, parsed);
        }
      } else {
        callback(null);
      }
    });

  });

  req.on('error', function (e) {
    fail(options, 'Unexcected request error: ' + e.message, null, e.stack,
        callback);
  });

  if (payload) {
    req.write(payload);
  }
  req.end();
}

module.exports = request;
