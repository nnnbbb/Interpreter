const { log } = console
const { PLUS, MINUS, MUL, DIV, INTEGER_DIV, FLOAT_DIV } = require('.')
const { Lexer } = require('./Lexer')
const { NodeVisitor } = require('./NodeVisitor')
const { Parser } = require('./Parser/Parser')
const { SymbolTableBuilder } = require('./Symbol/SymbolTableBuilder')

class Interpreter extends NodeVisitor {
  constructor(tree) {
    super()
    this.tree = tree
    this.GLOBAL_SCOPE = {}
  }
  visitUnaryOp (node) {
    let visit = this.visit.bind(this)
    let type = node.token.type
    if (type == PLUS) {
      return +visit(node.expr)
    } else if (type == MINUS) {
      return -visit(node.expr)
    }
  }
  visitBinOp (node) {
    let visit = this.visit.bind(this)
    if (node.operator.type == PLUS) {
      return visit(node.left) + visit(node.right)
    }
    if (node.operator.type == MINUS) {
      return visit(node.left) - visit(node.right)
    }
    if (node.operator.type == MUL) {
      return visit(node.left) * visit(node.right)
    }
    if (node.operator.type == INTEGER_DIV) {
      return visit(node.left) / visit(node.right)
    }
    if (node.operator.type == FLOAT_DIV) {
      return visit(node.left) / visit(node.right)
    }
  }
  visitNum (node) {
    return node.value
  }
  visitProgram (node) {
    let visit = this.visit.bind(this)
    visit(node.block)
  }
  visitBlock (node) {
    let visit = this.visit.bind(this)
    node.declarations.map(declaration => visit(declaration))
    visit(node.compoundStatement)
  }
  visitProcedureDecl (node) { }
  visitVarDecl (node) { }
  visitType (node) { }
  visitNoOp (node) { }
  visitAssign (node) {
    let varName = node.left.value
    this.GLOBAL_SCOPE[varName] = this.visit(node.right)
  }
  visitVar (node) {
    let varName = node.value
    let val = this.GLOBAL_SCOPE[varName]
    if (val == undefined) {
      throw new Error(`NameError varName ${varName}`)
    } else {
      return val
    }
  }
  visitCompound (node) {
    let visit = this.visit.bind(this)
    for (const child of node.children) {
      visit(child)
    }
  }
  interpret () {
    let tree = this.tree
    // console.log('tree', tree)
    if (tree == undefined) {
      return ''
    }
    return this.visit(tree)
  }
}

const main = function () {
  let text = `
              PROGRAM Part12;
VAR
   a : INTEGER;

PROCEDURE P1;
VAR
   a : REAL;
   k : INTEGER;

   PROCEDURE P2;
   VAR
      a, z : INTEGER;
   BEGIN {P2}
      z := 777;
   END;  {P2}

BEGIN {P1}

END;  {P1}

BEGIN {Part12}
   a := 10;
END.  {Part12}
             `
  let lexer = new Lexer(text)
  let parser = new Parser(lexer)
  let tree = parser.parse()
  let interpreter = new Interpreter(tree)
  let symbolTableBuilder = SymbolTableBuilder.new()
  symbolTableBuilder.visit(tree)
  log('')
  log('Symbol Table contents:')
  log(symbolTableBuilder.symbolsTable)
  let interpret = interpreter.interpret()

  log('')
  log('Run-time GLOBAL_MEMORY contents:')
  const scope = interpreter.GLOBAL_SCOPE
  for (const key in scope) {
    log(`${key} = ${scope[key]}`)
  }
}

if (require.main === module) {
  main()
}
