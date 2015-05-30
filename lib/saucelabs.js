var SauceLabs = require('saucelabs');

module.exports.updateSauceJob = function (sessionId, passed, options, callback) {
  if (!callback) {
    callback = options;
    options = {
      build: null,
      sauceJobName: null
    };
  }

  var sauceClient = new SauceLabs({
    username: process.env.SAUCE_USERNAME,
    password: process.env.SAUCE_ACCESS_KEY
  });

  sauceClient.updateJob(
    sessionId,
    { name: options.sauceJobName, passed: passed, build: options.build },
    function (err) {
      callback(err);
    }
  );
};