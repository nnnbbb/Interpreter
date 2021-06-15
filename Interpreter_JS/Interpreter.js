const { log } = console
const { PLUS, MINUS, MUL, DIV } = require('.')
const { Lexer } = require('./Lexer')
const { Parser } = require('./Parser/Parser')

class NodeVisitor {
  constructor() {}
  visit(node) {
    let methodName = 'visit' + node.constructor.name
    return this[methodName](node)
  }
}
class Interpreter extends NodeVisitor {
  constructor(parser) {
    super()
    this.parser = parser
  }
  visitUnaryOp(node) {
    let visit = this.visit.bind(this)
    let type = node.token.type
    if (type == PLUS) {
      return +visit(node.expr)
    } else if (type == MINUS) {
      return -visit(node.expr)
    }
  }
  visitBinOp(node) {
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
    if (node.operator.type == DIV) {
      return visit(node.left) / visit(node.right)
    }
  }
  visitNum(node) {
    return node.value
  }
  interpret() {
    let tree = this.parser.parse()
    // console.log('tree', tree)
    return this.visit(tree)
  }
}

const main = function () {
  let text = '10---2'
  let lexer = new Lexer(text)
  let parser = new Parser(lexer)
  let interpreter = new Interpreter(parser)
  let interpret = interpreter.interpret()
  log('interpret', interpret)
}

main()
