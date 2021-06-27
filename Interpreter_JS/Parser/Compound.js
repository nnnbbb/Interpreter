const { Ast } = require('./Ast')

class Compound extends Ast {
  // """Represents a 'BEGIN ... END' block"""
  constructor() {
    super()
    this.children = []
  }
  static new(...args) {
    return new this(...args)
  }
}
module.exports = {
  Compound,
}
