/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
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
  /*jslint stupid: true*/
  if (fs.existsSync(fileName)) {
    var overrides = JSON.parse(fs.readFileSync(fileName).toString());
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
    hostname : 'localhost',
    port     : 4444,
    browsers : [{
      name   : 'chrome'
    }]
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
  }

  return options;
};
