class ProcedureDecl {
  constructor(procName, blockNode) {
    this.procName = procName
    this.blockNode = blockNode
}
  static new(...args) {
    return new this(...args)
  }
}
module.exports = {
  ProcedureDecl,
}
