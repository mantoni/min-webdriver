/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var through = require('through');
var insert  = true;

module.exports = function () {
  return through(function write(data) {
    if (insert) {
      this.queue('require("min-wd");');
      insert = false;
    }
    this.queue(data);
  }, function end() {
    this.queue(null);
  });
};
