package main

import (
	"fmt"
	"log"
	"regexp"
	"strconv"
	"unicode/utf8"
)

type Token struct {
	tokenType string
	value     string
}

func NewToken(tokenType string, value string) *Token {
	return &Token{
		tokenType: tokenType,
		value:     value,
	}
}

func (token *Token) format() string {
	s := "{ " + token.tokenType + " " + token.value + " }"
	return s
}

//
// LEXER
//

const (
	INTEGER = "INTEGER"
	PLUS    = "PLUS"
	MINUS   = "MINUS"
	MUL     = "MUL"
	DIV     = "DIV"
	MOD     = "MOD"
	POWER   = "POWER"
	LPAREN  = "LPAREN"
	RPAREN  = "RPAREN"
	EOF     = "EOF"
)

type Lexer struct {
	text        string
	pos         int
	currentChar *string
}

func NewLexer(text string) *Lexer {
	pos := 0
	currentChar := string([]rune(text)[pos])
	return &Lexer{
		text:        text,
		pos:         pos,
		currentChar: &currentChar,
	}
}

func (lexer *Lexer) format() string {
	s := "{ text: " + lexer.text +
		", pos: " + strconv.Itoa(lexer.pos) +
		", currentChar: " + *lexer.currentChar + " }"
	return s
}

func (lexer *Lexer) advance() {
	lexer.pos++
	if lexer.pos > utf8.RuneCountInString(lexer.text)-1 {
		lexer.currentChar = nil
	} else {
		*lexer.currentChar = string([]rune(lexer.text)[lexer.pos])
	}
}

func isSpace(word string) bool {
	whitespace := regexp.MustCompile(`\s`).MatchString(word)
	return whitespace
}

func (lexer *Lexer) skipWhitespace() {
	if lexer.currentChar != nil && isSpace(*lexer.currentChar) {
		lexer.advance()
	}
}

func isInteger(word string) bool {
	integer := regexp.MustCompile(`\d`).MatchString(word)
	return integer
}

func (lexer *Lexer) integer() string {
	result := ""

	for lexer.currentChar != nil && isInteger(*lexer.currentChar) {
		result += *lexer.currentChar
		lexer.advance()
	}
	// n, _ := strconv.Atoi(result)
	return result
}

func (lexer *Lexer) getNextToken() *Token {

	for lexer.currentChar != nil {

		if isSpace(*lexer.currentChar) {
			lexer.skipWhitespace()
			continue
		}

		if isInteger(*lexer.currentChar) {
			return NewToken(INTEGER, lexer.integer())
		}

		if *lexer.currentChar == "+" {
			lexer.advance()
			return NewToken(PLUS, "+")
		}

		if *lexer.currentChar == "-" {
			lexer.advance()
			return NewToken(MINUS, "-")
		}

		if *lexer.currentChar == "*" {
			lexer.advance()
			return NewToken(MUL, "*")
		}

		if *lexer.currentChar == "/" {
			lexer.advance()
			return NewToken(DIV, "/")
		}

		if *lexer.currentChar == "^" {
			lexer.advance()
			return NewToken(POWER, "^")
		}

		if *lexer.currentChar == "%" {
			lexer.advance()
			// fmt.Println("MOD ->", MOD)
			return NewToken(MOD, "%")
		}

		if *lexer.currentChar == "(" {
			lexer.advance()
			return NewToken(LPAREN, "(")
		}

		if *lexer.currentChar == ")" {
			lexer.advance()
			return NewToken(RPAREN, ")")
		}

	}
	return NewToken(EOF, "nil")
}

//
// Parser
//

type AST struct {
	token    *Token
	astType  string
	children []AST
}

// astType
const (
	UNARY_OP = "UNARY_OP"
	NUM      = "NUM"
	BIN_OP   = "BIN_OP"
)

func NewAST(token *Token, astType string, children []AST) *AST {
	return &AST{
		token:    token,
		astType:  astType,
		children: children,
	}
}

type Parser struct {
	lexer        *Lexer
	currentToken *Token
}

func NewParser(lexer *Lexer) *Parser {
	currentToken := lexer.getNextToken()
	return &Parser{
		lexer:        lexer,
		currentToken: currentToken,
	}
}

func (parser *Parser) error() {
	log.Fatal("Invalid syntax")
}

func (parser *Parser) eat(tokenType string) {
	if parser.currentToken.tokenType == tokenType {
		parser.currentToken = parser.lexer.getNextToken()
	} else {
		parser.error()
	}
}

func (parser *Parser) factor() *AST {
	token := parser.currentToken

	if parser.currentToken.tokenType == PLUS {
		parser.eat(PLUS)
		node := NewAST(token, UNARY_OP, []AST{*parser.factor()})
		return node
	}

	if parser.currentToken.tokenType == MINUS {
		parser.eat(MINUS)
		node := NewAST(token, UNARY_OP, []AST{*parser.factor()})
		return node
	}

	if token.tokenType == INTEGER {
		parser.eat(INTEGER)
		return NewAST(token, NUM, []AST{})
	}

	if token.tokenType == LPAREN {
		parser.eat(LPAREN)
		node := parser.expr()
		parser.eat(RPAREN)
		return node
	}
	return &AST{}
}

func (parser *Parser) term() *AST {
	node := parser.factor()

	for parser.currentToken.tokenType == MUL ||
		parser.currentToken.tokenType == DIV ||
		parser.currentToken.tokenType == MOD {
		token := parser.currentToken

		if parser.currentToken.tokenType == MUL {
			parser.eat(MUL)
			children := []AST{*node, *parser.factor()}
			node = NewAST(token, BIN_OP, children)

		} else if parser.currentToken.tokenType == DIV {
			parser.eat(DIV)
			children := []AST{*node, *parser.factor()}
			node = NewAST(token, BIN_OP, children)

		} else if parser.currentToken.tokenType == MOD {
			parser.eat(MOD)
			children := []AST{*node, *parser.factor()}
			node = NewAST(token, BIN_OP, children)
		}
	}
	return node
}

func (parser *Parser) expr() *AST {
	node := parser.term()

	for parser.currentToken.tokenType == PLUS ||
		parser.currentToken.tokenType == MINUS {
		token := parser.currentToken

		if parser.currentToken.tokenType == PLUS {
			parser.eat(PLUS)
			children := []AST{*node, *parser.term()}
			node = NewAST(token, BIN_OP, children)

		} else if parser.currentToken.tokenType == MINUS {

			parser.eat(MINUS)
			children := []AST{*node, *parser.term()}
			node = NewAST(token, BIN_OP, children)
		}
	}
	return node
}

func (parser *Parser) parse() *AST {
	node := parser.expr()
	if parser.currentToken.tokenType != EOF {
		fmt.Println("current token ->", parser.currentToken)
		parser.error()
	}
	return node
}

func (parser *Parser) each() {
	for parser.currentToken.tokenType != EOF {
		fmt.Println("current token ->", parser.currentToken)
		parser.currentToken = parser.lexer.getNextToken()
	}
}

type Interpreter struct {
	parser *Parser
}

func NewInterpreter(parser *Parser) *Interpreter {
	interpreter := Interpreter{
		parser: parser,
	}
	return &interpreter
}

func (interpreter *Interpreter) visitNum(node *AST) int {
	n, _ := strconv.Atoi(node.token.value)
	return n
}

func (interpreter *Interpreter) visitBinop(node *AST) int {

	leftVal := interpreter.visit(&node.children[0])
	rightVal := interpreter.visit(&node.children[1])

	if node.token.tokenType == PLUS {
		return leftVal + rightVal
	}
	if node.token.tokenType == MINUS {
		return leftVal - rightVal
	}
	if node.token.tokenType == MUL {
		return leftVal * rightVal
	}
	if node.token.tokenType == DIV {
		return leftVal / rightVal
	}
	if node.token.tokenType == MOD {
		return leftVal % rightVal
	}
	log.Fatal("Visit Binop Error")
	return 0
}

func (interpreter *Interpreter) visitUnaryOp(node *AST) int {
	if node.token.tokenType == PLUS {
		return +interpreter.visit(&node.children[0])
	}
	if node.token.tokenType == MINUS {
		return -interpreter.visit(&node.children[0])
	}

	log.Fatal("Visit UnaryOp Error")
	return 0
}

func (interpreter *Interpreter) visit(node *AST) int {

	if node.astType == UNARY_OP {
		return interpreter.visitUnaryOp(node)
	}

	if node.astType == BIN_OP {
		return interpreter.visitBinop(node)
	}

	if node.astType == NUM {
		return interpreter.visitNum(node)
	}
	log.Fatal("Visit Error")
	return 0
}

func (interpreter *Interpreter) interpret() int {
	tree := interpreter.parser.parse()
	result := interpreter.visit(tree)
	return result
}

func ensure(condition bool, message string) {
	if !condition {
		fmt.Println("*** 测试失败:", message)
	} else {

		fmt.Println("*** 测试成功:", message)
	}
}

func makeInterpreter(text string) *Interpreter {
	lexer := NewLexer(text)
	parser := NewParser(lexer)
	interpreter := NewInterpreter(parser)
	return interpreter
}

func testExpression1() {
	interpreter := makeInterpreter("3")
	result := interpreter.interpret()
	ensure(result == 3, "test_expression1")
}

func testExpression2() {
	interpreter := makeInterpreter("2 + 7 * 4")
	result := interpreter.interpret()
	ensure(result == 30, "test_expression2")
}

func testExpression3() {
	interpreter := makeInterpreter("7 - 8 / 4")
	result := interpreter.interpret()
	ensure(result == 5, "test_expression3")
}

func testExpression4() {
	interpreter := makeInterpreter("14 + 2 * 3 - 6 / 2")
	result := interpreter.interpret()
	ensure(result == 17, "test_expression4")
}

func testExpression5() {
	interpreter := makeInterpreter("7 + 3 * (10 / (12 / (3 + 1) - 1))")
	result := interpreter.interpret()
	ensure(result == 22, "test_expression5")
}

func testExpression6() {
	interpreter := makeInterpreter(
		"7 + 3 * (10 / (12 / (3 + 1) - 1)) / (2 + 3) - 5 - 3 + (8)",
	)
	result := interpreter.interpret()
	ensure(result == 10, "test_expression6")
}

func testExpression7() {
	interpreter := makeInterpreter("7 + (((3 + 2)))")
	result := interpreter.interpret()
	ensure(result == 12, "test_expression7")
}

func testExpression8() {
	interpreter := makeInterpreter("10 *")
	result := interpreter.interpret()
	ensure(result == 0, "test_expression8")
}

func main() {
	// lexer := NewLexer("8 / -8 % 6")
	// parser := NewParser(lexer)
	// parser.each()
	// interpreter := NewInterpreter(parser)
	// r := interpreter.interpret()
	// fmt.Println("r ->", r)
	// fmt.Println("r ->", 8/-8%6)
	testExpression1()
	testExpression2()
	testExpression3()
	testExpression4()
	testExpression5()
	testExpression6()
	testExpression7()
	testExpression8()
}
