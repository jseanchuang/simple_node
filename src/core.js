const blocks = require('./blocks.js');
const txPool = require('./txPool.js');

const MINING_INTERVAL = 10000 // 10 sec.
class Core {
  start() {
    this.mineminemine = setInterval(() => {
      console.log('==========  Mining Start  ==========');
      const txs = txPool.popAll();
      // Mint to block
      blocks.update(txs);
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