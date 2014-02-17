# Minimal WebDriver

Pipes stdin to all configured browsers using the Selenium
[WebDriver protocol][].

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
    "version": "9"
  }, {
    "name": "chrome"
  }]
}
```

Assume `my-script.js` contains this:

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

### Loading a web page

By default, min-wd will folk a new browser and inject the given script straight
away without loading any web page. If you want to run your test cases in the
context of a web page, you can configure the start page in the `.min-wd` file:

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

### IE trouble shooting

 This might cause trouble with IE where it
reports it can't find `JSON`. The Selenium default page makes IE switch to
quirks mode. To avoid this load a web page as described above.

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
[mocaccino]: https://github.com/mantoni/mocaccino.js
