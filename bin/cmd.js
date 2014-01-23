#!/usr/bin/env node
/*jslint stupid: true*/
'use strict';

var driver  = require('../lib/driver');
var fs      = require('fs');

var options = JSON.parse(fs.readFileSync('.min-wd').toString());

driver(process.stdin, options).pipe(process.stdout);
