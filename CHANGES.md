# Changes

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
