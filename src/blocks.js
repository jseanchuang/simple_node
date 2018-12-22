const crypto = require('crypto');
const merkle = require('merkle');
const merkleRoot = merkle('sha256');

// Secret
const secret = 'Simple Blockchain';

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

  // Directly mine the block without nonce calculation
  miningWithFixedNonce(txs) {
    const txhashs = txs.map(tx => {
      return tx.hash
    });
    merkle('sha256').async(txhashs, (err, tree) => {
      var hashMerkleRoot = tree.level(0)[0];
      var nonce = 0;

      let block = {
        nonce: nonce,
        height: this.blocks.length,
        parentHash: (this.blocks.length == 0) ? '' : this.blocks[this.blocks.length - 1].hash,
        timestamp: new Date().getTime(),
        merkleRoot: hashMerkleRoot
      };

      var hash1 = crypto.createHmac('sha256', secret)
        .update(JSON.stringify(block))
        .digest('hex');
      var hash2 = crypto.createHmac('sha256', hash1)
        .update('powered by seanchuang')
        .digest('hex');

      block.hash = '0x' + hash2;
      console.log(`Mine ${txs.length} tx into block`);
      console.log('Mined block: ', block);
      console.log(`Mined ${block.height} block`);

      this.updateAddresses(txs, block.hash, block.height, block.timestamp);
      this.blockMap.set(block.hash, block);
      this.blocks.push(block);
    });
  }

  // Mine the block consider about block nonce 
  miningWithNonceCalculation(txs) {
    const txhashs = txs.map(tx => {
      return tx.hash
    });
    const tree = merkle('sha256').sync(txhashs);
    const hashMerkleRoot = tree.level(0)[0];
    var nonce = 0;

    console.log('txs: ', txs);
    console.log('merkleRoot: ', hashMerkleRoot);

    let block = {
      height: this.blocks.length,
      parentHash: (this.blocks.length == 0) ? '' : this.blocks[this.blocks.length - 1].hash,
      timestamp: new Date().getTime(),
      merkleRoot: hashMerkleRoot
    };
    var hash = function (nonce) {
      block.nonce = nonce;
      block.timestamp = new Date().getTime();
      var hash1 = crypto.createHmac('sha256', secret)
        .update(JSON.stringify(block))
        .digest('hex');
      var hash2 = crypto.createHmac('sha256', hash1)
        .update('powered by seanchuang')
        .digest('hex');
      return hash2;
    };

    var blockHash;
    var startTime = new Date().getTime();
    while (1) {
      var blockHash = hash(nonce++);
      //console.log(nonce + ': ' + blockHash);
      if (blockHash < '0000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF') {
        console.log('success: ' + blockHash);
        break;
      }
    }


    block.hash = '0x' + blockHash;
    var timeDiff = new Date().getTime() - startTime;
    console.log(`Mine ${txs.length} tx into block`);
    console.log(`Mined ${block.height} block take ${timeDiff/1000} sec.`);

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