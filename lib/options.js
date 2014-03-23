/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var fs = require('fs');

function loadOptions(fileName, key, options) {
  /*jslint stupid: true*/
  if (fs.existsSync(fileName)) {
    var overrides = JSON.parse(fs.readFileSync(fileName).toString());
    if (key) {
      overrides = overrides[key];
      if (!overrides) {
        return;
      }
    }
    var k;
    for (k in overrides) {
      if (overrides.hasOwnProperty(k)) {
        options[k] = overrides[k];
      }
    }
    return true;
  }
}

module.exports = function () {
  var options = {
    hostname : 'localhost',
    port     : 4444,
    browsers : [{
      name   : 'chrome'
    }]
  };

  if (!loadOptions('.min-wd', null, options)) {
    loadOptions('package.json', 'webdriver', options);
  }

  if (options.sauceLabs) {
    options.hostname = 'ondemand.saucelabs.com';
    options.port = 80;
  }

  return options;
};
