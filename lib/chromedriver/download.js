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

const async = require('async');
const debug = require('debug')('selenium-download:chromedriver:download');
const fsExtra = require('fs.extra');
const AdmZip = require('adm-zip');
const _ = require('lodash');

const downloadFile = require('../download');
const validate = require('../checksum');

const copy = fsExtra.copy;
const move = fsExtra.move;

const extension = process.platform === 'win32' ? '.exe' : '';

function unzip(tempPath, filePath, callback) {
  const tempFilePath = `${filePath}.tmp`;

  function onMoved(error) {
    if (error != null) {
      return callback(error);
    }
    const zip = new AdmZip(tempFilePath);
    zip.extractAllTo(tempPath);
    fs.unlinkSync(tempFilePath);
    return callback();
  }

  return move(filePath, tempFilePath, onMoved);
}

function isValidExecutable(filename) {
  let stat;
  try {
    stat = fs.statSync(filename);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    return false;
  }
  debug('size(%j) = %d', filename, stat.size);
  // Quick sanity check - it should be bigger than an elf binary header
  return stat.size > 64;
}

function copyReplace(source, dest, callback) {
  function onDestUnlinked(err) {
    if (err && err.code !== 'ENOENT') {
      callback(err);
      return;
    }
    if (!err) {
      debug('removed old file at', dest);
    }
    copy(source, dest, callback);
  }
  fs.unlink(dest, onDestUnlinked);
}

function downloadChromeDriver(binPath, tempPath, version, url, callback) {
  const chromedriverPath = `${binPath}/chromedriver${extension}`;
  if (isValidExecutable(chromedriverPath)) {
    debug('already downloaded', chromedriverPath);
    return callback();
  }
  const tempFileName = `chromedriver_${version}`;
  const tempFilePath = `${tempPath}/${tempFileName}`;

  function makeExecutable(error) {
    if (error != null) {
      return callback(error);
    }
    return fs.chmod(chromedriverPath, '755', callback);
  }

  if (isValidExecutable(tempFilePath)) {
    debug('using previous download', tempFilePath);
    return copyReplace(tempFilePath, chromedriverPath, makeExecutable);
  }

  debug('download url', url);
  debug('tmp file', tempFilePath);
  debug('target file', chromedriverPath);

  const unzippedFilePath = `${tempPath}/chromedriver${extension}`;
  return async.waterfall(
    [
      _.partial(downloadFile, url, tempPath, tempFileName),
      _.partial(validate, tempFilePath),
      _.partial(unzip, tempPath, tempFilePath),
      _.partial(move, unzippedFilePath, tempFilePath),
      _.partial(copyReplace, tempFilePath, chromedriverPath),
    ],
    makeExecutable
  );
}
module.exports = downloadChromeDriver;
