const inspect = Symbol.for('nodejs.util.inspect.custom')
const { BuiltinTypeSymbol } = require('./BuiltinTypeSymbol')
const { VarSymbol } = require('./VarSymbol')

class SymbolsTable {
  constructor() {
    this._symbols = {}
    this._init_builtins()
  }

  _init_builtins () {
    this.define(BuiltinTypeSymbol.new('INTEGER'))
    this.define(BuiltinTypeSymbol.new('REAL'))
  }

  define (symbol) {
    console.log('Define:', symbol)
    this._symbols[symbol.name] = symbol

  }
  lookup (name) {
    console.log('Lookup:', name)
    let symbol = this._symbols[name]
    // 'symbol' is either an instance of the Symbol class or 'None'
    return symbol
  }
  static new (...args) {
    return new this(...args)
  }
  toString () {
    let s = Object.values(this._symbols)
    return s
  }
  [inspect] () {
    return this.toString()
  }
}

function test () {
  let symtab = SymbolsTable.new()

  // let int_type = BuiltinTypeSymbol.new('INTEGER')
  // symtab.define(int_type)

  // let var_x_symbol = VarSymbol.new('x', int_type)
  // symtab.define(var_x_symbol)

  // let real_type = BuiltinTypeSymbol.new('REAL')
  // symtab.define(real_type)

  // let var_y_symbol = VarSymbol.new('y', real_type)
  // symtab.define(var_y_symbol)

  console.log(symtab)
}

module.exports = {
  SymbolsTable,
}

if (require.main === module) {
  test()
}
