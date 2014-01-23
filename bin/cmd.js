#!/usr/bin/env node
/*jslint stupid: true*/
'use strict';

var driver  = require('../lib/driver');
var fs      = require('fs');

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

driver(process.stdin, options).pipe(process.stdout);
