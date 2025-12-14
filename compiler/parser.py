from lexer import TokenType, Token
from ast_nodes import *

class ParseError(Exception):
    def __init__(self, message, token=None):
        super().__init__(message)
        self.message = message
        self.token = token

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def current(self):
        return self.tokens[self.pos]

    def advance(self):
        self.pos += 1
        return self.tokens[self.pos-1]

    def expect(self, type, value=None):
        tok = self.current()
        if tok.type != type or (value is not None and tok.value != value):
            raise ParseError(f"Expected {type}{' '+value if value else ''}", tok)
        return self.advance()

    def parse(self):
        statements = []
        while self.current().type != TokenType.EOF:
            statements.append(self.statement())
        return Program(statements)

    def statement(self):
        tok = self.current()
        if tok.type == TokenType.KEYWORD and tok.value == 'dhori':
            return self.var_decl()
        if tok.type == TokenType.KEYWORD and tok.value == 'dekhao':
            self.advance()
            expr = self.expr()
            self.expect(TokenType.SEMI)
            return PrintStmt(expr)
        if tok.type == TokenType.KEYWORD and tok.value == 'jodi':
            return self.if_stmt()
        if tok.type == TokenType.KEYWORD and tok.value == 'ghuri':
            return self.for_stmt()
        # assignment statement: IDENT = expr;
        if tok.type == TokenType.IDENT:
            name = self.advance().value
            self.expect(TokenType.ASSIGN)
            expr = self.expr()
            self.expect(TokenType.SEMI)
            return AssignStmt(name, expr)
        raise ParseError("Unknown statement", tok)

    def var_decl(self):
        self.expect(TokenType.KEYWORD, 'dhori')
        name = self.expect(TokenType.IDENT).value
        self.expect(TokenType.ASSIGN)
        expr = self.expr()
        self.expect(TokenType.SEMI)
        return VarDecl(name, expr)

    def if_stmt(self):
        self.expect(TokenType.KEYWORD, 'jodi')
        cond = self.expr()
        self.expect(TokenType.LBRACE)
        then_stmts = []
        while self.current().type != TokenType.RBRACE:
            then_stmts.append(self.statement())
        self.expect(TokenType.RBRACE)
        else_branch = None
        if self.current().type == TokenType.KEYWORD and self.current().value in ('nahole', 'nahole-jodi'):
            self.advance()
            self.expect(TokenType.LBRACE)
            else_stmts = []
            while self.current().type != TokenType.RBRACE:
                else_stmts.append(self.statement())
            self.expect(TokenType.RBRACE)
            else_branch = else_stmts
        return IfStmt(cond, then_stmts, else_branch)

    def for_stmt(self):
        self.expect(TokenType.KEYWORD, 'ghuri')
        self.expect(TokenType.LPAREN)
        init = self.var_decl()
        cond = self.expr()
        self.expect(TokenType.SEMI)
        update_name = self.expect(TokenType.IDENT).value
        self.expect(TokenType.ASSIGN)
        update_expr = self.expr()
        self.expect(TokenType.RPAREN)
        self.expect(TokenType.LBRACE)
        body = []
        while self.current().type != TokenType.RBRACE:
            body.append(self.statement())
        self.expect(TokenType.RBRACE)
        return ForStmt(init, cond, (update_name, update_expr), body)

    def expr(self):
        left = self.term()
        while self.current().type in (TokenType.PLUS, TokenType.MINUS, TokenType.GT, TokenType.LT, TokenType.GE, TokenType.LE, TokenType.EQ):
            op = self.advance().type
            right = self.term()
            left = BinOp(left, op, right)
        return left

    def term(self):
        left = self.factor()
        while self.current().type in (TokenType.STAR, TokenType.SLASH):
            op = self.advance().type
            right = self.factor()
            left = BinOp(left, op, right)
        return left

    def factor(self):
        tok = self.current()
        if tok.type == TokenType.NUMBER:
            self.advance()
            return Num(tok.value)
        if tok.type == TokenType.IDENT:
            self.advance()
            return Var(tok.value)
        if tok.type == TokenType.LPAREN:
            self.advance()
            node = self.expr()
            self.expect(TokenType.RPAREN)
            return node
        raise ParseError("Expected expression", tok)
