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
var resolve = require('resolve');
var driver  = require('../lib/driver');
var options = require('../lib/options');


function relative(file) {
  return './' + path.relative(process.cwd(), file).replace(/\\/g, '/');
}

module.exports = function (b, opts) {

  var clientFile = path.join(__dirname, 'client.js');
  b.add(relative(clientFile), {
    expose : 'min-wd'
  });

  var stream = through();
  var wrap = b.pipeline.get('wrap');
  wrap.push(stream);
  wrap.push(through(function () {
    // Swallow.
    return;
  }));
  driver(stream, options(opts || {}), function (err) {
    if (err) {
      b.emit('error', err);
    }
  }).pipe(process.stdout);

};
