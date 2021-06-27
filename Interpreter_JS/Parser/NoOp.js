const { Ast } = require('./Ast')

class NoOp extends Ast {
  static new(...args) {
    return new this(...args)
  }
}
module.exports = {
  NoOp,
}
