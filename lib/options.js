/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var fs = require('fs');

module.exports = function () {
  /*jslint stupid: true*/
  var options = {
    hostname : 'localhost',
    port     : 4444,
    browsers : [{
      name   : 'chrome'
    }]
  };

  if (fs.existsSync('.min-wd')) {
    var overrides = JSON.parse(fs.readFileSync('.min-wd').toString());
    var k;
    for (k in overrides) {
      if (overrides.hasOwnProperty(k)) {
        options[k] = overrides[k];
      }
    }
  }

  return options;
};
