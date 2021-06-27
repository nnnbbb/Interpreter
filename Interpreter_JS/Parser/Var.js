const { Ast } = require('./Ast')

class Var extends Ast {
  //     """The Var node is constructed out of ID token."""
  constructor(token) {
    super()
    this.token = token
    this.value = token.value
  }
  static new(...args) {
    return new this(...args)
  }
}
module.exports = {
  Var,
}
