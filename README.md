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
npm install min-wd -g
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
$ browserify -t min-wd my-script.js | min-wd
= internet explorer 9 ========================================================
Hello browser!
= chrome * ===================================================================
Hello browser!
```

### SauceLabs

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

### Loading a web page

By default, min-webdriver will folk a new browser and inject the given script
straight away without loading any web page. If you want to run your test cases
in the context of a web page, you can configure the start page in the `.min-wd`
file:

```
{
  "url": "http://my-test-page"
}
```

### Mocha Support

Testing with [Mocha][] requires [mocaccino][]:

```
$ browserify -t min-wd my-test.js | mocaccino -b -r list | min-wd
```

If this is your use case, make sure to give [Mochify][] a try.

### IE trouble shooting

If IE reports it can't find `JSON`, then the Selenium default page makes IE
switch to quirks mode. To avoid this, load a web page as described above.

Here is a minimal node server that does the job:

```js
var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
  res.end('<!DOCTYPE html><html><head><meta encoding="utf-8"></head>'
    + '<body></body></html>');
}).listen(4445);
```

## License

MIT

[WebDriver protocol]: https://code.google.com/p/selenium/wiki/JsonWireProtocol
[browserify]: http://browserify.org
[Mocha]: http://visionmedia.github.io/mocha/
[Mochify]: https://github.com/mantoni/mochify.js
[mocaccino]: https://github.com/mantoni/mocaccino.js
