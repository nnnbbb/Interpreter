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
    this.GLOBAL_SCOPE = {}
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
  visitNoOp(node) {}
  visitAssign(node) {
    let varName = node.left.value
    this.GLOBAL_SCOPE[varName] = this.visit(node.right)
  }
  visitVar(node) {
    let varName = node.value
    let val = this.GLOBAL_SCOPE[varName]
    if (val == undefined) {
      throw new Error(`NameError varName ${varName}`)
    } else {
      return val
    }
  }
  visitCompound(node) {
    let visit = this.visit.bind(this)
    for (const child of node.children) {
      visit(child)
    }
  }
  interpret() {
    let tree = this.parser.parse()
    // console.log('tree', tree)
    return this.visit(tree)
  }
}

const main = function () {
  let text = `BEGIN
                  BEGIN
                      number := 2;
                      a := number;
                      b := 10 * a + 10 * number / 4;
                      d := 3;
                      c := a - - b + d;
                  END;
                  x := 11;
              END.
             `

  let lexer = new Lexer(text)
  let parser = new Parser(lexer)
  let interpreter = new Interpreter(parser)
  let interpret = interpreter.interpret()
  log('interpret', interpreter.GLOBAL_SCOPE)
}
main()
