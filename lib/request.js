'use strict';

var http = require('http');

function indent(string) {
  return string.replace(/^/gm, '    ');
}

function fail(options, message, body, callback) {
  process.stderr.write(options.method);
  process.stderr.write(' ');
  process.stderr.write(options.path);
  process.stderr.write('\n\n');
  process.stderr.write(message);
  if (body) {
    process.stderr.write('\n');
    process.stderr.write(indent(body.replace(/^\s+$/gm, '')));
  }
  process.stderr.write('\n\n');
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
      'Accept'         : 'application/json;charset=utf-8',
      'Content-Type'   : 'application/json;charset=utf-8',
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
      if (res.statusCode < 200 || res.status >= 300) {
        fail(options, 'Unexpected HTTP status: ' + res.statusCode, body,
            callback);
      } else {
        if (body) {
          var parsed = JSON.parse(body);
          if (parsed.status) {
            fail(options, 'Unexpected response status: ' + parsed.status,
                parsed.value.message, callback);
          } else {
            callback(null, parsed);
          }
        } else {
          callback(null);
        }
      }
    });

  });

  req.on('error', function (e) {
    fail(options, 'Unexcected request error: ' + e.message, e.stack, callback);
  });

  if (payload) {
    req.write(payload);
  }
  req.end();
}

module.exports = request;
