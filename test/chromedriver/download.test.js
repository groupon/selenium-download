'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const assert = require('assert');

const downloadChromeDriver = require('../../lib/chromedriver/download');

// Downloaded, started to make sure it works, copied the file size.
const CHROME_DRIVER_SIZE = 10907892;

function tryRemove(filename) {
  try {
    fs.unlinkSync(filename);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

describe('downloadChromeDriver', () => {
  it('fails cleanly when the file is empty', done => {
    const tmpDir = os.tmpdir();
    const tmpFilePath = path.join(tmpDir, 'chromedriver_0.23');
    const driverPath = path.join(tmpDir, 'chromedriver');

    const badUrl =
      'https://chromedriver.storage.googleapis.com/2.23/chromedriver_mac32.zip';
    const goodUrl =
      'https://chromedriver.storage.googleapis.com/2.23/chromedriver_mac64.zip';

    tryRemove(tmpFilePath);
    tryRemove(driverPath);

    downloadChromeDriver(tmpDir, tmpDir, '0.23', badUrl, expectedError => {
      assert.ok(expectedError);
      assert.ok(expectedError.message.includes('404'));

      downloadChromeDriver(tmpDir, tmpDir, '0.23', goodUrl, unexpectedError => {
        if (unexpectedError) {
          done(unexpectedError);
          return;
        }
        assert.strictEqual(fs.statSync(tmpFilePath).size, CHROME_DRIVER_SIZE);
        done();
      });
    });
  });
});
