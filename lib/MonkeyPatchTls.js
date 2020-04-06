/**
 * Monkey patches the TLS module to accept the Pebble test certificate and the Pebble
 * runtime-generated root and intermediary Certificate Authority (CA) certificates.
 *
 * Based on the method provided by David Barral at https://link.medium.com/6xHYLeUVq5.
 *
 * @module
 * @copyright Copyright © 2020 Aral Balkan, Small Technology Foundation.
 * @license AGPLv3 or later.
 */
const fs   = require('fs-extra')
const path = require('path')
const tls  = require('tls')
const bent = require('bent')
const Throws = require('./util/Throws')

const throws = new Throws({
  [Symbol.for('MonkeyPatchTls.certificateParseError')]:
    (certificatePath, additionalCertificates) => `Could not parse certificate at path ${certificatePath}. Additional certificates: ${additionalCertificates}`
})

/**
 * Monkey patches the TLS module to accept run-time root and intermediary Certificate Authority certificates.
 *
 * @alias module:lib/MonkeyPatchTls
 */
class MonkeyPatchTLS {
  static #originalCreateSecureContext = null

  /**
   * Monkey patches TLS to accept all Pebble certificates (test certificate, root CA, and intermediary CA)
   *
   * @static
   * @category async
   */
  static async toAcceptAllPebbleCertificates() {
    MonkeyPatchTLS.toAcceptPebbleTestCertificate()
    const additionalCertificates = await this.downloadPebbleCaRootAndIntermediaryCertificates()
    MonkeyPatchTLS.toAcceptPebbleTestCertificate(/* and */ additionalCertificates)
  }

  //
  // Private.
  //

  /**
   * Monkey patches Node’s TLS module to accept the certificate at the passed path as well as, optionally, any other
   * certificates passed as a PEM-formatted string.
   *
   * @static
   * @access private
   * @param {String} [additionalCertificatesPem=''] Additional certificates to be added to the chain of trust.
   */
  static toAcceptPebbleTestCertificate(additionalCertificatesPem = '') {
    if (this.#originalCreateSecureContext === null) {
      this.#originalCreateSecureContext = tls.createSecureContext
    }
    const originalCreateSecureContext = this.#originalCreateSecureContext

    const certificatePath = path.join(__dirname, '..', 'bin', 'test', 'certs', 'pebble.minica.pem')

    // Load the Pebbleserver’s own test CA certificate from disk.
    // (See https://github.com/letsencrypt/pebble#avoiding-client-https-errors.)
    // Note that this is not the the Pebble CA root or intermediary certificate (see below).
    let pem = fs
    .readFileSync(certificatePath, { encoding: 'ascii' })
    .replace(/\r\n/g, "\n")

    // Add any additional certificates that might have been provided to the PEM that’s loaded from disk.
    // (e.g., to create the Pebble server’s chain of trust).
    pem = `${pem}\n${additionalCertificatesPem}`

    const certificates = pem.match(/-----BEGIN CERTIFICATE-----\n[\s\S]+?\n-----END CERTIFICATE-----/g)

    if (!certificates) {
      throws.error(Symbol.for('MonkeyPatchTls.certificateParseError'), certificatePath, additionalCertificatesPem)
    }

    tls.createSecureContext = options => {
      const context = originalCreateSecureContext(options)

      certificates.forEach(certificate => {
        context.context.addCACert(certificate.trim())
      })

      return context
    }
  }

  /**
   * Downloads and returns the dynamically-generated local Pebble server’s Certificate Authority root
   * and intermediary certificates.
   *
   * @static
   * @category async
   * @access private
   * @returns {String} The Pebble server’s CA root and intermediary certificates as a single PEM-formatted string.
   */
  static async downloadPebbleCaRootAndIntermediaryCertificates() {
    const httpsGetString = bent('GET', 'string')

    const rootCaUrl = 'https://localhost:15000/roots/0'
    const intermediaryCaUrl = 'https://localhost:15000/intermediates/0'

    const rootCa = await httpsGetString(rootCaUrl)
    const intermediaryCa = await httpsGetString(intermediaryCaUrl)

    const pem = `${rootCa}\n${intermediaryCa}`

    return pem
  }
}

module.exports = MonkeyPatchTLS
