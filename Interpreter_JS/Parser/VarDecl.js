class VarDecl {
  constructor(varNode, typeNode) {
    this.varNode = varNode
    this.typeNode = typeNode
  }
  static new (...args) {
    return new this(...args)
  }
}
module.exports = {
  VarDecl,
}
