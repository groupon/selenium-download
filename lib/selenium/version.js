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

const request = require('request');
const parseXml = require('xml2js').parseString;
const Semver = require('semver');

function buildDownloadUrl(version, minorVersion) {
  return `https://selenium-release.storage.googleapis.com/${minorVersion}/selenium-server-standalone-${version}.jar`;
}

const FALLBACK_SELENIUM_VERSION = '3.9.1';

function parseSelenium(result) {
  try {
    const contents = result.ListBucketResult.Contents;
    const standalone = contents
      .filter(content => {
        return content.Key[0].match(
          /selenium-server-standalone-\d+.\d+.\d+\.jar$/
        );
      })
      .map(s => s.Key[0].match(/(\d+\.\d+\.\d+)/)[0]);

    // Once 4.x is stable, we can go back to '*' or '<5' as our base range.
    const latest = Semver.maxSatisfying(standalone, '<4');

    return { error: null, version: latest };
  } catch (parseError) {
    return { error: parseError, version: null };
  }
}

function requestXml(url, callback) {
  function onParsedXml(error, result) {
    if (error != null) {
      return callback(error);
    }
    return callback(null, result);
  }

  return request(url, (error, response, body) => {
    if (error != null) {
      return callback(error);
    }
    return parseXml(body, onParsedXml);
  });
}

function getMinor(version) {
  return version.split('.').slice(0, 2).join('.');
}

function getLatestVersion(callback) {
  const url = 'https://selenium-release.storage.googleapis.com/';

  function onFullVersionData(error, result) {
    if (error != null) {
      return callback(error);
    }
    const parsed = parseSelenium(result);
    return callback(parsed.error, parsed.version);
  }

  return requestXml(url, onFullVersionData);
}

function getLatestDownloadInfo(callback) {
  return getLatestVersion((error, version) => {
    if (error != null) {
      version = FALLBACK_SELENIUM_VERSION;
      /* eslint no-console: 0 */
      console.log(
        '[testium] Unable to determine latest version of selenium standalone server; using %s',
        version
      );
      console.error(error.stack || error);
    }
    const minorVersion = getMinor(version);
    const downloadUrl = buildDownloadUrl(version, minorVersion);
    return callback(null, {
      downloadUrl,
      version,
    });
  });
}
module.exports = getLatestDownloadInfo;
