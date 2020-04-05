/**
 * The Pebble Node example from the readme.
 */
const Pebble = require('..')

const pebbleProcess = Pebble.spawn()

pebbleProcess.on('error', (error) => {
  console.log('[Pebble] Process error', error)
})

pebbleProcess.stdout.on('data', (data) => {
  console.log(`[Pebble] ${data}`)
})

pebbleProcess.stderr.on('data', (data) => {
  console.log(`[Pebble] Error ${data}`)
})

pebbleProcess.on('close', (code) => {
  console.log('Pebble server process exited with code', code)
})

setTimeout(() => {
  pebbleProcess.kill()
}, 5000)
