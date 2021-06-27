class Program {
  constructor(name, block) {
    this.name = name
    this.block = block
  }
  static new (...args) {
    return new this(...args)
  }
}
module.exports = {
  Program,
}
