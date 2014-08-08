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


function addFile(b, file, expose) {
  b.add('./' + path.relative(process.cwd(), file).replace(/\\/g, '/'), {
    expose : expose
  });
}

module.exports = function (b, opts) {

  var broutFile = resolve.sync('brout', {
    baseDir: __dirname,
    packageFilter: function (pkg) {
      return { main : pkg.browser };
    }
  });
  addFile(b, broutFile, 'brout');
  var clientFile = path.join(__dirname, 'client.js');
  addFile(b, clientFile, 'min-wd');

  var stream = through();
  var wrap = b.pipeline.get('wrap');
  wrap.push(stream);
  wrap.push(through(function () {
    // Swallow.
    return;
  }));
  wrap.push(driver(stream, options(opts || {}), function (err) {
    if (err) {
      b.emit('error', err);
    }
  }));

};
