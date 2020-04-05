/**
 * The Pebble Node example from the readme.
 */
const Pebble = require('..')

async function main() {
  const pebbleProcess = await Pebble.spawn()
  pebbleProcess.kill()
}

main()
