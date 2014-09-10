fs = require 'fs'
assert = require 'assert'
rmrf = require 'rimraf'

tempdir = require '../lib/tempdir'
seleniumDownload = require '..'

BIN_PATH = __dirname + '/bin'
TMP_PATH = "#{tempdir}testium"

clearFileSystem = ->
  rmrf.sync TMP_PATH
  rmrf.sync BIN_PATH

# TEST #

clearFileSystem()

console.log 'make sure it can download the proper files'
seleniumDownload.update BIN_PATH, (error) ->
  throw error if error?

  assert fs.existsSync(BIN_PATH + '/chromedriver')
  assert fs.existsSync(BIN_PATH + '/selenium.jar')

  console.log 'make sure it updates from local temp as well'
  seleniumDownload.update BIN_PATH, (error) ->
    throw error if error?

    assert fs.existsSync(BIN_PATH + '/chromedriver')
    assert fs.existsSync(BIN_PATH + '/selenium.jar')

    clearFileSystem()

process.on 'uncaughtException', (error) ->
  clearFileSystem()
  throw error

