const { log } = console
const { INTEGER, PLUS, MINUS, MUL, DIV, LPAREN, RPAREN, EOF } = require('.')
const { Lexer } = require('./Lexer')

class Interpreter {
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
    if (token.type == INTEGER) {
      this.eat(INTEGER)
      return token.value
    } else if (token.type == LPAREN) {
      this.eat(LPAREN)
      let result = this.expr()
      this.eat(RPAREN)
      return result
    }
  }
  term() {
    let result = this.factor()
    let token = this.currentToken
    while ([MUL, DIV].includes(token.type)) {
      if (token.type == MUL) {
        this.eat(MUL)
        return (result = result * this.factor())
      } else if (token.type == DIV) {
        this.eat(DIV)
        return (result = result / this.factor())
      }
    }
    return result
  }
  expr() {
    let result = this.term()
    while ([PLUS, MINUS].includes(this.currentToken.type)) {
      let token = this.currentToken
      if (token.type == PLUS) {
        this.eat(PLUS)
        result = result + this.term()
      } else if (token.type == MINUS) {
        this.eat(MINUS)
        result = result - this.term()
      }
    }
    return result
  }
}
const main = function () {
  let text = '3 + 5*(10-2)'
  let lexer = new Lexer(text)
  let i = new Interpreter(lexer)
  let r = i.expr()
  log('r', r)
}

main()
