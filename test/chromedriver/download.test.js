'use strict';
var fs = require('fs');
var os = require('os');
var path = require('path');

var assert = require('assertive');

var downloadChromeDriver = require('../../lib/chromedriver/download');

// Downloaded, started to make sure it works, copied the file size.
var CHROME_DRIVER_SIZE = 10907892;

function tryRemove(filename) {
  try {
    fs.unlinkSync(filename);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

describe('downloadChromeDriver', function () {
  it('fails cleanly when the file is empty', function (done) {
    var tmpDir = os.tmpdir();
    var tmpFilePath = path.join(tmpDir, 'chromedriver_0.23');
    var driverPath = path.join(tmpDir, 'chromedriver');

    var badUrl = 'https://chromedriver.storage.googleapis.com/2.23/chromedriver_mac32.zip';
    var goodUrl = 'https://chromedriver.storage.googleapis.com/2.23/chromedriver_mac64.zip';

    tryRemove(tmpFilePath);
    tryRemove(driverPath);

    downloadChromeDriver(tmpDir, tmpDir, '0.23', badUrl, function (expectedError) {
      assert.truthy(expectedError);
      assert.include('404', expectedError.message);

      downloadChromeDriver(tmpDir, tmpDir, '0.23', goodUrl, function (unexpectedError) {
        if (unexpectedError) {
          done(unexpectedError);
          return;
        }
        assert.equal(CHROME_DRIVER_SIZE, fs.statSync(tmpFilePath).size);
        done();
      });
    });
  });
});
