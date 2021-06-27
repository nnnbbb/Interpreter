const { Ast } = require('./Ast')

class Assign extends Ast {
  constructor(left, op, right) {
    super()
    this.left = left
    this.token = this.op = op
    this.right = right
  }
  static new(...args) {
    return new this(...args)
  }
}
module.exports = {
  Assign,
}
