# Node Pebble

A Node.js wrapper for Let’s Encrypt’s Pebble (a small RFC 8555 ACME test server not suited for a production certificate authority).

## Platform support

Currently only supports Linux AMD 64.

## Installation

```sh
npm i @small-tech/node-pebble
```

## Usage

```js
const Pebble = require('node-pebble')

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

// Close the Pebble server after 5 seconds.
setTimeout(() => {
  pebbleProcess.kill()
}, 5000)
```


## Like this? Fund us!

[Small Technology Foundation](https://small-tech.org) is a tiny, independent not-for-profit.

We exist in part thanks to patronage by people like you. If you share [our vision](https://small-tech.org/about/#small-technology) and want to support our work, please [become a patron or donate to us](https://small-tech.org/fund-us) today and help us continue to exist.

## Copyright

&copy; 2020 [Aral Balkan](https://ar.al), [Small Technology Foundation](https://small-tech.org).

Let’s Encrypt is a trademark of the Internet Security Research Group (ISRG). All rights reserved. Node.js is a trademark of Joyent, Inc. and is used with its permission. We are not endorsed by or affiliated with Joyent or ISRG.

## License

[AGPL version 3.0 or later.](https://www.gnu.org/licenses/agpl-3.0.en.html)
