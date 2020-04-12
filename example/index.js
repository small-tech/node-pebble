/**
 * The Pebble Node example from the readme.
 */
const Pebble = require('..')

async function main() {
  console.log('\n ⏳ Launching Pebble server…\n')

  await Pebble.ready()

  console.log(' ✔ Pebble server launched and ready.')
  console.log(' ✔ Node.js’s TLS module patched to accept Pebble’s CA certificates.')

  // Do stuff that requires Pebble here.
  // …

  console.log('\n ⏳ Shutting down Pebble server…\n')

  await Pebble.shutdown()

  console.log('\n ✔ Pebble server shut down.\n')
}

main()
