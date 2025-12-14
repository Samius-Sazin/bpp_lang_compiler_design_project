class Program:
    def __init__(self, statements): self.statements = statements
class VarDecl:
    def __init__(self, name, expr): self.name, self.expr = name, expr
class AssignStmt:
    def __init__(self, name, expr): self.name, self.expr = name, expr
class PrintStmt:
    def __init__(self, expr): self.expr = expr
class IfStmt:
    def __init__(self, cond, then_branch, else_branch=None):
        self.cond, self.then_branch, self.else_branch = cond, then_branch, else_branch
class ForStmt:
    def __init__(self, init, cond, update, body): self.init, self.cond, self.update, self.body = init, cond, update, body
class BinOp:
    def __init__(self, left, op, right): self.left, self.op, self.right = left, op, right
class Num:
    def __init__(self, value): self.value = value
class Var:
    def __init__(self, name): self.name = name
