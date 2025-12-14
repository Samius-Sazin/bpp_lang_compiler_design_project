export enum TokenType {
  NUMBER = 'NUMBER',
  IDENT = 'IDENT',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  STAR = 'STAR',
  SLASH = 'SLASH',
  ASSIGN = 'ASSIGN',
  SEMI = 'SEMI',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACE = 'LBRACE',
  RBRACE = 'RBRACE',
  GT = 'GT',
  LT = 'LT',
  GE = 'GE',
  LE = 'LE',
  EQ = 'EQ',
  KEYWORD = 'KEYWORD',
  EOF = 'EOF',
}

const KEYWORDS = new Set(['dhori', 'dekhao', 'jodi', 'nahole', 'nahole-jodi', 'ghuri']);

export class Token {
  constructor(
    public type: TokenType,
    public value: any = null,
    public line: number = 1,
    public col: number = 1
  ) {}

  toString() {
    return `Token(${this.type}, ${this.value})`;
  }
}

export class Lexer {
  private text: string;
  private pos: number = 0;
  private line: number = 1;
  private col: number = 1;

  constructor(text: string) {
    this.text = text;
  }

  private current(): string | null {
    return this.pos < this.text.length ? this.text[this.pos] : null;
  }

  private advance(): void {
    if (this.current() === '\n') {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
    this.pos++;
  }

  private skipWs(): void {
    while (this.current() && /\s/.test(this.current()!)) {
      this.advance();
    }
  }

  private number(): Token {
    const startCol = this.col;
    let s = '';
    while (this.current() && /\d/.test(this.current()!)) {
      s += this.current();
      this.advance();
    }
    return new Token(TokenType.NUMBER, parseInt(s), this.line, startCol);
  }

  private ident(): Token {
    const startCol = this.col;
    let s = '';
    while (this.current() && (/[a-zA-Z0-9]/.test(this.current()!) || this.current() === '-')) {
      s += this.current();
      this.advance();
    }
    if (KEYWORDS.has(s)) {
      return new Token(TokenType.KEYWORD, s, this.line, startCol);
    }
    return new Token(TokenType.IDENT, s, this.line, startCol);
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.current() !== null) {
      const c = this.current()!;
      if (/\s/.test(c)) {
        this.skipWs();
        continue;
      }
      if (/\d/.test(c)) {
        tokens.push(this.number());
        continue;
      }
      if (/[a-zA-Z]/.test(c)) {
        tokens.push(this.ident());
        continue;
      }
      if (c === '+') {
        tokens.push(new Token(TokenType.PLUS, '+', this.line, this.col));
        this.advance();
        continue;
      }
      if (c === '-') {
        tokens.push(new Token(TokenType.MINUS, '-', this.line, this.col));
        this.advance();
        continue;
      }
      if (c === '*') {
        tokens.push(new Token(TokenType.STAR, '*', this.line, this.col));
        this.advance();
        continue;
      }
      if (c === '/') {
        tokens.push(new Token(TokenType.SLASH, '/', this.line, this.col));
        this.advance();
        continue;
      }
      if (c === '=') {
        this.advance();
        if (this.current() === '=') {
          tokens.push(new Token(TokenType.EQ, '==', this.line, this.col - 1));
          this.advance();
        } else {
          tokens.push(new Token(TokenType.ASSIGN, '=', this.line, this.col - 1));
        }
        continue;
      }
      if (c === ';') {
        tokens.push(new Token(TokenType.SEMI, ';', this.line, this.col));
        this.advance();
        continue;
      }
      if (c === '(') {
        tokens.push(new Token(TokenType.LPAREN, '(', this.line, this.col));
        this.advance();
        continue;
      }
      if (c === ')') {
        tokens.push(new Token(TokenType.RPAREN, ')', this.line, this.col));
        this.advance();
        continue;
      }
      if (c === '{') {
        tokens.push(new Token(TokenType.LBRACE, '{', this.line, this.col));
        this.advance();
        continue;
      }
      if (c === '}') {
        tokens.push(new Token(TokenType.RBRACE, '}', this.line, this.col));
        this.advance();
        continue;
      }
      if (c === '>') {
        this.advance();
        if (this.current() === '=') {
          tokens.push(new Token(TokenType.GE, '>=', this.line, this.col - 1));
          this.advance();
        } else {
          tokens.push(new Token(TokenType.GT, '>', this.line, this.col - 1));
        }
        continue;
      }
      if (c === '<') {
        this.advance();
        if (this.current() === '=') {
          tokens.push(new Token(TokenType.LE, '<=', this.line, this.col - 1));
          this.advance();
        } else {
          tokens.push(new Token(TokenType.LT, '<', this.line, this.col - 1));
        }
        continue;
      }
      throw new Error(`Unexpected character: '${c}' at line ${this.line}, col ${this.col}`);
    }
    tokens.push(new Token(TokenType.EOF, null, this.line, this.col));
    return tokens;
  }
}
