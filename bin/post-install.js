#!/usr/bin/env node

////////////////////////////////////////////////////////////////////////////////
//
// npm post-install script
//
//  Downloads and installs the version of pebble specified in the code.
//
////////////////////////////////////////////////////////////////////////////////

import os from 'os'
import fs from 'fs'
import path from 'path'
import https from 'https'

const __dirname = new URL('.', import.meta.url).pathname

async function secureGet (url) {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      const statusCode = response.statusCode
      const location = response.headers.location

      // Reject if it’s not one of the status codes we are testing.
      if (statusCode !== 200 && statusCode !== 302) {
        reject({statusCode})
      }

      let body = ''
      response.on('data', _ => body += _)
      response.on('end', () => {
        resolve({statusCode, location, body})
      })
    })
  })
}

async function secureStreamToFile (url, filePath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(filePath)
    https.get(url, response => {
      response.pipe(fileStream)
      fileStream.on('finish', () => {
        fileStream.close()
        resolve()
      })
      fileStream.on('error', error => {
        fs.unlinkSync(filePath)
        reject(error)
      })
    })
  })
}

//
// Sanity check: ensure we’re on a supported platform (Linux or Windows) and bail if not.
//

const _platform = os.platform()
if (_platform !== 'win32' && _platform !== 'linux') {
  throw new Error(`Node Pebble Error: unsupported platform (only Linux and Windows is supported, not ${_platform}).`)
}

//
// Install the Pebble binary.
//

const PEBBLE_VERSION = 'v2.3.1'

const platform = _platform === 'win32' ? 'windows' : 'linux'
const binaryExtension = _platform === 'win32' ? '.exe' : ''

const binaryName = `pebble${binaryExtension}`
const downloadUrl = `https://github.com/letsencrypt/pebble/releases/download/${PEBBLE_VERSION}/pebble_${platform}-amd64${binaryExtension}`
const binaryPath = path.join(__dirname, binaryName)


console.log('  Node Pebble (postinstall)')
console.log('  ────────────────────────────────────────────────────────────────────────')
process.stdout.write(`   ╰─ Removing old Pebble binary (if any)… `)

fs.rmSync(binaryPath, {force: true})

process.stdout.write(`   ╰─ Installing Pebble v${PEBBLE_VERSION} binary… `)

const binaryRedirectUrl = (await secureGet(downloadUrl)).location
await secureStreamToFile(binaryRedirectUrl, binaryPath)

process.stdout.write(`   ╰─ Making the binary executable… `)

// Make the binary executable.
fs.chmodSync(binaryPath, 0o755)

process.stdout.write('done.\n')
console.log('  ────────────────────────────────────────────────────────────────────────')
