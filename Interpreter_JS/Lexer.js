const {
  INTEGER,
  PLUS,
  MINUS,
  MUL,
  DIV,
  LPAREN,
  RPAREN,
  ID,
  ASSIGN,
  BEGIN,
  END,
  SEMI,
  PROGRAM,
  VAR,
  COLON,
  COMMA,
  INTEGER_DIV,
  FLOAT_DIV,
  DOT,
  EOF,
} = require('.')
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
  PROGRAM: new Token('PROGRAM', 'PROGRAM'),
  VAR: new Token('VAR', 'VAR'),
  DIV: new Token('INTEGER_DIV', 'DIV'),
  INTEGER: new Token('INTEGER', 'INTEGER'),
  REAL: new Token('REAL', 'REAL'),
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
  static new (...args) {
    return new this(...args)
  }
  skipComment () {
    while (this.currentChar != '}') {
      this.advance()
    }
    this.advance()  // the closing curly brace
  }
  skipComment1 () {
    while (this.currentChar != '\n') {
      this.advance()
    }
    this.advance()  // the closing curly brace
  }
  number () {
    // """Return a (multidigit) integer or float consumed from the input."""
    let result = ''
    let token
    while (this.currentChar != undefined && this.currentChar.isdigit()) {
      result += this.currentChar
      this.advance()
    }
    if (this.currentChar == '.') {
      result += this.currentChar
      this.advance()
      while (this.currentChar != undefined && this.currentChar.isdigit()) {
        result += this.currentChar
        this.advance()
        token = new Token('REAL_CONST', Number(result))
      }
    } else {
      token = new Token('INTEGER_CONST', Number(result))
    }
    return token
  }
  peek () {
    let peek_pos = this.pos + 1
    if (peek_pos > this.text.length - 1) {
      return null
    } else {
      return this.text[peek_pos]
    }
  }

  advance () {
    this.pos += 1
    if (this.currentChar != undefined) {
      this.currentChar = this.text[this.pos]
    }
  }
  skipWhitespace () {
    while (this.currentChar != undefined && this.currentChar.isspace()) {
      this.advance()
    }
  }
  // integer () {
  //   let result = ''
  //   while (this.currentChar != undefined && this.currentChar.isdigit()) {
  //     result += this.currentChar
  //     this.advance()
  //   }
  //   return Number(result)
  // }
  error () {
    console.log('this.currentChar.charCodeAt()', this.currentChar.charCodeAt())
    let message = `lexer error currentChar '${this.currentChar}' pos ${this.pos}`
    throw new Error(message)
  }
  _id () {
    let result = ''
    while (this.currentChar != undefined && this.currentChar.isalnum()) {
      result += this.currentChar
      this.advance()
    }
    let token = RESERVED_KEYWORDS[result] || new Token(ID, result)
    return token
  }

  getNextToken () {
    while (this.currentChar != undefined) {
      if (this.currentChar.isspace()) {
        this.skipWhitespace()
        continue
      }
      if (this.currentChar.isalpha()) {
        return this._id()
      }
      if (this.currentChar == '{') {
        this.advance()
        this.skipComment1()
        continue
      }
      if (this.currentChar == '/' && this.peek() == '/') {
        this.advance()
        this.advance()
        this.skipComment()
        continue
      }
      if (this.currentChar.isdigit()) {
        return this.number()
      }
      if (this.currentChar == ',') {
        this.advance()
        return new Token(COMMA, ',')
      }
      if (this.currentChar == '/') {
        this.advance()
        return new Token(FLOAT_DIV, '/')
      }
      if (this.currentChar == ':' && this.peek() == '=') {
        this.advance()
        this.advance()
        return new Token(ASSIGN, ':=')
      }
      if (this.currentChar == ':') {
        this.advance()
        return new Token(COLON, ':')
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
function test () {
  let text = `
              PROGRAM Part10;
              
              VAR
                number     : INTEGER;
                a, b, c, x : INTEGER;
                y          : REAL;

              BEGIN {Part10}
                BEGIN
                    number := 2;
                    a := number;
                    b := 10 * a + 10 * number DIV 4;
                    c := a - - b
                END;
                x := 11;
                y := 20 / 7 + 3.14;
                // writeln('a = ', a); 
                // writeln('b = ', b); 
                // writeln('c = ', c); 
                // writeln('number = ', number); 
                // writeln('x = ', x); 
                // writeln('y = ', y); 
              END.  {Part10}
             `
  let lexer = new Lexer(text)
  while (true) {
    let token = lexer.getNextToken()
    if (token.value == null) {
      log(token)
      break
    } else {
      log(token)
    }
  }
}
if (require.main === module) {
  test()
}
