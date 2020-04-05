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
const path = require('path')
const childProcess = require('child_process')

const spawn = childProcess.spawn

/**
 * @alias module
 */
class Pebble {
  /**
   * Spawns Pebble process and returns a reference to it.
   *
   * @static
   * @args {[String[]]|String} Optional space-delimited list or array of arguments to pass to Pebble process.
   * @env {Object={ PEBBLE_VA_NOSLEEP: 1, PEBBLE_WFE_NONCEREJECT: 0 }} Optional  environment variables to set for Pebble process.
   * @returns {ChildProcess} Reference to spawned child process. You’re responsible for managing its life-cycle.
   */
  static spawn (args = [], env = { PEBBLE_VA_NOSLEEP: 1, PEBBLE_WFE_NONCEREJECT: 0 }) {
    // Spawn expects argument to be an array. Automatically convert a space-delimited arguments string to one.
    if (typeof args === 'string') {
      args = args.split(' ')
    }

    const options = { env: Object.assign(process.env, env) }
    const pebbleBinaryPath = path.join(__dirname, 'bin', 'pebble')

    const pebbleProcess = spawn(pebbleBinaryPath, args, options)

    return pebbleProcess
  }
}

module.exports = Pebble
