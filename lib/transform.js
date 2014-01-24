/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var through = require('through');

module.exports = function () {
  return through(function write(data) {
    this.queue('require("min-wd");');
    this.queue(data);
  });
};
