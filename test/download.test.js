'use strict';
var fs = require('fs');
var execFile = require('child_process').execFile;

var assert = require('assertive');
var rmrf = require('rimraf');

var tempdir = require('../lib/tempdir');
var seleniumDownload = require('..');

var BIN_PATH = __dirname + '/bin';
var TMP_PATH = tempdir + 'testium';

function clearFileSystem() {
  rmrf.sync(TMP_PATH);
  rmrf.sync(BIN_PATH);
}

clearFileSystem();

describe('seleniumDownload', function () {
  before(clearFileSystem);

  after(clearFileSystem);

  before('initial download', function (done) {
    this.timeout(30000);
    seleniumDownload.update(BIN_PATH, done);
  });

  it('downloads the proper files', function () {
    assert.expect(fs.existsSync(BIN_PATH + '/chromedriver'));
    assert.expect(fs.existsSync(BIN_PATH + '/selenium.jar'));
  });

  describe('from local tmp', function () {
    before(function (done) {
      this.timeout(30000);
      seleniumDownload.update(BIN_PATH, done);
    });

    it('downloads the files again', function () {
      assert.expect(fs.existsSync(BIN_PATH + '/chromedriver'));
      assert.expect(fs.existsSync(BIN_PATH + '/selenium.jar'));
    });

    it('did not download an invalid jar', function (done) {
      this.timeout(10000);
      execFile('java', [
        // -h means "show usage/help". Selenium has no --version :(
        '-jar', BIN_PATH + '/selenium.jar', '-h'
      ], function (error) {
        clearFileSystem();
        done(error);
      });
    });
  });
});
