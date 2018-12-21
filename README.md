# In Memory Blockchain

 It's a single node blockchain demonstration. Without network or p2p connections, also no signature or verification. All blockchain data store in memory. The consensus would be straightforward: just collect transactions and make them blocks.

## SPECIFICATION
- [x] It is an account based blockchain.
- [x] Newly observed accounts have 100 units of initial coins.
- [x] The blockchain generates a new block every 10 seconds.
- [x] Block header has the following message
    * [x] Block hash: SHA256 hash of block.
    * [x] Parent hash: Previous block hash.
    * [x] Block height.
    * [x] Transactions: Array of transaction hashes belong to this block.
- [x] Transaction has the following message:
    * [x] Transaction hash: SHA256 hash of transaction. 
    * [x] From: from address.
    * [x] To: to address.
    * [x] Value: coins to transaction.
- [x] REST API to input transaction and further interaction
- [x] Dump blockchain log on console.

## How to run
1. Install npm packages
```
npm install
```

1. Start node
```
npm start
```

## Node interaction
After node start. Use `curl` command to interact with.

#### Transaction

1. Create transaction. A POST requst with `from`, `to` and `value` parameters in request body. Response contains the same input data with additional txhash.
```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"from":"acc1", "to":"acc2","value":3}' \
  http://localhost:3000/transaction
```

2. Get transaction by txhash. A GET request with `hash` parameter.
```
curl -X GET "localhost:3000/transaction/0x4f7d1b75053426c78e6a51a0ebae18f805d61e67be6699df36ed77afeb13e8f6"
```

#### Address
1. Get address info. A GET request with `address` parameter.
```
curl -X GET localhost:3000/address/acc1
```

#### Block
1. Get current blockchain height. A GET request.
```
curl -X GET localhost:3000/block
```

2. Get block info by height. A GET request with `height` parameter.
```
curl -X GET localhost:3000/block/height/2
```

3. Get block info by block hash. A GET request with `hash` parameter.
```
curl -X GET localhost:3000/block/hash/0xb49437410bd457d6b680b0cb8f609163f00429200e614e12a6e0d9b6dbbb1f0c
```
