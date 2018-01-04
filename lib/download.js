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

const _ = require('lodash');
const request = require('request');

function parseHashes(rawHash) {
  function parse(result, hash) {
    const parts = hash.trim().split('=');
    const key = parts[0];
    const value = parts.splice(1).join('=');
    result[key] = value;
    return result;
  }
  const hashes = rawHash.split(',');
  return hashes.reduce(parse, {});
}

function downloadWithMD5(url, destinationDir, fileName, callback) {
  function onResponse(err, response, body) {
    if (err) return callback(err);
    if (response.statusCode !== 200) {
      return callback(
        new Error(`${response.statusCode} - failed to download ${url}`)
      );
    }

    const rawHash = response.headers['x-goog-hash'];
    if (!rawHash) {
      return callback(new Error(`Response did not contain a checksum: ${url}`));
    }

    const absoluteFile = path.join(destinationDir, fileName);
    return fs.writeFile(
      absoluteFile,
      body,
      _.partial(callback, _, parseHashes(rawHash).md5)
    );
  }

  request(url, { gzip: true, encoding: null }, onResponse);
}
module.exports = downloadWithMD5;
