/*global window*/
'use strict';

var brout   = require('brout');
var logs    = [];
var pending = null;

function flush() {
  pending(logs.join(''));
  logs.length = 0;
  pending = null;
}

window._webdriver_poll = function (callback) {
  pending = callback;
  if (logs.length) {
    flush();
  }
};

brout.on('out', function (str) {
  logs.push(str);
});
brout.on('err', function (str) {
  logs.push(str);
});
brout.on('exit', function (code) {
  logs.push('\nWEBDRIVER_EXIT(' + code + ')\n');
});
