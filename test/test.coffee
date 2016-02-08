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

    console.log 'make sure it did not download an invalid jar'
    execFile 'java', [
      # -h means "show usage/help". Selenium has no --version :(
      '-jar', BIN_PATH + '/selenium.jar', '-h'
    ], (error, stdout) ->
      throw error if error?
      clearFileSystem()

process.on 'uncaughtException', (error) ->
  clearFileSystem()
  throw error

