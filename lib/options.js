/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*jslint stupid: true*/
'use strict';

var fs = require('fs');

function override(options, overrides) {
  var k;
  for (k in overrides) {
    if (overrides.hasOwnProperty(k)) {
      options[k] = overrides[k];
    }
  }
}

function loadOptions(fileName, key, options) {
  if (fs.existsSync(fileName)) {
    var overrides = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    if (key) {
      overrides = overrides[key];
      if (!overrides) {
        return;
      }
    }
    override(options, overrides);
    return true;
  }
}

module.exports = function (opts) {
  var options = {
    hostname      : 'localhost',
    port          : 4444,
    browsers      : [{
      name        : 'chrome'
    }],
    closeOnError  : true,
    closeOnSuccess : true
  };

  if (!loadOptions('.min-wd', null, options)) {
    loadOptions('package.json', 'webdriver', options);
  }

  if (opts) {
    override(options, opts);
  }

  if (options.sauceLabs) {
    options.hostname = 'ondemand.saucelabs.com';
    options.port = 80;
    if (!options.sauceJobName && fs.existsSync('package.json')) {
      var packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      options.sauceJobName = packageJson.name;
    }
  }

  return options;
};
