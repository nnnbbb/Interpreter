const TAG_START = "TAG_START"
const TAG_END = "TAG_END"
const ATTRIBUTE = "ATTRIBUTE"
const TEXT = "TEXT"
const EOF = "EOF"
const ID = "ID"
const START_TAG_START = "START_TAG_START"
const END_TAG_START = "END_TAG_START"
const TAG_NAME = "TAG_NAME"
const ASSIGN = 'ASSIGN'
const QUOTES = 'QUOTES'

// Symbol maker
const Symbols = new Proxy({}, { get: (_, k) => Symbol(k) })
const {
  tagOpen,
} = Symbols

String.prototype.isspace = function () {
  return /\s/g.test(this)
}

String.prototype.isalpha = function () {
  return /^[A-Z]$/i.test(this)
}

String.prototype.isTag = function () {
  return /[a-z]+$/i.test(this)
}

String.prototype.isText = function () {
  return /[^<>/]/i.test(this)
}

class Token {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
  static new (...args) {
    return new this(...args)
  }
}

const ATTRIBUTES = {
  class: Token.new(ATTRIBUTE, 'CLASS'),
}

class Lexer {
  constructor(text) {
    this.text = text
    this.pos = 0
    this.currentToken = ''
    this.currentChar = this.text[this.pos]
    this.startTag = false
    this.state = null
  }
  static new (...args) {
    return new this(...args)
  }
  peek (length = 1) {
    let peekPos = this.pos + length
    if (peekPos > this.text.length - 1) {
      return null
    } else {
      return this.text.substring(this.pos, peekPos)
    }
  }
  tagEnd () {
    let result = ''
    while (this.currentChar !== undefined && this.currentChar.isTag()) {
      result += this.currentChar
      this.advance()
    }
    return new Token(TAG_END, result)
  }
  textToken () {
    let result = ''
    while (this.currentChar.isText()) {

      result += this.currentChar
      this.advance()
    }
    return new Token(TEXT, result)

  }
  attribute () {
    return 'attribute'
  }
  tagStart () {
    let result = ''
    while (this.currentChar.isalpha()) {
      result += this.currentChar
      this.advance()
    }
    let token = ATTRIBUTES[result] || new Token(TAG_NAME, result)
    return token

  }
  [tagOpen] () {
    if (this.currentChar == '<') {
      this.advance()
      return Token.new(START_TAG_START, '<')
    }
  }
  getNextToken () {
    while (this.currentChar != undefined) {

      // if (this.currentChar == 'c' && this.peek(5) == 'lass') {
      //   return this.attribute()
      // }

      // if (this.currentChar.isText()) {
      //   return this.textToken()
      // }

      if (this.currentChar.isspace()) {
        this.skipWhitespace()
        continue
      }
      // if (this.currentChar == '<' && this.peek() == '/') {
      //   return this.tagEnd()
      // }
      if (this.currentChar == '"') {
        this.advance()
        return new Token(QUOTES, '"')
      }
      if (this.currentChar == "'") {
        this.advance()
        return new Token(QUOTES, "'")
      }
      if (this.currentChar == '=') {
        this.advance()
        return new Token(ASSIGN, '=')
      }
      if (this.state != null) {
        return this[this.state]()
      }
      if (this.currentChar == '<') {
        // this.advance()
        // this.startTag = true
        this.state = tagOpen
        return this[this.state]()
        // return this.tagStart()
      }
      // if (this.currentChar == '>') {
      //   this.advance()
      //   this.startTag = false
      //   return Token.new(END_TAG_START, '>')
      // }
      // if (this.currentChar.isalpha() && this.startTag) {
      //   return this.tagStart()
      // }
      // if (this.currentChar == '<' && this.peek() == '/') {
      //   return this.tagEnd()
      // }
      // if (this.currentChar == '/>')

    }
    return new Token(EOF, null)

  }
  skipWhitespace () {
    while (this.currentChar != undefined && this.currentChar.isspace()) {
      this.advance()
    }
  }
  advance () {
    this.pos += 1
    if (this.currentChar != undefined) {
      this.currentChar = this.text[this.pos]
    }
  }
}
function test () {
  let text = `<h1>`
  let lexer = Lexer.new(text)
  while (true) {
    let token = lexer.getNextToken()
    if (token.value == null) {
      console.log(token)
      break
    } else {
      console.log(token)
    }
  }
}

if (require.main === module) {
  test()
}
