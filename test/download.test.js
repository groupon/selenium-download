'use strict';
var fs = require('fs');
var execFile = require('child_process').execFile;
var path = require('path');

var assert = require('assertive');
var rmrfSync = require('fs.extra').rmrfSync;

var tempdir = require('../lib/tempdir');
var seleniumDownload = require('..');

var BIN_PATH = path.join(__dirname, 'bin');
var TMP_PATH = tempdir + 'testium';

var CHROMEDRIVER = path.join(BIN_PATH, 'chromedriver');
var SELENIUM_JAR = path.join(BIN_PATH, 'selenium.jar');
var CUSTOM_SCRIPT = path.join(BIN_PATH, 'innocent-bystander');

function clearFileSystem() {
  rmrfSync(TMP_PATH);
  rmrfSync(BIN_PATH);
}

clearFileSystem();

describe('seleniumDownload', function () {
  before(clearFileSystem);

  after(clearFileSystem);

  before('initial download', function (done) {
    seleniumDownload.update(BIN_PATH, done);
  });

  it('downloads the proper files', function () {
    assert.expect(fs.existsSync(CHROMEDRIVER));
    assert.expect(fs.existsSync(SELENIUM_JAR));
  });

  describe('from local tmp', function () {
    before(function (done) {
      fs.writeFileSync(CUSTOM_SCRIPT,
        'Hours of important work that I did not commit yet');
      seleniumDownload.update(BIN_PATH, done);
    });

    it('downloads the files again', function () {
      assert.expect(fs.existsSync(CHROMEDRIVER));
      assert.expect(fs.existsSync(SELENIUM_JAR));
      assert.expect(fs.existsSync(CUSTOM_SCRIPT));
    });

    it('did not download an invalid jar', function (done) {
      execFile('java', [
        // -h means "show usage/help". Selenium has no --version :(
        '-jar', SELENIUM_JAR, '-h'
      ], function (error) {
        clearFileSystem();
        done(error);
      });
    });
  });
});
