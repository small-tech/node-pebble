const test = require('tape')
const Pebble = require('..')

test ('Node Pebble', async t => {
  const pebbleProcess = await Pebble.spawn()

  t.pass('pebble process launches as expected')

  pebbleProcess.on('close', (code) => {
    t.pass('pebble process killed as expected')
    t.end()
  })

  pebbleProcess.kill()
})

