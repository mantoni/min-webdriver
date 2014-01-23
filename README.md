# Minimal WebDriver

Pipes stdin to all configured browsers using the [WebDriver protocol][].

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

Testing with [Mocha][] requires [mocaccino][]:

```
$ browserify -t min-wd my-test.js | mocaccino -b -r list | min-wd
```

## License

MIT

[WebDriver protocol]: https://code.google.com/p/selenium/wiki/JsonWireProtocol
[browserify]: http://browserify.org
[Mocha]: http://visionmedia.github.io/mocha/
[mocaccino]: https://github.com/mantoni/mocaccino.js
