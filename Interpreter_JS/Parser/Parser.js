const { INTEGER, PLUS, MINUS, MUL, DIV, LPAREN, RPAREN, EOF } = require('..')
const { BinOp } = require('./BinOp')
const { Num } = require('./Num')
const { UnaryOp } = require('./UnaryOp')

class Parser {
  constructor(lexer) {
    this.lexer = lexer
    this.currentToken = this.lexer.getNextToken()
  }
  eat(tokenType) {
    if (this.currentToken.type == tokenType) {
      this.currentToken = this.lexer.getNextToken()
    } else {
      this.error()
    }
  }
  error() {
    throw new Error('Error parsing input this.currentChar: ' + this.currentChar)
  }
  factor() {
    let token = this.currentToken
    let node
    if (token.type == INTEGER) {
      this.eat(INTEGER)
      node = Num.new(token)
    } else if (token.type == LPAREN) {
      this.eat(LPAREN)
      node = this.expr()
      this.eat(RPAREN)
    } else if (token.type == PLUS) {
      this.eat(PLUS)
      node = UnaryOp.new(token, this.factor())
    } else if (token.type == MINUS) {
      this.eat(MINUS)
      node = UnaryOp.new(token, this.factor())
    }
    return node
  }
  term() {
    let node = this.factor()
    while ([MUL, DIV].includes(this.currentToken.type)) {
      let token = this.currentToken
      if (token.type == MUL) {
        this.eat(MUL)
      } else if (token.type == DIV) {
        this.eat(DIV)
      }
      node = BinOp.new(node, token, this.factor())
    }
    return node
  }
  expr() {
    let node = this.term()
    while ([PLUS, MINUS].includes(this.currentToken.type)) {
      let token = this.currentToken
      if (token.type == PLUS) {
        this.eat(PLUS)
      } else if (token.type == MINUS) {
        this.eat(MINUS)
      }
      node = BinOp.new(node, token, this.term())
    }
    return node
  }
  parse() {
    let expr = this.expr()
    return expr
  }
}
module.exports = {
  Parser,
}
