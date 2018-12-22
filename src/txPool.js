/**
 * object array
 * object's properties:
 *   from: string
 *   to: string
 *   value: integer
 *   hash: string
 */
const crypto = require('crypto');

const blocks = require('./blocks');

class TxPool {

  constructor() {
    this.map = new Map();
    this.pendingTxs = [];
    this.addresses = [];
  }

  add(input) {
    let tx = {
      from: input.from,
      to: input.to,
      value: input.value,
      timestamp: new Date().getTime()
    }
    if (!blocks.balanceCheck(tx.from, tx.value)) throw new Error('Insufficient balance');
    if (this.addresses.indexOf(tx.from) > -1) throw new Error('Duplicate transaction in pending pool');

    tx.hash = '0x' + crypto.createHash('sha256').update(JSON.stringify(tx)).digest('hex');
    this.pendingTxs.push(tx);
    this.addresses.push(tx.from);
    return tx;

  }

  popAll() {
    let txs = this.pendingTxs.slice();
    this.pendingTxs.splice(0, this.pendingTxs.length);
    this.addresses.splice(0, this.addresses.length);
    return txs;
  }

}

const txPool = new TxPool();

module.exports = txPool;