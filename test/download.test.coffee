fs = require 'fs'
{execFile} = require 'child_process'

assert = require 'assert'
rmrf = require 'rimraf'

tempdir = require '../lib/tempdir'
seleniumDownload = require '..'

BIN_PATH = __dirname + '/bin'
TMP_PATH = "#{tempdir}testium"

clearFileSystem = ->
  rmrf.sync TMP_PATH
  rmrf.sync BIN_PATH

clearFileSystem()

describe 'seleniumDownload', ->
  before clearFileSystem

  after clearFileSystem

  before 'initial download', (done) ->
    @timeout 30000
    seleniumDownload.update BIN_PATH, done

  it 'downloads the proper files', ->
    assert fs.existsSync(BIN_PATH + '/chromedriver')
    assert fs.existsSync(BIN_PATH + '/selenium.jar')

  describe 'from local tmp', ->
    before (done) ->
      @timeout 30000
      seleniumDownload.update BIN_PATH, done

    it 'downloads the files again', ->
      assert fs.existsSync(BIN_PATH + '/chromedriver')
      assert fs.existsSync(BIN_PATH + '/selenium.jar')

    it 'did not download an invalid jar', (done) ->
      @timeout 10000
      execFile 'java', [
        # -h means "show usage/help". Selenium has no --version :(
        '-jar', BIN_PATH + '/selenium.jar', '-h'
      ], (error, stdout) ->
        clearFileSystem()
        done error
