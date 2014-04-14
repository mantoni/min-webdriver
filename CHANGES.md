# Changes

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
