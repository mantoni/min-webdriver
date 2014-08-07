# Minimal WebDriver

Pipes stdin to all configured browsers using the Selenium
[WebDriver protocol][].

- Concurrent test runs
- SauceLabs support
- No web server required

Repository: <https://github.com/mantoni/min-webdriver>

---

## Install with npm

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
= internet explorer 9 ========================================================
Hello browser!
= chrome * ===================================================================
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

## License

MIT

[WebDriver protocol]: https://code.google.com/p/selenium/wiki/JsonWireProtocol
[browserify]: http://browserify.org
[Mocha]: http://visionmedia.github.io/mocha/
[Mochify]: https://github.com/mantoni/mochify.js
[mocaccino]: https://github.com/mantoni/mocaccino.js
