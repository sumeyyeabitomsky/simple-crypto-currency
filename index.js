const SHA256 = require("crypto-js/sha256");

class CryptoBlock {
  constructor(index, timestamp, data, precedingHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return SHA256(
      this.index +
        this.precedingHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class CryptoBlockchain {
  constructor() {
    this.blockChain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }
  startGenesisBlock() {
    return new CryptoBlock(0, "27/10/2020", "Initial Block in the Chain", "0");
  }
  obtainLatestBlock() {
    return this.blockChain[this.blockChain.length - 1];
  }
  addNewBlock(newBlock) {
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    //newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockChain.push(newBlock);
  }
  checkChainValidity() {
    for (let i = 1; i < this.blockChain.length; i++) {
      const currentBlock = this.blockChain[i];
      const precedingBlock = this.blockChain[i - 1];
      if (currentBlock.hash !== currentBlock.computeHash()) return false;
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
      return true;
    }
  }
}

module.exports = { CryptoBlockchain, CryptoBlock };
