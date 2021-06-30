const inspect = Symbol.for('nodejs.util.inspect.custom')

class Symbols {
  constructor(name, type = undefined) {
    this.name = name
    this.type = type
  }
  static new (...args) {
    return new this(...args)
  }
}
module.exports = {
  Symbols,
}
