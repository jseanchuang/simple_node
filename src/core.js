const blocks = require('./blocks.js');
const txPool = require('./txPool.js');

const MINING_INTERVAL = 5000 // 10 sec.
const NONCE_CALCULATION = true;
class Core {
  start() {
    this.mineminemine = setInterval(() => {
      console.log('==========  Mining Start  ==========');
      const txs = txPool.popAll();
      if (NONCE_CALCULATION) {
        blocks.miningWithNonceCalculation(txs);
      } else {
        blocks.miningWithFixedNonce(txs);
      }
      console.log('==========  Mining Finish  ==========');
    }, MINING_INTERVAL);

  }

  stop() {
    clearInterval(this.mineminemine);
  }

  validateTxs(tx) {}
}

const core = new Core();

module.exports = core;