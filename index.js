const { pubToAddress, isValidAddress, isValidPrivate } = require('ethereumjs-util');
const { HDNode } = require('bitcoinjs-lib');
const assert = require('assert');
const ec = require('elliptic').ec('secp256k1');

function padTo32(msg) {
  while (msg.length < 32) {
    msg = Buffer.concat([Buffer.from([0]), msg]);
  }
  if (msg.length !== 32) {
    throw new Error(`invalid key length: ${msg.length}`);
  }
  return msg;
}

module.exports = class Ethjs {
  static fromSeedBuffer(seed) {
    return new Ethjs(HDNode.fromSeedBuffer(seed));
  }

  static bip32PublicToEthereumPublic(pubKey) {
    let key = ec.keyFromPublic(pubKey).getPublic().toJSON();
    return Buffer.concat([padTo32(Buffer.from(key[0].toArray())), padTo32(Buffer.from(key[1].toArray()))]);
  }

  constructor(hdKey) {
    assert(hdKey);
    this.key = hdKey;
  }
  derivePath(p) {
    this.derived = this.key.derivePath(p);
    return this;
  }
  getAddress(index) {
    let address = pubToAddress(Ethjs.bip32PublicToEthereumPublic(this.derived.getPublicKeyBuffer()));
    address = `0x${address.toString('hex')}`;
    if (isValidAddress(address)) {
      return address;
    } else {
      throw new Error('Invalid Ethereum address');
    }
  }

  getPrivateKey() {
    const privkey = padTo32(this.derived.keyPair.d.toBuffer());
    if (isValidPrivate(privkey)) {
      return privkey.toString('hex');
    } else {
      throw new Error('Invalid Ethereum private key');
    }
  }
};
