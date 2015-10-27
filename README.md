# Minimal WebDriver

[![Build Status]](https://travis-ci.org/mantoni/min-webdriver)
[![SemVer]](http://semver.org)
[![License]](https://github.com/mantoni/min-webdriver/blob/master/LICENSE)

Pipe scripts to browsers using the Selenium [WebDriver protocol][].

- SauceLabs support
- Selenium Server 2 support
- Concurrent test runs
- No web server required

## Install

```
npm install min-wd
```

## Usage

Put a config file name `.min-wd` in your project directory:

```
{
  "hostname": "localhost",
  "port": 4444,
  "browsers": [{
    "name": "internet explorer",
    "version": "10"
  }, {
    "name": "chrome"
  }]
}
```

Alternatively, add a `webdriver` property with the configs to your
`package.json` file.

Assuming `my-script.js` contains this:

```js
console.log('Hello %s!', 'browser');
process.exit(0);
```

Use with [browserify][]:

```
$ browserify -p min-wd my-script.js
# internet explorer 9:
Hello browser!
# chrome *:
Hello browser!
```

## SauceLabs

Export your SauceLabs credentials:

```
export SAUCE_USERNAME="your-user-name"
export SAUCE_ACCESS_KEY="your-access-key"
```

Enable SauceLabs in your `.min-wd` file:

```
{
  "sauceLabs": true,
  "browsers": [...]
}
```

See ["Supported options"](#supported-options) for additional SauceLabs specific
options.

## Loading a web page

By default, min-webdriver will folk a new browser and inject the given script
straight away without loading any web page. If you want to run your test cases
in the context of a web page, you can configure the start page in the `.min-wd`
file:

```
{
  "url": "http://my-test-page"
}
```

## Mocha Support

Testing with [Mocha][] requires [mocaccino][]:

```
$ browserify -p mocaccino -p min-wd my-test.js
```

If this is your use case, make sure to give [Mochify][] a try.

## Timeouts

The default timeout for the log polling script is 10 seconds. If you have long
running test cases that don't print anything for more than 10 seconds, you can
increase the timeout by adding a `timeout` property to your config:

```
"timeout": 20000
```

**Notice:** This option is not used if explicitly setting the `asyncPolling` option to `false`.

## API

Use min-wd programatically with browserify like this:

```
var browserify = require('browserify');
var minWd = require('min-wd');

var b = browserify();
b.plugin(minWd, { timeout : 0 });
```

### Supported options

- `sauceLabs` whether to run tests with `saucelabs`. Defaults to `false`.
- `hostname` the host to connect to. Defaults to `localhost`. If `sauceLabs` is
  `true`, `ondemand.saucelabs.com` is used.
- `port` the port to connect to. Defaults to `4444`. If `sauceLabs` is `true`,
  `80` is used.
- `asyncPolling` whether to use async polling when looking for test results. Defaults to `true`.
- `timeout` if a script does not respond to log polling calls for this amount
  of milliseconds, the test run is aborted. Defaults to 10 seconds.
- `url` the URL to open in each browser. Defaults to no URL.
- `closeOnSuccess` whether to close browsers on success. Defaults to `true`.
- `closeOnError` whether to close browsers on error. Defaults to `true`.
- `browsers` an array of browser config objects, each with these properties:
    - `name` the name of the browser to launch, e.g. `chrome`, `firefox` or
      `internet explorer`
    - `version` the browser version to launch. Use `*` for any.
    - `url` an optional URL to launch for this browser

Some options are only considered depending on the `asyncPolling` value:

  - `pollingInterval` sets the time interval between test log checks. Only apply if `asyncPolling` is `false`. Defaults to 1000 milliseconds.
  - `timeout` option won't apply if `asyncPolling` is set to `false` because the test log is checked manually respecting `pollingInterval`.

SauceLabs specific options that only apply if `sauceLabs` is set to `true`:

- `sauceJobName` sets a custom name for the SauceLabs job. If a `package.json`
  file exists in the current directory, this defaults to the package name.
- `BUILD_VAR` sets the environment variable name that contains a build number
  to set, e.g. `TRAVIS_BUILD_NUMBER`.

## Known issues and solutions

`min-webdriver` injects your script directly into the default page launched by
the Selenium driver. In some cases browsers behave strangely in this context.
Work around this by specifying a URL to a simple web page that is loaded before
running the tests:

```
{
  "browsers": [{
    "name": "Internet Explorer",
    "version": "9",
    "url": "http://my-server/doctype.html"
  }]
}
```

With this content in the `doctype.html`:

```html
<!DOCTYPE html><html><head><meta encoding="utf-8"></head><body></body></html>
```

You can also specify a `"url"` for all browser on the root level.

Loading a page before injecting the scripts is solving these issues:

- IE 9 reporting it can't find `JSON` because the Selenium default page makes
  IE switch to quirks mode
- Error: `SECURITY_ERR: DOM Exception 18` because setting cookies is not
  allowed for `file://` URLs
- Error: `access to the Indexed Database API is denied in this context`
- localStorage being inaccessible.

#### Usage with Microsoft Edge browser

For the time being, MS Edge currently doesn't support `asyncPolling` set to `true`.

If you want to test with that browser you must set `asyncPolling` to `false`.

## Compatibility

- Node 0.10 or later
- Selenium Server 2.39 or later

## License

MIT

[Build Status]: http://img.shields.io/travis/mantoni/min-webdriver.svg
[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/min-wd.svg
[WebDriver protocol]: https://code.google.com/p/selenium/wiki/JsonWireProtocol
[browserify]: http://browserify.org
[Mocha]: http://visionmedia.github.io/mocha/
[Mochify]: https://github.com/mantoni/mochify.js
[mocaccino]: https://github.com/mantoni/mocaccino.js
