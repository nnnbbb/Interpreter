const EOF = 'EOF'
const INTEGER = 'INTEGER'
const PLUS = 'PLUS'
const MINUS = 'MINUS'
const MUL = 'MUL'
const DIV = 'DIV'
const LPAREN = 'LPAREN'
const RPAREN = 'RPAREN'

declare interface String {
  isspace(): boolean;
  isdigit(): boolean;
}

/** 空格换行等 */
String.prototype.isspace = function () {
  return /\s/g.test((this as string))
}
/** 数字 */
String.prototype.isdigit = function () {
  return /^\d+$/.test((this as string))
}

class Token {
  type: string
  value: string | number | null
  constructor(type: string, value: string | number | null) {
    this.type = type
    this.value = value
  }
}
/**
 * 词法分析器
 */
class Lexer {
  text: string
  currentToken: string
  pos: number
  currentChar: string
  constructor(text: string) {
    this.text = text
    this.pos = 0
    this.currentToken = ''
    this.currentChar = this.text[this.pos]
  }
  number() {
    let result = ''
    while (this.currentChar != undefined && this.currentChar.isdigit()) {
      result += this.currentChar
      this.advance()
    }
    return new Token(INTEGER, Number(result))
  }
  advance() {
    this.pos += 1
    if (this.currentChar != undefined) {
      this.currentChar = this.text[this.pos]
    }
  }
  skipWhitespace() {
    while (this.currentChar != undefined && this.currentChar.isspace()) {
      this.advance()
    }
  }
  error() {
    let message = `lexer error currentChar '${this.currentChar}' pos ${this.pos}`
    throw new Error(message)
  }

  getNextToken() {
    while (this.currentChar != undefined) {
      if (this.currentChar.isspace()) {
        this.skipWhitespace()
        continue
      }
      if (this.currentChar.isdigit()) {
        return this.number()
      }
      if (this.currentChar == '/') {
        this.advance()
        return new Token(DIV, '/')
      }
      if (this.currentChar == '+') {
        this.advance()
        return new Token(PLUS, '+')
      }
      if (this.currentChar == '-') {
        this.advance()
        return new Token(MINUS, '-')
      }
      if (this.currentChar == '*') {
        this.advance()
        return new Token(MUL, '*')
      }
      if (this.currentChar == '(') {
        this.advance()
        return new Token(LPAREN, '(')
      }
      if (this.currentChar == ')') {
        this.advance()
        return new Token(RPAREN, ')')
      }
      this.error()
    }
    return new Token(EOF, null)
  }
}


class AST { }

class Num extends AST {
  token: Token
  value: string | number | null
  constructor(token: Token) {
    super()
    this.token = token
    this.value = token.value
  }
}

class BinOp extends AST {
  left: AST
  right: AST
  token: Token
  operator: Token
  constructor(left: AST, operator: Token, right: AST) {
    super()
    this.left = left
    this.token = this.operator = operator
    this.right = right
  }
}

/**
 * 语法分析器
 */
class Parser {
  lexer: Lexer
  currentToken: Token
  constructor(lexer: Lexer) {
    this.lexer = lexer
    this.currentToken = this.lexer.getNextToken()
  }
  eat(tokenType: string) {
    if (this.currentToken.type == tokenType) {
      this.currentToken = this.lexer.getNextToken()
    } else {
      this.error()
    }
  }
  error() {
    throw new Error('Error parsing input currentToken value: ' + this.currentToken.value)
  }
  factor() {
    /**
    factor : INTEGER | LPAREN expr RPAREN
    */
    let token = this.currentToken
    if (token.type == INTEGER) {
      this.eat(INTEGER)
      return new Num(token)
    } else if (token.type == LPAREN) {
      this.eat(LPAREN)
      let node = this.expr()
      this.eat(RPAREN)
      return node
    }
  }
  term() {
    // term : factor ((MUL | DIV) factor)*
    let node = this.factor()
    while ([MUL, DIV].includes(this.currentToken.type)) {
      let token = this.currentToken
      if (token.type == MUL) {
        this.eat(MUL)
      } else if (token.type == DIV) {
        this.eat(DIV)
      }
      node = new BinOp(node, token, this.factor())
    }
    return node
  }
  expr() {
    /**
     expr   : term ((PLUS | MINUS) term)*
     term   : factor ((MUL | DIV) factor)*
     factor : INTEGER | LPAREN expr RPAREN
     */
    let node = this.term()
    while ([PLUS, MINUS].includes(this.currentToken.type)) {
      let token = this.currentToken
      if (token.type == PLUS) {
        this.eat(PLUS)
      } else if (token.type == MINUS) {
        this.eat(MINUS)
      }
      node = new BinOp(node, token, this.term())
    }
    return node
  }
  parse() {
    return this.expr()
  }
}


class NodeVisitor {
  visit(node: AST) {
    let methodName = 'visit' + node.constructor.name
    if (this[methodName] === undefined) {
      throw new Error(`visit ${methodName} is not a functiontion`)
    }
    return this[methodName](node)
  }
}

/**
 * 解释器  访问者模式 
 */
class Interpreter extends NodeVisitor {
  tree: AST
  constructor(tree: AST) {
    super()
    this.tree = tree
  }
  visitBinOp(node: BinOp) {
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
  visitNum(node: Num) {
    return node.value
  }
  interpret() {
    let tree = this.tree
    // console.log('tree', tree)
    if (tree == undefined) {
      return ''
    }
    return this.visit(tree)
  }
}


function ensure(condition: boolean, message: string) {
  if (!condition) {
    console.log("*** 测试失败:", message)
  } else {

    console.log("*** 测试成功:", message)
  }
}

function makeInterpreter(text: string) {
  let lexer = new Lexer(text)
  let parser = new Parser(lexer)
  let tree = parser.parse()
  let interpreter = new Interpreter(tree)
  return interpreter
}

function testExpression1() {
  let interpreter = makeInterpreter("3")
  let result = interpreter.interpret()
  ensure(result === 3, "test_expression1")
}

function testExpression2() {
  let expression = "2 + 7 * 4"
  let interpreter = makeInterpreter(expression)
  let result = interpreter.interpret()
  ensure(result === 30, expression)
}

function testExpression3() {
  let expression = "7 - 8 / 4"
  let interpreter = makeInterpreter(expression)
  let result = interpreter.interpret()
  ensure(result === 5, expression)
}

function testExpression4() {
  let expression = "14 + 2 * 3 - 6 / 2"
  let interpreter = makeInterpreter(expression)
  let result = interpreter.interpret()
  ensure(result === 17, expression)
}

function testExpression5() {
  let expression = "7 + 3 * (10 / (12 / (3 + 1) - 1))"
  let interpreter = makeInterpreter(expression)
  let result = interpreter.interpret()
  ensure(result === 22, expression)
}

function testExpression6() {
  let expression = "7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)"
  let interpreter = makeInterpreter(
    expression,
  )
  let result = interpreter.interpret()
  ensure(result === 10, expression)
}

function testExpression7() {
  let expression = "7 + (((3 + 2)))"
  let interpreter = makeInterpreter(expression)
  let result = interpreter.interpret()
  ensure(result === 12, expression)
}

function testExpression8() {
  let expression = "10 *"
  let interpreter = makeInterpreter(expression)
  let result = interpreter.interpret()
  ensure(result === 0, expression)
}
function main() {
  // let text = `(3 + 5) * 6`
  // let lexer = new Lexer(text)
  // let parser = new Parser(lexer)
  // let tree = parser.parse()
  // let interpreter = new Interpreter(tree)
  // let result = interpreter.interpret()
  // console.log('interpret ->', result)

  testExpression1()
  testExpression2()
  testExpression3()
  testExpression4()
  testExpression5()
  testExpression6()
  testExpression7()
  // testExpression8()

}

main()
