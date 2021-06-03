1. expr
    1. term
        1. factor

树一直往左边生长?
Lexer ?
BinOp
Num
Parser
Token


UnaryOp是干嘛用的

lexer = Lexer(text)
parser = Parser(lexer)
interpreter = Interpreter(parser)
result = interpreter.interpret()

interpret调用顺序
1. parse
2. program
3. compound_statement
4. statement_list
5. statement
    self.compound_statement 
      if self.current_token.type == BEGIN:
        node = self.compound_statement()
      elif self.current_token.type == ID:
        node = self.assignment_statement()
6. self.assignment_statement
    left = self.variable()
    right = self.expr()

生成抽象语法树, 

TODO:
  写一下 self.visit 调用 
<!-- 
! 你要知道你在干什么?
! 你要知道问题是什么? 
-->

get_next_token
"""
一开始下标在这
'''(3 + 4) * 2'''
   ^
调用 get_next_token 就是
先将下标移动一次
'''(3 + 4) * 2'''
    ^
然后 return Token(LPAREN, '(')
"""

<!-- 
! 为什么 
! expr 有 PLUS, MINUS  
! factor 也有 PLUS, MINUS

! factor 的 PLUS, MINUS 代表符号

node = UnaryOp(token, self.factor())

class UnaryOp(AST):
    def __init__(self, op, expr):
        self.token = self.op = op
        self.expr = expr

def visit_UnaryOp(self, node):
    op = node.op.type
    if op == PLUS:
        return +self.visit(node.expr)
    elif op == MINUS:
        return -self.visit(node.expr) 
-->


Compound 每个节点长什么样
BinOp    加减乘除
Num      返回这个节点Token的数字
UnaryOp  给数字加上正负
Compound 复合过程
Assign   给变量赋值
Var      取变量值
NoOp     空


part10
添加以 // 为注释的lexer方法
  要注意是 \r\n 和 \n 两种结尾的行
  看 block 逻辑
  eat 会吃掉 ID 然后往后移一位光标

  a, b, c, x : INTEGER;
  ^
  eat(ID)
  a, b, c, x : INTEGER;
   ^
 


