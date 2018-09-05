'use strict';
/*eslint-env mocha*/
var path = require('path');
var fs = require('fs');
var assert = require('assert');
var sinon = require('sinon');
var options = require('../lib/options');

describe('options', function () {
  var sandbox = sinon.createSandbox();

  this.afterEach(function () {
    sandbox.restore();
  });

  it('returns defaults', function () {
    assert.deepEqual(options.retrieve({}), {
      hostname: 'localhost',
      port: 4444,
      browsers: [{ name: 'chrome' }],
      asyncPolling: true,
      pollingInterval: 1000,
      closeOnError: true,
      closeOnSuccess: true
    });
  });

  describe('_loadOptions', function () {
    it('returns false if specified file does not exist', function () {
      sandbox.stub(fs, 'existsSync').returns(false);

      assert.equal(options._loadOptions(), false);
    });

    it('loads overrides from js file', function () {
      var fileName = path.resolve(__dirname, 'fixtures', 'options.js');
      var opts = {
        hostname: 'localhost',
        port: 4444
      };
      assert.ok(options._loadOptions(fileName, null, opts));
      assert.deepEqual(opts, {
        hostname: 'my.local',
        port: 4444
      });
    });

    it('loads overrides from text file', function () {
      var fileName = path.resolve(__dirname, 'fixtures', '.min-wd');
      var opts = {
        hostname: 'localhost',
        port: 4444
      };
      assert.ok(options._loadOptions(fileName, null, opts));
      assert.deepEqual(opts, {
        hostname: 'my.local',
        port: 4444
      });
    });
  });

  describe('shareable config override', function () {
    var defaultCwd = process.cwd();

    afterEach(function () {
      process.chdir(defaultCwd);
    });

    it('applies config specified in package.json', function () {
      process.chdir(path.resolve(__dirname, 'fixtures', 'component-a'));

      assert.equal(options.retrieve({}).hostname, 'my.local');
    });

    it('throws if wrong config name is given to `extends`', function () {
      process.chdir(path.resolve(__dirname, 'fixtures', 'component-b'));

      assert.throws(function () {
        options.retrieve({});
      });
    });

    it('ignores missing `webdriver.extends` in config package.json',
      function () {
        process.chdir(path.resolve(__dirname, 'fixtures', 'component-c'));

        assert.equal(options.retrieve({}).hostname, 'localhost');
      });

    it('applies .min-wd config over package.json in shareable config',
      function () {
        process.chdir(path.resolve(__dirname, 'fixtures', 'component-d'));

        assert.equal(options.retrieve({}).hostname, 'min-wd.local');
        assert.equal(options.retrieve({}).port, 2727);
      });

    it('is overridden by .min-wd', function () {
      process.chdir(path.resolve(__dirname, 'fixtures', 'component-d'));

      assert.equal(options.retrieve({}).hostname, 'min-wd.local');
    });
  });
});
