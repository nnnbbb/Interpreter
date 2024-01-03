# **算术表达式的BNF构建**
<br>

- ## **expr(表达式)**
<br>

>一个（不是因子也不是项）的表达式可能被任何一个运算符分开。

expr => expr + term | expr - term | term

因此最终得到的BNF范式是：

 factor => digit 
 
 term => term  x factor | term / factor| factor

 expr => expr + term | expr - term | term

