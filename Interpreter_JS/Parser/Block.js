class Block {
  constructor(declarations, compoundStatement) {
    this.declarations = declarations
    this.compoundStatement = compoundStatement
  }
  static new (...args) {
    return new this(...args)
  }
}
module.exports = {
  Block,
}
