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
var fs = require('fs');

var async = require('async');
var fsExtra = require('fs.extra');
var AdmZip = require('adm-zip');
var _ = require('lodash');

var downloadFile = require('../download');
var validate = require('../checksum');

var copy = fsExtra.copy;
var move = fsExtra.move;

var extension = process.platform === 'win32' ? '.exe' : '';

function unzip(tempPath, filePath, callback) {
  var tempFilePath = filePath + '.tmp';

  function onMoved(error) {
    var zip;
    if (error != null) {
      return callback(error);
    }
    zip = new AdmZip(tempFilePath);
    zip.extractAllTo(tempPath);
    fs.unlinkSync(tempFilePath);
    return callback();
  }

  return move(filePath, tempFilePath, onMoved);
}

function downloadChromeDriver(binPath, tempPath, version, url, callback) {
  var chromedriverPath = binPath + '/chromedriver';
  if (fs.existsSync(chromedriverPath)) {
    return callback();
  }
  var tempFileName = 'chromedriver_' + version;
  var tempFilePath = tempPath + '/' + tempFileName;

  function makeExecutable(error) {
    if (error != null) {
      return callback(error);
    }
    return fs.chmod(chromedriverPath, '755', callback);
  }

  if (fs.existsSync(tempFilePath)) {
    return copy(tempFilePath, chromedriverPath, makeExecutable);
  }

  var unzippedFilePath = tempPath + '/chromedriver' + extension;
  return async.waterfall([
    _.partial(downloadFile, url, tempPath, tempFileName),
    _.partial(validate, tempFilePath),
    _.partial(unzip, tempPath, tempFilePath),
    _.partial(move, unzippedFilePath, tempFilePath),
    _.partial(copy, tempFilePath, chromedriverPath)
  ], makeExecutable);
}
module.exports = downloadChromeDriver;
