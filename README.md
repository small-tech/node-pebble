# Node Pebble

A Node.js wrapper for [Let’s Encrypt](https://letsencrypt.org)’s [Pebble](https://github.com/letsencrypt/pebble) (“a small RFC 8555 ACME test server not suited for a production certificate authority”).

## Version and platform support

Supports [Pebble version 2.3.0](https://github.com/letsencrypt/pebble/releases/tag/v2.3.0) on platforms with binary [Pebble releases](https://github.com/letsencrypt/pebble/releases/):

  - Linux AMD 64.
  - Windows AMD 64.

## Installation

```sh
npm i @small-tech/node-pebble
```

## API

```js
const pebbleProcess = await Pebble.spawn([args], [env])
```

### Parameters

  - `args`: Optional array or space-delimited string of arguments to pass to the Pebble binary. By default, no arguments are passed.

  - `env`: Optional object with additional environment variables to set for the Pebble process.

    By default, the Pebble process will be run with the following settings, which are optimised for frequently run unit tests:

    - `PEBBLE_VA_NOSLEEP=1`
    -  `PEBBLE_WFE_NONCEREJECT=0`

    You can also customise the default environment variables by simply passing them to the outer process that runs Node Pebble (for example, when specifying npm test tasks).

### Return value

`Promise<ChildProcess>` a promise that is resolved to a reference of the spawned Pebble server instance once the Pebble server instance has finished booting. When this promise resolves, Pebble is ready to use.

## Default configuration

The default configuration file is at __bin/test/config/pebble-config.json__:

```json
{
  "pebble": {
    "listenAddress": "0.0.0.0:14000",
    "managementListenAddress": "0.0.0.0:15000",
    "certificate": "test/certs/localhost/cert.pem",
    "privateKey": "test/certs/localhost/key.pem",
    "httpPort": 80,
    "tlsPort": 443,
    "ocspResponderURL": "",
    "externalAccountBindingRequired": false
  }
}
```

To customise the configuration, specify your own configuration file by passing the `-config` argument to the Pebble binary. e.g.,

```js
Pebble.spawn('-config customConfig.json')
```

## Basic example

The following listing launches the Pebble server with its default settings and then shuts it down.

```js
const Pebble = require('node-pebble')

const pebbleProcess = await Pebble.spawn()
pebbleProcess.kill()
```

## Install development dependencies (for tests and coverage)

```sh
npm install
```

## Run test task

```sh
npm test
```

## Run coverage task

```sh
npm run coverage
```

## Like this? Fund us!

[Small Technology Foundation](https://small-tech.org) is a tiny, independent not-for-profit.

We exist in part thanks to patronage by people like you. If you share [our vision](https://small-tech.org/about/#small-technology) and want to support our work, please [become a patron or donate to us](https://small-tech.org/fund-us) today and help us continue to exist.

## Copyright

&copy; 2020 [Aral Balkan](https://ar.al), [Small Technology Foundation](https://small-tech.org).

Let’s Encrypt is a trademark of the Internet Security Research Group (ISRG). All rights reserved. Node.js is a trademark of Joyent, Inc. and is used with its permission. We are not endorsed by or affiliated with Joyent or ISRG.

## License

[AGPL version 3.0 or later.](https://www.gnu.org/licenses/agpl-3.0.en.html)
