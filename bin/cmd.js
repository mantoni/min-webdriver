#!/usr/bin/env node
'use strict';

var driver  = require('../lib/driver');
var options = require('../lib/options');

driver(process.stdin, options()).pipe(process.stdout);
