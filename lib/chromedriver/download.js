
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
var AdmZip, async, copy, downloadFile, fs, move, ref, unzip, validate;

fs = require('fs');

async = require('async');

ref = require('fs.extra'), copy = ref.copy, move = ref.move;

AdmZip = require('adm-zip');

downloadFile = require('../download');

validate = require('../checksum');

unzip = function(tempPath, filePath, callback) {
  var tempFilePath;
  tempFilePath = filePath + ".tmp";
  return move(filePath, tempFilePath, function(error) {
    var zip;
    if (error != null) {
      return callback(error);
    }
    zip = new AdmZip(tempFilePath);
    zip.extractAllTo(tempPath);
    fs.unlinkSync(tempFilePath);
    return callback();
  });
};

module.exports = function(binPath, tempPath, version, url, callback) {
  var chromedriverPath;
  chromedriverPath = binPath + "/chromedriver";
  return fs.stat(chromedriverPath, function(error) {
    var tempFileName, tempFilePath;
    if (error == null) {
      return callback();
    }
    tempFileName = "chromedriver_" + version;
    tempFilePath = tempPath + "/" + tempFileName;
    console.log('chromedriver/download:56 --> tempFilePath', tempFilePath);
    console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
    return fs.stat(tempFilePath, function(error) {
      var unzippedFilePath;
      if (!error) {
        return copy(tempFilePath, chromedriverPath, function(error) {
          if (error != null) {
            return callback(error);
          }
          return fs.chmod(chromedriverPath, '755', callback);
        });
      } else {
        unzippedFilePath = tempPath + "/chromedriver";
        return async.waterfall([
          function(done) {
            return downloadFile(url, tempPath, tempFileName, done);
          }, function(hash, done) {
            return validate(tempFilePath, hash, done);
          }, function(done) {
            return unzip(tempPath, tempFilePath, done);
          }, function(done) {
            return move(unzippedFilePath, tempFilePath, done);
          }, function(done) {
            return copy(tempFilePath, chromedriverPath, done);
          }, function(done) {
            return fs.chmod(chromedriverPath, '755', done);
          }
        ], callback);
      }
    });
  });
};
