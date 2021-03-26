/*
 * Copyright (c) 2014, Groupon, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of GROUPON nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const mkdirp = require('mkdirp');
const async = require('async');

const tempdir = require('./tempdir');
const ensureSelenium = require('./selenium');
const ensureChromedriver = require('./chromedriver');

const TEMP_PATH = `${tempdir}testium`;
const CHROMEDRIVER = 'chromedriver';
const SELENIUM_JAR = 'selenium.jar';

const BINARIES = [CHROMEDRIVER, SELENIUM_JAR];

function makePaths(binPath, tempPath) {
  mkdirp.sync(binPath);
  return mkdirp.sync(tempPath);
}

function cleanupDir(dir) {
  function deleteIfExists(filename) {
    try {
      fs.unlinkSync(path.join(dir, filename));
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }

  BINARIES.forEach(deleteIfExists);
}

function binariesExist(binPath) {
  return BINARIES.every(binary => {
    return fs.existsSync(`${binPath}/${binary}`);
  });
}

function ensure(binPath, callback) {
  if (binariesExist(binPath)) {
    return callback();
  }
  makePaths(binPath, TEMP_PATH);
  return async.parallel(
    [
      ensureSelenium(binPath, TEMP_PATH),
      ensureChromedriver(binPath, TEMP_PATH),
    ],
    callback
  );
}

function update(binPath, callback) {
  cleanupDir(binPath);
  return ensure(binPath, callback);
}

function forceUpdate(binPath, callback) {
  cleanupDir(binPath);
  cleanupDir(TEMP_PATH);
  return ensure(binPath, callback);
}

module.exports = {
  update,
  forceUpdate,
  ensure,
};
