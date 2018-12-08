const crypto = require('crypto');
/**
 * Block's properties:
 *   height: number
 *   hash: string
 *   parentHash: string
 *   txs: array of tx
 */

const DEFAULT_BALANCE = 100;

class Blocks {
  constructor() {
    this.blockMap = new Map();
    this.blocks = [];
    this.addresses = new Map();
    this.txMap = new Map();
  }

  update(txs) {
    let block = {
      height: this.blocks.length,
      parentHash: (this.blocks.length == 0) ? '' : this.blocks[this.blocks.length - 1].hash,
      txs: txs,
      timestamp: new Date().getTime()
    };
    block.hash = '0x' + crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex');
    console.log(`Mine ${txs.length} tx into block`);
    console.log('Mined block: ', block);

    this.updateAddresses(txs, block.hash, block.height, block.timestamp);
    this.blockMap.set(block.hash, block);
    this.blocks.push(block);
  }

  updateAddresses(txs, blockHash, blockHeight, timestamp) {
    txs.forEach((tx) => {
      tx.blockHash = blockHash;
      tx.blockHeight = blockHeight;
      tx.timestamp = timestamp;

      let fromAddr = this.getAddress(tx.from);
      let toAddr = this.getAddress(tx.to);
      fromAddr.balance = fromAddr.balance - tx.value;
      toAddr.balance = toAddr.balance + tx.value;
      fromAddr.txs.push(tx);
      toAddr.txs.push(tx);

      this.txMap.set(tx.hash, tx);
    });
  }

  getAddressBalance(address) {
    if (!this.addresses.has(address)) {
      this.addresses.set(address, {
        address: address,
        balance: DEFAULT_BALANCE,
        txs: []
      });
    }
    return this.addresses.get(address).balance;
  }

  getAddressTxs(address) {
    if (!this.addresses.has(address)) {
      this.addresses.set(address, {
        address: address,
        balance: DEFAULT_BALANCE,
        txs: []
      });
    }
    return this.addresses.get(address).txs;
  }

  getAddress(address) {
    if (!this.addresses.has(address)) {
      this.addresses.set(address, {
        address: address,
        balance: DEFAULT_BALANCE,
        txs: []
      });
    }
    return this.addresses.get(address);
  }

  getBlockByNumber(num) {
    return (this.blocks.length > num) ? this.blocks[num] : {};
  }

  getBlockByHash(hash) {
    return this.blockMap.has(hash) ? this.blockMap.get(hash) : {};
  }

  getTransaction(hash) {
    return this.txMap.has(hash) ? this.txMap.get(hash) : {};
  }

  getHeight() {
    return this.blocks.length;
  }

  balanceCheck(address, value) {
    return (this.getAddressBalance(address) >= value) ? true : false;
  }

}

const blocks = new Blocks();

module.exports = blocks;