const inspect = Symbol.for('nodejs.util.inspect.custom')
const { Symbols } = require('./Symbols')
const { BuiltinTypeSymbol } = require('./BuiltinTypeSymbol')

class VarSymbol extends Symbols {
  constructor(name, type) {
    super(name, type)
  }

  [inspect] () {
    return `<${this.name}:${this.type.toString()}>`
  }
}

module.exports = {
  VarSymbol,
}
function test () {
  let typeInt = BuiltinTypeSymbol.new('INTEGER')
  console.log('typeInt', typeInt)
  let typeReal = BuiltinTypeSymbol.new('REAL')
  console.log('typeReal', typeReal)
  let xSymbol = VarSymbol.new('x', typeInt)
  let ySymbol = VarSymbol.new('y', typeReal)
  console.log(xSymbol)
  console.log(ySymbol)
}
if (require.main === module) {
  test()
}
