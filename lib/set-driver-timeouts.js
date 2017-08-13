'use strict';

var listen = require('listen');
var request = require('./request');

module.exports = function (ctx, timeouts, cb) {
  var listener = listen();
  var type;

  for (type in timeouts) {
    if (timeouts.hasOwnProperty(type)) {
      request(ctx, "POST", "/timeouts", {
        type: type,
        ms: timeouts[type]
      }, listener(type));
    }
  }

  listener.then(cb);
};
