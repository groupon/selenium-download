###
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
###

Download = require 'download'
multimeter = require 'multimeter'
bitsToSize = require 'prettysize'

# Initialize progress bar library
multi = multimeter(process)
multi.on "^C", process.exit
multi.charm.reset()
activeDownloadCount = 0

parseHashes = (rawHash) ->
  # format: crc32c=qRiQ9g==, md5=AAQvmRLFWmGR17P+ASORNQ==
  parse = (result, hash) ->
    parts = hash.trim().split('=')
    key = parts[0]
    value = parts.splice(1).join('=')
    result[key] = value
    result

  hashes = rawHash.split(',')
  hashes.reduce parse, {}

module.exports = (url, destinationDir, fileName, description, callback) ->
  hash = null

  fileOptions = { url, name: fileName }
  download = new Download(clear: false).get(fileOptions, destinationDir)

  download.use (response, file, next) ->
    fileLength = parseInt(response.headers["content-length"], 10)
    rawHash = response.headers['x-goog-hash']
    hash = parseHashes(rawHash).md5

    position = 0
    activeDownloadCount += 1

    multi.charm.position(1, (activeDownloadCount * 3) + 2)
    multi.write(description)
    bar = multi(1, (activeDownloadCount * 3) + 3, {width: 30})
    multi.charm.position(1, (activeDownloadCount * 3) + 5)

    response.on "data", (data) ->
      position += data.length
      percent = Math.round((position / fileLength) * 100)
      bar.ratio position, fileLength, msg = "#{percent}% - #{bitsToSize(position)} / #{bitsToSize(fileLength)}"

    response.on "end", ->
      bar.ratio fileLength, fileLength, msg = "COMPLETE"
      activeDownloadCount -= 1
      if activeDownloadCount == 0
        multi.charm.reset()
        multi.destroy()
      next()

  download.run (err, files) ->
    callback(err) if err?
    callback(null, hash)
