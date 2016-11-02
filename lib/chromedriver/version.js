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
var FALLBACK_CHROMEDRIVER_VERSION = '2.23';

var request = require('request');

function getArchitecture() {
  var platform = process.platform;
  if (platform !== 'linux' && platform !== 'darwin' && platform !== 'win32') {
    throw new Error(
      'Unsupported platform ' + platform + '. ' +
      'Only linux, darwin, and win32 are supported.');
  }
  var bitness = process.arch.substr(1);
  if (platform === 'darwin') {
    platform = 'mac';
    bitness = '64';
  }
  if (platform === 'win32') {
    platform = 'win';
    bitness = '32';
  }
  return {
    platform: platform,
    bitness: bitness
  };
}

function getLatestVersion(callback) {
  function onBody(error, response, body) {
    if (error != null) {
      return callback(error);
    }
    return callback(null, body);
  }
  return request('https://chromedriver.storage.googleapis.com/LATEST_RELEASE', onBody);
}

function getLatestDownloadInfo(callback) {
  function onVersion(error, version) {
    if (error != null) {
      version = FALLBACK_CHROMEDRIVER_VERSION;
      /* eslint no-console: 0 */
      console.log(
        '[testium] Unable to determine latest version of selenium chromedriver; using %s', version);
      console.error(error.stack || error);
    } else {
      version = version.trim();
    }
    var arch = getArchitecture();
    var platform = arch.platform;
    var bitness = arch.bitness;
    var downloadUrl =
      'https://chromedriver.storage.googleapis.com/' + version +
      '/chromedriver_' + platform + bitness + '.zip';

    return callback(null, {
      downloadUrl: downloadUrl,
      version: version
    });
  }

  return getLatestVersion(onVersion);
}
module.exports = getLatestDownloadInfo;
