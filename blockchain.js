const SHA256 = require("crypto-js/sha256");

class Transaction
{
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block 
{
  constructor(timestamp, transactions, previousHash='') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substr(0, difficulty) !== new Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Mined block: ", this.hash);
  }
}

class Blockchain 
{
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("30/06/2020", "Genesis Block", 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransaction(miningRewardAddress){
    let block = new Block(Date.now(),this.pendingTransactions);
    block.previousHash = this.getLatestBlock().hash;
    block.mineBlock(this.difficulty);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
    
    console.log("Block successfully mined!");
    this.chain.push(block);
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for(const block of this.chain) {
      for(const trans of block.transactions) {
        if(address === trans.fromAdress) {
          balance -= trans.amount;
        }
        if(address === trans.toAddress) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  /*addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }*/

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let ourCrypto = new Blockchain();

console.log("Create transaction");

let trans1 = new Transaction("address1","address2",100);
ourCrypto.createTransaction(trans1);

let trans2 = new Transaction("address2","address1",50);
ourCrypto.createTransaction(trans2);

console.log("Starting the miner");
ourCrypto.minePendingTransaction("our-address");

console.log("Start the miner, second time");
ourCrypto.minePendingTransaction("our-address");

console.log("Start the miner, third time");
ourCrypto.minePendingTransaction("our-address");

console.log("Balance of our account",ourCrypto.getBalanceOfAddress("our-address"));
//ourCrypto.addBlock(new Block(1,"01/06/2020/", {amount : 5}));
//ourCrypto.addBlock(new Block(2,"05/06/2020/", {amount : 15}));

console.log(JSON.stringify(ourCrypto, null, 4));

//console.log("Is bockchain valid? ", ourCrypto.isChainValid());

//ourCrypto.chain[1].data = {amount : 100};
//ourCrypto.chain[1].hash = ourCrypto.chain[1].calculateHash();

//console.log(JSON.stringify(ourCrypto, null, 4));
//console.log("Is bockchain valid? ", ourCrypto.isChainValid());


