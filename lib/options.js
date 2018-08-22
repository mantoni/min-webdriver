/*
 * min-webdriver
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var fs = require('fs');
var path = require('path');
var resolve = require('resolve');

function override(options, overrides) {
  var k;
  for (k in overrides) {
    if (overrides.hasOwnProperty(k)) {
      options[k] = overrides[k];
    }
  }
}

function loadOptions(fileName, key, options) {
  var overrides;

  if (fs.existsSync(fileName)) {
    try {
      overrides = require(path.resolve(fileName));
    } catch (e) {
      overrides = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    }
    if (key) {
      overrides = overrides[key];
      if (!overrides) {
        return false;
      }
    }
    if (overrides.extends) {
      var shareableConfigPath = path.dirname(resolve
        .sync('min-wd-config-' + overrides.extends, {
          basedir: process.cwd()
        }));

      if (!loadOptions(path.resolve(shareableConfigPath, '.min-wd'), null,
        options)) {
        overrides = loadOptions(path.resolve(shareableConfigPath,
          'package.json'), 'webdriver', options);
      }
    }

    override(options, overrides);
    return true;
  }
  return false;
}

exports.retrieve = function retrieve(opts) {
  var options = {
    hostname      : 'localhost',
    port          : 4444,
    browsers      : [{
      name        : 'chrome'
    }],
    asyncPolling : true,
    pollingInterval : 1000,
    closeOnError  : true,
    closeOnSuccess : true
  };

  if (!loadOptions(opts.wdFile || '.min-wd', null, options)) {
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

// export for testing
module.exports._loadOptions = loadOptions;