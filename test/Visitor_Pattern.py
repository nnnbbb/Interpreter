# Visitor Pattern with Python Code
from abc import abstractmethod, ABCMeta
# 定义一个表示元素（Element）的接口


class ComputerPart(metaclass=ABCMeta):
    @abstractmethod
    def accept(self, inComputerPartVisitor):
        pass
# 创建阔爱站了ComputerPart的实体类


class Keyboard(ComputerPart):
    def accept(self, inComputerPartVisitor):
        inComputerPartVisitor.visitKeyboard(self)


class Monitor(ComputerPart):
    def accept(self, inComputerPartVisitor):
        inComputerPartVisitor.visitMonitor(self)


class Mouse(ComputerPart):
    def accept(self, inComputerPartVisitor):
        inComputerPartVisitor.visitMouse(self)


class Computer(ComputerPart):
    _parts = []

    def __init__(self):
        self._parts.append(Mouse())
        self._parts.append(Keyboard())
        self._parts.append(Monitor())

    def accept(self, inComputerPartVisitor):
        for aPart in self._parts:
            aPart.accept(inComputerPartVisitor)
        inComputerPartVisitor.visitComputer(self)
# 定义一个表示访问者的接口


class ComputerPartVisitor(metaclass=ABCMeta):
    @abstractmethod
    def visitComputer(self, inComputer):
        pass

    @abstractmethod
    def visitMouse(self, inMouse):
        pass

    @abstractmethod
    def visitKeyboard(self, inKeyboard):
        pass

    @abstractmethod
    def visitMonitor(self, inMonitor):
        pass
# 实现访问者接口的实体类


# 在 ComputerPartDisplayVisitor 定义方法 visitComputer
# 将 ComputerPartDisplayVisitor 实例传递给 Computer 
# 让 Computer 调用 ComputerPartDisplayVisitor 里的 visitComputer
class ComputerPartDisplayVisitor(ComputerPartVisitor):
    def visitComputer(self, inComputer):
        print("Displaying {0}. Called in {1}".format(
            inComputer.__class__.__name__, self.__class__.__name__))

    def visitMouse(self, inMouse):
        print("Displaying {0}. Called in {1}".format(
            inMouse.__class__.__name__, self.__class__.__name__))

    def visitKeyboard(self, inKeyboard):
        print("Displaying {0}. Called in {1}".format(
            inKeyboard.__class__.__name__, self.__class__.__name__))

    def visitMonitor(self, inMonitor):
        print("Displaying {0}. Called in {1}".format(
            inMonitor.__class__.__name__, self.__class__.__name__))


# 调用输出
if __name__ == '__main__':
    aComputer = Computer()
    aComputer.accept(ComputerPartDisplayVisitor())
