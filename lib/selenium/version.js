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
var request = require('request');
var parseXml = require('xml2js').parseString;
var _ = require('lodash');

function buildDownloadUrl(version, minorVersion) {
  return 'https://selenium-release.storage.googleapis.com/' + minorVersion +
    '/selenium-server-standalone-' + version + '.jar';
}

var FALLBACK_SELENIUM_VERSION = '2.53.0';
var FORCE_SELENIUM_VERSION = {
  downloadUrl: buildDownloadUrl('2.53.0', '2.53'),
  version: '2.53.0'
};

function parseSeleniumMinor(result) {
  try {
    var prefixes = result.ListBucketResult.CommonPrefixes;
    var prefix = prefixes[prefixes.length - 2];
    var versionPath = prefix.Prefix[0];
    return {
      error: null,
      minorVersion: versionPath.substring(0, versionPath.length - 1)
    };
  } catch (parseError) {
    return { error: parseError, minorVersion: null };
  }
}

function parseSelenium(result) {
  try {
    var contents = result.ListBucketResult.Contents;
    var standalone = _.find(contents, function matchContent(content) {
      return content.Key[0].match(/selenium-server-standalone-/);
    });
    return {
      error: null,
      version: standalone.Key[0].match(/(\d+\.\d+\.\d+)/)[0]
    };
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

  return request(url, function onResponse(error, response, body) {
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
  var url = 'https://selenium-release.storage.googleapis.com/?delimiter=/&prefix=';

  function onFullVersionData(error, result) {
    if (error != null) {
      return callback(error);
    }
    var parsed = parseSelenium(result);
    return callback(parsed.error, parsed.version);
  }

  function onMinorVersionData(error, result) {
    if (error != null) {
      return callback(error);
    }
    var parsedMinor = parseSeleniumMinor(result);
    if (parsedMinor.error) {
      return callback(parsedMinor.error);
    }
    var prefixedUrl =
      'https://selenium-release.storage.googleapis.com/?delimiter=/&prefix=' +
      parsedMinor.minorVersion + '/';
    return requestXml(prefixedUrl, onFullVersionData);
  }

  return requestXml(url, onMinorVersionData);
}

function getLatestDownloadInfo(callback) {
  if (FORCE_SELENIUM_VERSION != null) {
    return callback(null, FORCE_SELENIUM_VERSION);
  }
  return getLatestVersion(function onVersion(error, version) {
    if (error != null) {
      version = FALLBACK_SELENIUM_VERSION;
      /* eslint no-console: 0 */
      console.log(
        '[testium] Unable to determine latest version of selenium standalone server; using %s',
        version);
      console.error(error.stack || error);
    }
    var minorVersion = getMinor(version);
    var downloadUrl = buildDownloadUrl(version, minorVersion);
    return callback(null, {
      downloadUrl: downloadUrl,
      version: version
    });
  });
}
module.exports = getLatestDownloadInfo;
