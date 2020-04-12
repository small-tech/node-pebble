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
const os             = require('os')
const path           = require('path')
const childProcess   = require('child_process')
const log            = require('./lib/util/log')
const MonkeyPatchTls = require('./lib/MonkeyPatchTls')

const spawn = childProcess.spawn

/**
 * @alias module
 */
class Pebble {
  /**
   * Promises to spawn a Pebble process and resolve the promise when the server is ready for use.
   *
   * @static
   * @param args {[String[]|String]=[]} Optional space-delimited list or array of arguments to pass to Pebble process.
   * @param env  {[Object={}]}          Optional environment variables to set for Pebble process.
   * @returns {Promise<ChildProcess>} Promise to return spawned child process.
   */
  static async ready (args = [], env = {}) {
    if (this.#pebbleProcess !== null) {
      // Existing process exists, return that.
      return this.#pebbleProcess
    }

    process.on('unhandledRejection', async error => {
      log(` 🚮 [Node Pebble] Unhandled rejection detected, shutting down Pebble server… (${error})`)
      await this.shutdown()
    })

    if (arguments.length === 1 && Object.prototype.toString.call(args) === '[object Object]') {
      // env was passed as the first (and only) argument
      env = args
      args = []
    }

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

    this.#pebbleProcess = spawn(pebbleBinaryPath, args, options)

    let output = ''

    await new Promise((resolve, reject) => {
      const timeoutInterval = setTimeout(() => {
        reject('Timed out while attempting to spawn Pebble server (waited 5 seconds).')
      }, 5000)

      this.#pebbleProcess.stdout.on('data', async data => {
        output = `${output}${data}`
        if (output.includes('ACME directory available at: https://0.0.0.0:14000/dir')) {
          //
          // Pebble server is running.
          //
          log(output)
          clearInterval(timeoutInterval)
          resolve()
        }
      })
    })

    //
    // To access Pebble from Node (from unit tests, for example), Node needs to accept
    // Pebble’s certificates:
    //
    //   1. Pebble test certificate           : (static; from disk) to access the Pebble server itself over HTTPS.
    //   2. Pebble root CA certificate        : (dynamically generated) to access servers certified by Pebble.
    //   3. Pebble intermediary CA certificate: (dynamically generated) to access servers certified by Pebble.
    //
    // We have to patch TLS twice to allow seamless support for Pebble certificates in Node.js.
    // (The first time to access the Pebble server itself over HTTPS and the second time after we’ve downloaded
    // the dynamically-generated Pebble certificates.)
    //
    await MonkeyPatchTls.toAcceptAllPebbleCertificates()

    return this.#pebbleProcess
  }

  static shutdown() {
    return new Promise((resolve, reject) => {
      this.#pebbleProcess.on('close', () => {
        this.#pebbleProcess = null
        log(' 👋 [Node Pebble] Pebble server process is closed.')
        resolve()
      })
      this.#pebbleProcess.kill()
    })
  }

  //
  // Private
  //

  /**
   * @type ChildProcess
  */
  static #pebbleProcess = null
}

module.exports = Pebble
