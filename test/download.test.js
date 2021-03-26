'use strict';

const fs = require('fs');
const { execFile } = require('child_process');
const path = require('path');

const assert = require('assert');
const rimraf = require('rimraf');

const tempdir = require('../lib/tempdir');
const seleniumDownload = require('..');

const BIN_PATH = path.join(__dirname, 'bin');
const TMP_PATH = `${tempdir}testium`;

const CHROMEDRIVER = path.join(BIN_PATH, 'chromedriver');
const SELENIUM_JAR = path.join(BIN_PATH, 'selenium.jar');
const CUSTOM_SCRIPT = path.join(BIN_PATH, 'innocent-bystander');

function clearFileSystem() {
  rimraf.sync(TMP_PATH);
  rimraf.sync(BIN_PATH);
}

clearFileSystem();

describe('seleniumDownload', () => {
  before(clearFileSystem);

  after(clearFileSystem);

  before('initial download', done => {
    seleniumDownload.update(BIN_PATH, done);
  });

  it('downloads the proper files', () => {
    assert.ok(fs.existsSync(CHROMEDRIVER));
    assert.ok(fs.existsSync(SELENIUM_JAR));
  });

  describe('from local tmp', () => {
    before(done => {
      fs.writeFileSync(
        CUSTOM_SCRIPT,
        'Hours of important work that I did not commit yet'
      );
      seleniumDownload.update(BIN_PATH, done);
    });

    it('downloads the files again', () => {
      assert.ok(fs.existsSync(CHROMEDRIVER));
      assert.ok(fs.existsSync(SELENIUM_JAR));
      assert.ok(fs.existsSync(CUSTOM_SCRIPT));
    });

    it('did not download an invalid jar', done => {
      execFile(
        'java',
        [
          // -h means "show usage/help". Selenium has no --version :(
          '-jar',
          SELENIUM_JAR,
          '-h',
        ],
        error => {
          clearFileSystem();
          done(error);
        }
      );
    });
  });
});
