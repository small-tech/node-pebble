/**
 * Node Pebble
 *
 * A Node.js wrapper for Let’s Encrypt’s Pebble (“a small RFC 8555 ACME test server
 * not suited for a production certificate authority”).
 *
 * @module
 * @copyright © 2020 Aral Balkan, Small Technology Foundation
 * @license AGPL version 3.0 or later
 */
const os           = require('os')
const path         = require('path')
const childProcess = require('child_process')

const spawn = childProcess.spawn

/**
 * @alias module
 */
class Pebble {
  /**
   * Promises to spawn a Pebble process and resolve the promise when the server is ready for use.
   *
   * @static
   * @args {[String[]]|String} Optional space-delimited list or array of arguments to pass to Pebble process.
   * @env {Object={ PEBBLE_VA_NOSLEEP: 1, PEBBLE_WFE_NONCEREJECT: 0 }} Optional  environment variables to set for Pebble process.
   * @returns {Promise<ChildProcess>} Promise to return spawned child process. You’re responsible for managing its life-cycle.
   */
  static spawn (args = [], env = { PEBBLE_VA_NOSLEEP: 1, PEBBLE_WFE_NONCEREJECT: 0 }) {
    // Spawn expects argument to be an array. Automatically convert a space-delimited arguments string to one.
    if (typeof args === 'string') {
      args = args.split(' ')
    }

    const binDirectoryPath = path.join(__dirname, 'bin')
    const pebbleBinaryName = `pebble${os.platform() === 'win32' ? '.exe' : ''}`
    const pebbleBinaryPath = path.join(binDirectoryPath, pebbleBinaryName)

    const options = {
      env: Object.assign(process.env, env),
      cwd: binDirectoryPath
    }

    const pebbleProcess = spawn(pebbleBinaryPath, args, options)

    let output = ''

    return new Promise((resolve, reject) => {
      const timeoutInterval = setTimeout(() => {
        reject('Timed out while attempting to spawn Pebble server (waited 5 seconds).')
      }, 5000)

      pebbleProcess.stdout.on('data', data => {
        output = `${output}${data}`
        if (output.includes('ACME directory available at: https://0.0.0.0:14000/dir')) {
          clearInterval(timeoutInterval)
          resolve(pebbleProcess)
        }
      })
    })
  }
}

module.exports = Pebble
