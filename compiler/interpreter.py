from ast_nodes import *

class SemanticError(Exception): pass
class RuntimeError(Exception): pass

class Interpreter:
    def __init__(self):
        self.env = {}
        self.output = []

    def eval(self, node):
        if isinstance(node, Num): return node.value
        if isinstance(node, Var):
            if node.name not in self.env: raise RuntimeError(f"Undefined variable '{node.name}'")
            return self.env[node.name]
        if isinstance(node, BinOp):
            a = self.eval(node.left)
            b = self.eval(node.right)
            t = node.op
            if t == 'PLUS': return a + b
            if t == 'MINUS': return a - b
            if t == 'STAR': return a * b
            if t == 'SLASH': return a // b
            if t == 'GT': return 1 if a > b else 0
            if t == 'LT': return 1 if a < b else 0
            if t == 'GE': return 1 if a >= b else 0
            if t == 'LE': return 1 if a <= b else 0
            if t == 'EQ': return 1 if a == b else 0
            raise RuntimeError('Unknown operator')
        raise RuntimeError('Unknown expression')

    def exec(self, node):
        if isinstance(node, VarDecl):
            self.env[node.name] = self.eval(node.expr)
        elif isinstance(node, AssignStmt):
            if node.name not in self.env:
                raise RuntimeError(f"Assign to undeclared variable '{node.name}'")
            self.env[node.name] = self.eval(node.expr)
        elif isinstance(node, PrintStmt):
            self.output.append(str(self.eval(node.expr)))
        elif isinstance(node, IfStmt):
            if self.eval(node.cond):
                for s in node.then_branch: self.exec(s)
            elif node.else_branch:
                for s in node.else_branch: self.exec(s)
        elif isinstance(node, ForStmt):
            self.exec(node.init)
            while self.eval(node.cond):
                for s in node.body: self.exec(s)
                name, expr = node.update
                # for-loop update always assigns, declare if missing
                self.env[name] = self.eval(expr)
        else:
            raise RuntimeError('Unknown statement')

    def interpret(self, program: Program):
        for stmt in program.statements:
            self.exec(stmt)
