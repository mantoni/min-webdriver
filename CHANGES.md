# Changes

## 2.12.0

A change from Thomas Junghans now [allows to have sharable configs][pull-24].
It works similar to sharable configs in eslint. Check out the readme for
instructions.

- [`1d5b9a2`](https://github.com/mantoni/min-webdriver/commit/1d5b9a23bb7b2effef1938b8b98a5538f87b2971)
  feature: add shareable config support (Thomas Junghans)
- [`a3ce836`](https://github.com/mantoni/min-webdriver/commit/a3ce836fd9550b0171f75a5ca2297de280d6649c)
  Add contributor
- [`df66b9d`](https://github.com/mantoni/min-webdriver/commit/df66b9d85e314c50abd91721833dfc8cfc82a2ca)
  Update Studio Changes for `--footer` support

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2018-09-05._

[pull-24]: https://github.com/mantoni/min-webdriver/pull/24

## 2.11.2

- [`7728d9f`](https://github.com/mantoni/min-webdriver/commit/7728d9f5c183e28b173af0c69c128dcec968925f)
  Fix issue in request module invoking a callback without both an error and a response (Davide Callegari)
- [`437bc7f`](https://github.com/mantoni/min-webdriver/commit/437bc7f4d07a919028b05428c781f131f7d2bf0e)
  Add contributor (Maximilian Antoni)
- [`25cf173`](https://github.com/mantoni/min-webdriver/commit/25cf173096551a3e60a685c645d4da5612d69b61)
  Update Studio Changes (Maximilian Antoni)
- [`aa3ea84`](https://github.com/mantoni/min-webdriver/commit/aa3ea8476b73813d35f2e12f569257dfc781b5ac)
  Run build in node 10 (Maximilian Antoni)

## 2.11.1

- [`d9eb5d4`](https://github.com/mantoni/min-webdriver/commit/d9eb5d4cc18eb8e4b113e3a4f19a8661138d917b)
  Improve browser title
- [`7fb8c3c`](https://github.com/mantoni/min-webdriver/commit/7fb8c3c0b5e50c6072e7df8abe397b9b9ddd19e9)
  Add commit links with `--commits`
- [`32a3e02`](https://github.com/mantoni/min-webdriver/commit/32a3e02094b1c330b07b72eb76bbe6a91ffa2468)
  Replace jslint with eslint
- [`66bd668`](https://github.com/mantoni/min-webdriver/commit/66bd66853054f1b5f29c5b95c9862b09c0ec4402)
  Update dependencies

## 2.11.0

Steffen André Langnes added the ability to configure custom capabilities.

- Allow custom capabilities
- Fix example in readme for loading .min-wd file as module
- Add BrowserStack example to readme

## 2.10.0

- Support Appium with iOS Simulator
- Fix "SauceLabs on Travis" link
- Update Mocha link (Morton Fox)

## 2.9.3

Decrease buffer size even further due to Chrome issue still occurring.

## 2.9.2

Further decreases the buffer size introduced in `v2.9.1` to work around the
Chrome driver issue which still occurs occasionally.

## 2.9.1

Running test suits or projects sometimes caused issues with Chrome. This appears
to be an issue with a buffer size limit when executing scripts through
`chromedriver`.

With this path, scripts are no longer injected directly. Instead, a small
receiver function is injected and the actual test code is sent to that function
in chunks, bypassing the buffer limit. Once the script was fully received by the
browser, it is injected with a new `<script>` tag.

Related issues:

- <https://github.com/mantoni/mochify.js/issues/110>
- <https://github.com/sinonjs/sinon/issues/912>
- <https://bugs.chromium.org/p/chromedriver/issues/detail?id=402>

## 2.9.0

Moshe Kolodnya [made it possible][PR14] to use a different config file. He also
[sent a PR][PR13] to allow the `.min-wd` file to be loaded as a node module.
Thanks!

[PR14]: https://github.com/mantoni/min-webdriver/pull/14
[PR13]: https://github.com/mantoni/min-webdriver/pull/13

## 2.8.0

- Streams 3: bump dependencies

## 2.7.0

- Add the option to test using synchronous polling (Matheus Kautzmann)
- Bump saucelabs version to `^1.0` (Matheus Kautzmann)

## 2.6.1

- Update through2 to `^1.1`

## 2.6.0

- Default `sauceJobName` to the name property in cwd `package.json`

## 2.5.1

- Improve documentation for SauceLabs specific options

## 2.5.0

- Update Sauce Job with passed and build attribute (az7arul)

## 2.4.2

- Fix `write after end` bug

## 2.4.1

- Start log polling more quickly
- Write out parsed response status code in failure cases

## 2.4.0

- Pipe output back to browserify instead of stdout

## 2.3.0

- Add `closeOnError` and `closeOnSuccess` options (Dustin Wyatt)

## 2.2.2

- Print browser names with leading '#'

## 2.2.1

- Wait for queue drain before continue polling
- Don't end queue twice

## 2.2.0

- Bump resolve and source-mapper to ^1.0

## 2.1.1

- Log error output to `context.out` instead of `process.stderr`

## 2.1.0

- Map stack traces to original sources using inline source maps

## 2.0.2

- Pipe output to stdout again

## 2.0.1

- Remove brout again

## 2.0.0

- Convert from transform into plugin

## 1.0.0

- Use brout 1.0

## 0.4.5

- Only inject `require` into `.js` files
- Attempt to parse error message from Selenium WebDriver server

## 0.4.4

- Bump brout

## 0.4.3

- Set timeout to `0` to skip setting a log polling timeout

## 0.4.2

- Load a url for a specific browser (for IE 9 doctype workaround)
- Configure timeout for log polling
- Improved log flushing
- Improved http error handling for 302 / 303 responses

## 0.4.1

- Stream browser output instead of buffering per browser. Prints logs from
  first browser in the queue as they arrive, buffering up the other ones.

## 0.4.0

- SauceLabs support
- Load options from package.json

## 0.3.0

- Support for custom start URL

## 0.2.0

- Added callback API
- Simplified transform

## 0.1.0

- Initial release
