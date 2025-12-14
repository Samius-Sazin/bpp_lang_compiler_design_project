class TokenType:
    NUMBER = 'NUMBER'
    IDENT = 'IDENT'
    PLUS = 'PLUS'
    MINUS = 'MINUS'
    STAR = 'STAR'
    SLASH = 'SLASH'
    ASSIGN = 'ASSIGN'
    SEMI = 'SEMI'
    LPAREN = 'LPAREN'
    RPAREN = 'RPAREN'
    LBRACE = 'LBRACE'
    RBRACE = 'RBRACE'
    GT = 'GT'
    LT = 'LT'
    GE = 'GE'
    LE = 'LE'
    EQ = 'EQ'
    KEYWORD = 'KEYWORD'
    EOF = 'EOF'

KEYWORDS = {
    'dhori', 'dekhao', 'jodi', 'nahole', 'nahole-jodi', 'ghuri'
}

class Token:
    def __init__(self, type, value=None, line=1, col=1):
        self.type = type
        self.value = value
        self.line = line
        self.col = col
    def __repr__(self):
        return f"Token({self.type}, {self.value})"

class Lexer:
    def __init__(self, text: str):
        self.text = text
        self.pos = 0
        self.line = 1
        self.col = 1

    def current(self):
        return self.text[self.pos] if self.pos < len(self.text) else None

    def advance(self):
        if self.current() == '\n':
            self.line += 1
            self.col = 1
        else:
            self.col += 1
        self.pos += 1

    def skip_ws(self):
        while self.current() and self.current().isspace():
            self.advance()

    def number(self):
        start_col = self.col
        s = ''
        while self.current() and self.current().isdigit():
            s += self.current(); self.advance()
        return Token(TokenType.NUMBER, int(s), self.line, start_col)

    def ident(self):
        start_col = self.col
        s = ''
        while self.current() and (self.current().isalnum() or self.current() == '-'):
            s += self.current(); self.advance()
        if s in KEYWORDS:
            return Token(TokenType.KEYWORD, s, self.line, start_col)
        return Token(TokenType.IDENT, s, self.line, start_col)

    def tokenize(self):
        tokens = []
        while self.current() is not None:
            c = self.current()
            if c.isspace():
                self.skip_ws(); continue
            if c.isdigit():
                tokens.append(self.number()); continue
            if c.isalpha():
                tokens.append(self.ident()); continue
            if c == '+': tokens.append(Token(TokenType.PLUS, '+', self.line, self.col)); self.advance(); continue
            if c == '-': tokens.append(Token(TokenType.MINUS, '-', self.line, self.col)); self.advance(); continue
            if c == '*': tokens.append(Token(TokenType.STAR, '*', self.line, self.col)); self.advance(); continue
            if c == '/': tokens.append(Token(TokenType.SLASH, '/', self.line, self.col)); self.advance(); continue
            if c == '=':
                self.advance()
                if self.current() == '=':
                    tokens.append(Token(TokenType.EQ, '==', self.line, self.col-1)); self.advance()
                else:
                    tokens.append(Token(TokenType.ASSIGN, '=', self.line, self.col-1))
                continue
            if c == ';': tokens.append(Token(TokenType.SEMI, ';', self.line, self.col)); self.advance(); continue
            if c == '(': tokens.append(Token(TokenType.LPAREN, '(', self.line, self.col)); self.advance(); continue
            if c == ')': tokens.append(Token(TokenType.RPAREN, ')', self.line, self.col)); self.advance(); continue
            if c == '{': tokens.append(Token(TokenType.LBRACE, '{', self.line, self.col)); self.advance(); continue
            if c == '}': tokens.append(Token(TokenType.RBRACE, '}', self.line, self.col)); self.advance(); continue
            if c == '>':
                self.advance()
                if self.current() == '=':
                    tokens.append(Token(TokenType.GE, '>=', self.line, self.col-1)); self.advance()
                else:
                    tokens.append(Token(TokenType.GT, '>', self.line, self.col-1))
                continue
            if c == '<':
                self.advance()
                if self.current() == '=':
                    tokens.append(Token(TokenType.LE, '<=', self.line, self.col-1)); self.advance()
                else:
                    tokens.append(Token(TokenType.LT, '<', self.line, self.col-1))
                continue
            raise ValueError(f"Unexpected character {c!r} at {self.line}:{self.col}")
        tokens.append(Token(TokenType.EOF, None, self.line, self.col))
        return tokens
