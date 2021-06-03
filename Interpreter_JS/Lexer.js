const {
  Token,
  INTEGER,
  PLUS,
  MINUS,
  EOF
} = require('./Interpreter')

class Lexer {
  constructor(text) {
    // # client string input, e.g. "3 + 5", "12 - 5", etc
    this.text = text
    // # this.pos is an index into this.text
    this.pos = 0
    // # current token instance
    this.currentToken = ''
    this.currentChar = this.text[this.pos]
  }
  advance() {
    this.pos += 1
    if (this.currentChar != undefined) {
      this.currentChar = this.text[this.pos]
    }
  }
  skipWhitespace() {
    while (this.currentChar != undefined && this.currentChar == ' ') {
      this.advance()
    }
  }
  integer() {
    let result = ''
    while (this.currentChar != undefined && isdigit(this.currentChar)) {
      result += this.currentChar
      this.advance()
    }
    return Number(result)
  }
  getNextToken() {
    while (this.currentChar != undefined) {
      if (this.currentChar == ' ') {
        this.skipWhitespace()
        continue
      }
      if (isdigit(this.currentChar)) {
        return new Token(INTEGER, this.integer())
      }

      if (this.currentChar == '+') {
        this.advance()
        return new Token(PLUS, '+')
      }
      if (this.currentChar == '-') {
        this.advance()
        return new Token(MINUS, '-')
      }
      this.error()
    }
    return new Token(EOF, undefined)
  }
  eat(tokenType) {
    if (this.currentToken.type == tokenType) {
      this.currentToken = this.getNextToken()
    } else {
      this.error()
    }
  }
  error() {
    throw new Error('Error parsing input this.currentChar: ' + this.currentChar)
  }
  term() {
    let token = this.currentToken
    this.eat(INTEGER)
    return token.value
  }
  expr() {
    this.currentToken = this.getNextToken()
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