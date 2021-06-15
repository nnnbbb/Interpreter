const { Ast } = require('./Ast')
class BinOp extends Ast {
  constructor(left, operator, right) {
    super()
    this.left = left
    this.token = this.operator = operator
    this.right = right
  }
  static new(...args) {
    return new this(...args)
  }
}
module.exports = {
  BinOp,
}
