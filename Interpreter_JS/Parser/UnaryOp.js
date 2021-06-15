const { Ast } = require('./Ast')

class UnaryOp extends Ast {
  constructor(operator, expr) {
    super()
    this.token = this.operator = operator
    this.expr = expr
  }
  static new(...args) {
    return new this(...args)
  }
}
module.exports = {
  UnaryOp,
}
