const { INTEGER, PLUS, MINUS, MUL, DIV, LPAREN, RPAREN, EOF } = require('.')

class Token {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}

function isdigit(str) {
  let n = str - parseFloat(str)
  // log(n)
  // log(isNaN(n))
  return !isNaN(n)
}

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
      if (this.currentChar == '*') {
        this.advance()
        return new Token(MUL, '*')
      }
      if (this.currentChar == '/') {
        this.advance()
        return new Token(DIV, '/')
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
    return new Token(EOF, undefined)
  }
}

module.exports = {
  Lexer,
}
