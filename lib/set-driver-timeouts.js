'use strict';

var listen = require('listen');
var request = require('./request');

module.exports = function (ctx, timeout, cb) {
  var listener = listen();
  var type;

  request(ctx, "POST", "/timeouts", {
    type: "script",
    ms: timeout
  }, listener(type));

  request(ctx, "POST", "/timeouts/async_script", {
    ms: timeout
  }, listener(type));

  listener.then(cb);
};
