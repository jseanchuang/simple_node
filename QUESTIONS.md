# Questions:


1. Compare the difference between account/UTXO based model.

      Account base 是單純的紀錄特定帳號其餘額，與其相關的transaction. 一比完整的transaction 其基本組成即包含 from account + to account + value. ethereum 即是採用此方法。
      
      UTXO base 則是在比特幣中所採用的模型，其特定帳戶的餘額必須累加其所有尚未支出的transactions 來取得. 一筆完整的transaction 會包含 input transactions + output transactions.

2. How to ensure transaction order in account based model?

    在此範例中，是採取先到先處理模式，當10秒鐘一到即把所有pending tx 放進區塊中。在現實ethereum中會考量更多因素，影響排列順序。比如gas price高低或是執行智能合約等等。


3. What is transaction/block?

    transaction: 本範例中即為一項基本的交易，內容包含from address, to address與value. 簡單記錄了貨幣的流向。

    block: 為區塊鏈中的區塊單元，每個block互相串接起來行程區塊鍊，內容紀錄了block hash, parent hash, block height and transactions(被打包進此block的所有transactions)。

4. Why to set block generation time?

    在此範例中10秒mine出一個block只確保了transaciton上鏈後的時間點。但在ethereum中其時間就有意義，且受到其他因素影響會動態調整。因為此例子是一個單一節點，並無考慮與其他節點的共識問題，在現實應用中必須考慮其節點是否為惡意，所以使用p2p多節點，多個節點在結合block nonce來算出目標block hash以達到PoW的目的。透過此方式各個節點皆擁有寫帳權利，來確保其去中心化特性。

5. When to update the account balance?

    當transaction被寫入block中即可更新帳戶餘額。


6. When to execute state finalizing?

    在這個範例中，當10秒一到即執行，並更新整個blocks 與 accounts 的狀態。

7. In our spec, each account has 100 coins as the default balance. What is money minting on blockchain? How to make the money?

    在真實區塊鏈中，貨幣的生成方式是靠礦工打包transactions成為一個block之後的獎勵。