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
  INTEGER_CONST,
  REAL_CONST,
  REAL,
  DOT,
  EOF,
} = require('..')
const { BinOp } = require('./BinOp')
const { Num } = require('./Num')
const { UnaryOp } = require('./UnaryOp')
const { Compound } = require('./Compound')
const { Assign } = require('./Assign')
const { Var } = require('./Var')
const { NoOp } = require('./NoOp')
const { Block } = require('./Block')
const { Program } = require('./Program')
const { Type } = require('./Type')
const { VarDecl } = require('./VarDecl')
const { Lexer } = require('../Lexer')
// const { log } = require('../log')

class Parser {
  constructor(lexer) {
    this.lexer = lexer
    this.currentToken = this.lexer.getNextToken()
  }
  static new (...args) {
    return new this(...args)
  }
  eat (tokenType) {
    // console.log('eat tokenType', tokenType)
    // console.log('eat currentToken', this.currentToken)
    if (this.currentToken.type == tokenType) {
      this.currentToken = this.lexer.getNextToken()
    } else {
      this.error()
    }
  }
  program () {
    // program : PROGRAM variable SEMI block DOT
    this.eat(PROGRAM)
    let varNode = this.variable()
    let progName = varNode.value
    this.eat(SEMI)
    let blockNode = this.block()
    let programNode = Program.new(progName, blockNode)
    this.eat(DOT)
    return programNode
  }
  block () {
    // block : declarations compoundStatement
    let declarationNodes = this.declarations()
    let compoundStatementNode = this.compoundStatement()
    let node = Block.new(declarationNodes, compoundStatementNode)
    return node
  }
  declarations () {
    // declarations : VAR (variableDeclaration SEMI)+
    //              | empty
    let declarations = []
    if (this.currentToken.type == VAR) {
      this.eat(VAR)
    }
    while (this.currentToken.type == ID) {
      let varDecl = this.variableDeclaration()
      declarations = declarations.concat(varDecl)
      this.eat(SEMI)
    }
    return declarations
  }
  variableDeclaration () {
    // variable_declaration : ID (COMMA ID)* COLON type_spec
    let varNodes = [Var.new(this.currentToken)]  // first ID
    this.eat(ID)

    while (this.currentToken.type == COMMA) {
      this.eat(COMMA)
      varNodes.push(Var.new(this.currentToken))
      this.eat(ID)
    }
    this.eat(COLON)
    let typeNode = this.typeSpec()
    let varDeclarations = varNodes.map((varNode) => VarDecl.new(varNode, typeNode))
    return varDeclarations
  }
  typeSpec () {
    // type_spec : INTEGER
    //           | REAL    
    let token = this.currentToken
    if (this.currentToken.type == INTEGER) {
      this.eat(INTEGER)
    } else {
      this.eat(REAL)
    }
    let node = Type.new(token)
    return node

  }
  compoundStatement () {
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
  statementList () {
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
  statement () {
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
  assignmentStatement () {
    // assignmentStatement : variable ASSIGN expr
    let left = this.variable()
    let token = this.currentToken
    this.eat(ASSIGN)
    let right = this.expr()
    let node = Assign.new(left, token, right)
    return node
  }
  variable () {
    // variable: ID
    // console.log('variable currentToken', this.currentToken)
    let node = Var.new(this.currentToken)
    this.eat(ID)
    return node
  }
  empty () {
    //  An empty production
    return NoOp.new()
  }
  error () {
    throw new Error('Error parsing input currentToken value: ' + this.currentToken.value)
  }
  factor () {
    /**
    factor : PLUS factor
           | MINUS factor
           | INTEGER_CONST
           | REAL_CONST
           | LPAREN expr RPAREN
           | variable
    */
    let token = this.currentToken
    let node
    if (token.type == INTEGER) {
      this.eat(INTEGER)
      node = Num.new(token)
    } else if (token.type == LPAREN) {
      this.eat(LPAREN)
      node = this.expr()
      this.eat(RPAREN)
    } else if (token.type == INTEGER_CONST) {
      this.eat(INTEGER_CONST)
      return Num.new(token)
    } else if (token.type == REAL_CONST) {
      this.eat(REAL_CONST)
      return Num.new(token)
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
  term () {
    // term : factor ((MUL | INTEGER_DIV | FLOAT_DIV) factor)*
    let node = this.factor()
    while ([MUL, INTEGER_DIV, FLOAT_DIV].includes(this.currentToken.type)) {
      let token = this.currentToken
      if (token.type == MUL) {
        this.eat(MUL)
      } else if (token.type == INTEGER_DIV) {
        this.eat(INTEGER_DIV)
      } else if (token.type == FLOAT_DIV) {
        this.eat(FLOAT_DIV)
      }
      node = BinOp.new(node, token, this.factor())
    }
    return node
  }
  expr () {
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
  parse () {
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
function test () {
  let text = `
              PROGRAM Part10AST;
              VAR
                a, b : INTEGER;
                y    : REAL;

              BEGIN {Part10AST}
                a := 2;
                b := 10 * a + 10 * a DIV 4;
                y := 20 / 7 + 3.14;
              END.  {Part10AST}
             `
  let lexer = new Lexer(text)
  let parser = new Parser(lexer)
  let tree = parser.parse()
  const util = require('util')
  console.log(util.inspect(tree, { depth: 8 }))
}


if (require.main === module) {
  test()
}