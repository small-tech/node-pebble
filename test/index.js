import test from 'tape'
import Pebble from '../index.js'

test ('Node Pebble', async t => {
  //
  // Test initial launch.
  //
  const pebbleProcess = await Pebble.ready()
  t.pass('pebble process launches as expected')

  //
  // Test future access while already running.
  //
  const pebbleProcess2 = await Pebble.ready()
  t.strictEquals(pebbleProcess.pid, pebbleProcess2.pid, 'on repeated access, the same Pebble process is returned as expected')

  // Test shutdown.
  await Pebble.shutdown()
  t.pass('pebble process killed as expected')

  t.end()
})
