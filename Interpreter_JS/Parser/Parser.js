const { INTEGER, PLUS, MINUS, MUL, DIV, LPAREN, RPAREN, ID, ASSIGN, BEGIN, END, SEMI, EOF, DOT } = require('..')
const { BinOp } = require('./BinOp')
const { Num } = require('./Num')
const { UnaryOp } = require('./UnaryOp')
const { Compound } = require('./Compound')
const { Assign } = require('./Assign')
const { Var } = require('./Var')
const { NoOp } = require('./NoOp')

class Parser {
  constructor(lexer) {
    this.lexer = lexer
    this.currentToken = this.lexer.getNextToken()
  }
  eat(tokenType) {
    // console.log('eat tokenType', tokenType)
    // console.log('eat currentToken', this.currentToken)
    if (this.currentToken.type == tokenType) {
      this.currentToken = this.lexer.getNextToken()
    } else {
      this.error()
    }
  }
  program() {
    // """program : compoundStatement DOT"""
    let node = this.compoundStatement()
    this.eat(DOT)
    return node
  }
  compoundStatement() {
    // compoundStatement: BEGIN statementList END
    this.eat(BEGIN)
    let nodes = this.statementList()
    this.eat(END)

    let root = Compound.new()
    for (const node of nodes) {
      root.children.push(node)
    }
    return root
  }
  statementList() {
    // statementList : statement
    //                | statement SEMI statementList
    let node = this.statement()

    let results = [node]

    while (this.currentToken.type == SEMI) {
      this.eat(SEMI)
      results.push(this.statement())
    }

    if (this.currentToken.type == ID) {
      this.error()
    }

    return results
  }
  statement() {
    // statement : compound_statement
    //           | assignment_statement
    //           | empty
    let node
    if (this.currentToken.type == BEGIN) {
      node = this.compoundStatement()
    } else if (this.currentToken.type == ID) {
      node = this.assignmentStatement()
    } else {
      node = this.empty()
    }
    return node
  }
  assignmentStatement() {
    // assignmentStatement : variable ASSIGN expr
    let left = this.variable()
    let token = this.currentToken
    this.eat(ASSIGN)
    let right = this.expr()
    let node = Assign.new(left, token, right)
    return node
  }
  variable() {
    // variable: ID
    // console.log('variable currentToken', this.currentToken)
    let node = Var.new(this.currentToken)
    this.eat(ID)
    return node
  }
  empty() {
    //  An empty production
    return NoOp.new()
  }
  error() {
    throw new Error('Error parsing input currentToken value: ' + this.currentToken.value)
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
    } else {
      node = this.variable()
      return node
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
    let node = this.program()
    if (this.currentToken.type != EOF) {
      this.error()
    }
    // console.log('parse node', node)
    return node
  }
}
module.exports = {
  Parser,
}
