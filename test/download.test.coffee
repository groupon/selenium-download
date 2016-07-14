fs = require 'fs'
{execFile} = require 'child_process'

assert = require 'assertive'
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
  console.log 'huh'
  before clearFileSystem

  #after clearFileSystem

  before 'initial download', (done) ->
    console.log 'test/download:25', TMP_PATH, BIN_PATH
    console.log ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
    seleniumDownload.update BIN_PATH, done

  it.only 'downloads the proper files', (done) ->
    console.log 'test/download:30' + BIN_PATH + '/chromedriver'
    console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    assert.expect fs.existsSync(BIN_PATH + '/chromedriver')
    assert.expect fs.existsSync(BIN_PATH + '/selenium.jar')
    done()

  describe 'from local tmp', ->
    before (done) ->
      console.log 'test/download:36' + BIN_PATH
      console.log ' - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
      seleniumDownload.update BIN_PATH, done

    it 'downloads the files again', ->
      console.log 'test/download:42', BIN_PATH + '/chromedriver'
      console.log ' - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
      assert.expect fs.existsSync(BIN_PATH + '/chromedriver')
      assert.expect fs.existsSync(BIN_PATH + '/selenium.jar')

    it 'did not download an invalid jar', (done) ->
      @timeout 10000
      execFile 'java', [
        # -h means "show usage/help". Selenium has no --version :(
        '-jar', BIN_PATH + '/selenium.jar', '-h'
      ], (error, stdout) ->
        clearFileSystem()
        done error
