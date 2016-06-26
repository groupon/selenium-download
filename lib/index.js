
/*
Copyright (c) 2014, Groupon, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of GROUPON nor the names of its contributors may be
used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var TEMP_PATH, async, binariesExist, ensure, ensureChromedriver, ensureSelenium, existsSync, forceUpdate, makePaths, mkdirp, removeDir, rmrfSync, tempdir, update;

existsSync = require('fs').existsSync;

rmrfSync = require('fs.extra').rmrfSync;

mkdirp = require('mkdirp');

async = require('async');

tempdir = require('./tempdir');

ensureSelenium = require('./selenium');

ensureChromedriver = require('./chromedriver');

TEMP_PATH = tempdir + "testium";

makePaths = function(binPath, tempPath) {
  mkdirp.sync(binPath);
  return mkdirp.sync(tempPath);
};

removeDir = function(dir) {
  return rmrfSync(dir);
};

binariesExist = function(binPath) {
  return ['selenium.jar'].every(function(binary) {
    console.log('binary:', binary);
    console.log(" >>---> " + binPath + "/" + binary);
    return existsSync(binPath + "/" + binary);
  });
};

ensure = function(binPath, callback) {
  if (binariesExist(binPath)) {
    return callback();
  }
  makePaths(binPath, TEMP_PATH);
  return async.parallel([ensureSelenium(binPath, TEMP_PATH), ensureChromedriver(binPath, TEMP_PATH)], callback);
};

update = function(binPath, callback) {
  removeDir(binPath);
  return ensure(binPath, callback);
};

forceUpdate = function(binPath, callback) {
  removeDir(binPath);
  removeDir(TEMP_PATH);
  return ensure(binPath, callback);
};

module.exports = {
  update: update,
  forceUpdate: forceUpdate,
  ensure: ensure
};
