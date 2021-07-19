const { NodeVisitor } = require('../NodeVisitor')
const { SymbolsTable } = require('./SymbolTable')
const { VarSymbol } = require('./VarSymbol')

class SymbolTableBuilder extends NodeVisitor {
  constructor() {
    super()
    this.symbolsTable = SymbolsTable.new()
  }
  static new (...args) {
    return new this(...args)
  }
  visitBlock (node) {
    node.declarations.map(declaration => {
      this.visit(declaration)
    })
    this.visit(node.compoundStatement)
  }
  visitProgram (node) {
    this.visit(node.block)
  }
  visitBinOp (node) {
    this.visit(node.left)
    this.visit(node.right)
  }
  visitProcedureDecl (node) { }
  visitNum (node) { }
  visitNoOp (node) { }
  visitUnaryOp (node) {
    this.visit(node.expr)
  }
  visitCompound (node) {
    node.children.map(child => this.visit(child))
  }
  visitVarDecl (node) {
    const typeName = node.typeNode.value
    const typeSymbol = this.symbolsTable.lookup(typeName)
    const varName = node.varNode.value
    const varSymbol = VarSymbol.new(varName, typeSymbol)
    this.symbolsTable.define(varSymbol)
  }
  visitVar (node) {
    const varName = node.value
    const varSymbol = this.symbolsTable.lookup(varName)
    if (varSymbol == undefined) {
      throw new Error(`Variable "${varName}" is not define`)
    }
  }
  visitAssign (node) {
    const visit = this.visit.bind(this)
    const varName = node.left.value
    const varSymbol = this.symbolsTable.lookup(varName)

    if (varSymbol == undefined) {
      throw new Error(`Variable "${varName}" is not define`)
    }
    visit(node.right)
  }
}

module.exports = {
  SymbolTableBuilder,
}
function test1 () {
  const { Lexer } = require('../Lexer')
  const { SymbolTableBuilder } = require('./SymbolTableBuilder')
  const { Parser } = require('../Parser/Parser')
  const text = `
                PROGRAM Part11;
                VAR
                x: INTEGER;
                y: REAL;

                BEGIN

                END.
               `
  const lexer = Lexer.new(text)
  const parser = Parser.new(lexer)
  const tree = parser.parse()
  const symtabBuilder = SymbolTableBuilder.new()
  symtabBuilder.visit(tree)
  console.log(symtabBuilder.symbolsTable)
}

function test2 () {
  const util = require('util')
  const { Lexer } = require('../Lexer')
  const { SymbolTableBuilder } = require('./SymbolTableBuilder')
  const { Parser } = require('../Parser/Parser')
  const text = `
                PROGRAM NameError1;
                VAR
                    a : INTEGER;

                BEGIN
                    a := 2 + b;
                END.
               `
  const lexer = Lexer.new(text)
  const parser = Parser.new(lexer)
  const tree = parser.parse()
  const symtabBuilder = SymbolTableBuilder.new()
  console.log(util.inspect(tree, false, 4, false))
  symtabBuilder.visit(tree)
  console.log(symtabBuilder.symbolsTable)
}

function test3 () {
  const { Lexer } = require('../Lexer')
  const { SymbolTableBuilder } = require('./SymbolTableBuilder')
  const { Parser } = require('../Parser/Parser')
  const text = `
                PROGRAM NameError2;
                VAR
                    b : INTEGER;

                BEGIN
                    b := 1;
                    a := b + 2;
                END.
               `
  const lexer = Lexer.new(text)
  const parser = Parser.new(lexer)
  const tree = parser.parse()
  const symtabBuilder = SymbolTableBuilder.new()
  symtabBuilder.visit(tree)
  console.log(symtabBuilder.symbolsTable)
}

if (require.main === module) {
  test2()
}
