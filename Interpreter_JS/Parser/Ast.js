class Ast {
  constructor() {}
  static new(...args) {
    return new this(...args)
  }
}
module.exports = {
  Ast,
}
