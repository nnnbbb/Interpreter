class Type {
  constructor(token) {
    this.token = token
    this.value = token.value
  }
  static new (...args) {
    return new this(...args)
  }
}
module.exports = {
  Type,
}
