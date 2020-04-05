const test = require('tape')
const Pebble = require('..')

test ('Node Pebble', t => {
  const expectedOutputContents = [
    'Starting Pebble ACME server',
    'Generated new root issuer',
    'Generated new intermediate issuer',
    'Using system DNS resolver for ACME challenges',
    'Disabling random VA sleeps',
    'Configured to reject 0% of good nonces',
    'Configured to attempt authz reuse for each identifier 50% of the time',
    'Configured to show 3 orders per page',
    'Management interface listening on: 0.0.0.0:15000',
    'Root CA certificate available at: https://0.0.0.0:15000/roots/0',
    'Listening on: 0.0.0.0:14000',
    'ACME directory available at: https://0.0.0.0:14000/dir'
  ]

  t.plan(expectedOutputContents.length)

  const pebbleProcess = Pebble.spawn()

  let outputBuffer = Buffer.from('')

  pebbleProcess.on('error', (error) => {
    t.fail('Spawn should not error')
  })

  pebbleProcess.stdout.on('data', (data) => {
    outputBuffer = Buffer.concat([outputBuffer, data])
  })

  pebbleProcess.stderr.on('data', (data) => {
    t.fail('Pebble server should not error')
  })

  pebbleProcess.on('close', (code) => {
    output = outputBuffer.toString('utf-8')

    expectedOutputContents.forEach(expectedOutputContent => {
      t.ok(output.includes(expectedOutputContent), `output should contain ${expectedOutputContent}`)
    })

    t.end()
  })

  setTimeout(() => {
    pebbleProcess.kill()
  }, 2000)
})