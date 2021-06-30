const inspect = Symbol.for('nodejs.util.inspect.custom')
const { Symbols } = require('./Symbols')

class BuiltinTypeSymbol extends Symbols {
  constructor(name) {
    super(name)
  }
  toString () {
    return this.name
  }
  [inspect] () {
    return this.toString()
  }
}

module.exports = {
  BuiltinTypeSymbol,
}
function test () {
  let type = BuiltinTypeSymbol.new('INTEGER')
  console.log(type)
}

if (require.main === module) {
  test()
}
