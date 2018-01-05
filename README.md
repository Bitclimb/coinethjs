# coinethjs
Bip44 implementation of Ethereum

# Usage

```js
const ethjs = require('coinethjs');
const bitcoin = require('bitcoinjs-lib');

//using bip39 mnemonic
const seed = bip39.mnemonicToSeed(mnemonic); // your 12 word bip39 seed
// using bip32 xpriv
const seed = bitcoin.crypto.sha256(BIP32_KEY); // your BIP32 KEY

const node = ethjs.fromSeedBuffer(seed);
const master = node.derivePath(`m/44'/60'/0'/0/0`);
 getPrivateKey () {
    if (master.keyPair) {
      return master.keyPair.toWIF();
    } else {
      return master.getPrivateKey();
    }
  }
  getAddress () {
    return master.getAddress();
  }
console.log(getAddress()) // prints the address
console.log(getPrivateKey()) // prints the private key

```