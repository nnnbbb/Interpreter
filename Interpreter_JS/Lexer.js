const { INTEGER, PLUS, MINUS, MUL, DIV, LPAREN, RPAREN, ID, ASSIGN, BEGIN, END, SEMI, DOT, EOF } = require('.')
const log = console.log.bind(console)
class Token {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}
String.prototype.isalpha = function () {
  return /^[A-Z]$/i.test(this)
}
String.prototype.isalnum = function () {
  return /^[a-z0-9]+$/i.test(this)
}
String.prototype.isspace = function () {
  return /\s/g.test(this)
}
String.prototype.isdigit = function () {
  return /^\d+$/.test(this)
}

const RESERVED_KEYWORDS = {
  BEGIN: new Token('BEGIN', 'BEGIN'),
  END: new Token('END', 'END'),
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
  peek() {
    let peek_pos = this.pos + 1
    if (peek_pos > this.text.length - 1) {
      return null
    } else {
      return this.text[peek_pos]
    }
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
  integer() {
    let result = ''
    while (this.currentChar != undefined && this.currentChar.isdigit()) {
      result += this.currentChar
      this.advance()
    }
    return Number(result)
  }
  error() {
    console.log('this.currentChar.charCodeAt()', this.currentChar.charCodeAt())
    let message = `lexer error currentChar '${this.currentChar}' pos ${this.pos}`
    throw new Error(message)
  }
  _id() {
    let result = ''
    while (this.currentChar != undefined && this.currentChar.isalnum()) {
      result += this.currentChar
      this.advance()
    }
    let token = RESERVED_KEYWORDS[result] || new Token(ID, result)
    return token
  }

  getNextToken() {
    while (this.currentChar != undefined) {
      if (this.currentChar.isspace()) {
        this.skipWhitespace()
        continue
      }
      if (this.currentChar.isalpha()) {
        return this._id()
      }
      if (this.currentChar.isdigit()) {
        return new Token(INTEGER, this.integer())
      }
      if (this.currentChar == ':' && this.peek() == '=') {
        this.advance()
        this.advance()
        return new Token(ASSIGN, ':=')
      }
      if (this.currentChar == ';') {
        this.advance()
        return new Token(SEMI, ';')
      }
      if (this.currentChar == '.') {
        this.advance()
        return new Token(DOT, '.')
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
    return new Token(EOF, null)
  }
}
module.exports = {
  Lexer,
}
function test() {
  let lexer = new Lexer('BEGIN a := 2; END.')
  log(lexer.getNextToken())
  // Token(BEGIN, 'BEGIN')
  log(lexer.getNextToken())
  // Token(ID, 'a')
  log(lexer.getNextToken())
  // Token(ASSIGN, ':=')
  log(lexer.getNextToken())
  // Token(INTEGER, 2)
  log(lexer.getNextToken())
  // Token(SEMI, ';')
  log(lexer.getNextToken())
  // Token(END, 'END')
  log(lexer.getNextToken())
  // Token(DOT, '.')
  log(lexer.getNextToken())
  // Token(EOF, None)
}
// test()
