/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var path    = require('path');
var through = require('through');
var driver  = require('../lib/driver');
var options = require('../lib/options');

module.exports = function (b) {

  b.add(path.join(__dirname, 'client.js'), { expose : 'min-wd' });

  var stream = through();
  var wrap = b.pipeline.get('wrap');
  wrap.push(stream);
  wrap.push(through(function () {
    // Swallow output.
    return;
  }));

  driver(stream, options(), function (err) {
    if (err) {
      process.nextTick(function () {
        process.exit(1);
      });
    }
  }).pipe(process.stdout);

};
