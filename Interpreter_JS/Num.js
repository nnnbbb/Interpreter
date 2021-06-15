const { Ast } = require('./Ast')

class Num extends Ast {
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
  Num,
}
