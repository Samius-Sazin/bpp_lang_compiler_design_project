import { Token, TokenType, Lexer } from './lexer';
import {
  Program,
  Statement,
  VarDecl,
  AssignStmt,
  PrintStmt,
  IfStmt,
  ForStmt,
  Expression,
  BinOp,
  Num,
  Var,
} from './ast_nodes';

export class Parser {
  private tokens: Token[];
  private pos: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private current(): Token {
    return this.pos < this.tokens.length ? this.tokens[this.pos] : this.tokens[this.tokens.length - 1];
  }

  private advance(): void {
    this.pos++;
  }

  private expect(type: TokenType): Token {
    const token = this.current();
    if (token.type !== type) {
      throw new Error(`Expected ${type} but got ${token.type}`);
    }
    this.advance();
    return token;
  }

  parse(): Program {
    const statements: Statement[] = [];
    while (this.current().type !== TokenType.EOF) {
      statements.push(this.statement());
    }
    return new Program(statements);
  }

  private statement(): Statement {
    if (this.current().type === TokenType.KEYWORD) {
      const keyword = this.current().value;
      if (keyword === 'dhori') {
        return this.varDecl();
      }
      if (keyword === 'dekhao') {
        return this.printStmt();
      }
      if (keyword === 'jodi') {
        return this.ifStmt();
      }
      if (keyword === 'ghuri') {
        return this.forStmt();
      }
    }
    if (this.current().type === TokenType.IDENT) {
      return this.assignStmt();
    }
    throw new Error(`Unknown statement: ${this.current()}`);
  }

  private varDecl(): VarDecl {
    this.expect(TokenType.KEYWORD); // dhori
    const name = this.expect(TokenType.IDENT).value;
    this.expect(TokenType.ASSIGN);
    const value = this.expr();
    this.expect(TokenType.SEMI);
    return new VarDecl(name, value);
  }

  private assignStmt(): AssignStmt {
    const name = this.expect(TokenType.IDENT).value;
    this.expect(TokenType.ASSIGN);
    const value = this.expr();
    this.expect(TokenType.SEMI);
    return new AssignStmt(name, value);
  }

  private printStmt(): PrintStmt {
    this.expect(TokenType.KEYWORD); // dekhao
    const value = this.expr();
    this.expect(TokenType.SEMI);
    return new PrintStmt(value);
  }

  private ifStmt(): IfStmt {
    this.expect(TokenType.KEYWORD); // jodi
    const condition = this.expr();
    this.expect(TokenType.LBRACE);
    const thenBlock: Statement[] = [];
    while (this.current().type !== TokenType.RBRACE) {
      thenBlock.push(this.statement());
    }
    this.expect(TokenType.RBRACE);

    let elseBlock: Statement[] | null = null;
    if (this.current().type === TokenType.KEYWORD && this.current().value === 'nahole') {
      this.expect(TokenType.KEYWORD); // nahole
      this.expect(TokenType.LBRACE);
      elseBlock = [];
      while (this.current().type !== TokenType.RBRACE) {
        elseBlock.push(this.statement());
      }
      this.expect(TokenType.RBRACE);
    }

    return new IfStmt(condition, thenBlock, elseBlock);
  }

  private forStmt(): ForStmt {
    this.expect(TokenType.KEYWORD); // ghuri
    this.expect(TokenType.LPAREN);
    const init = this.varDecl(); // This consumes the SEMI
    const condition = this.expr();
    this.expect(TokenType.SEMI);
    // For update: parse assignment without expecting SEMI at the end (we'll consume RPAREN next)
    const updateName = this.expect(TokenType.IDENT).value;
    this.expect(TokenType.ASSIGN);
    const updateValue = this.expr();
    const update = new AssignStmt(updateName, updateValue);
    this.expect(TokenType.RPAREN);
    this.expect(TokenType.LBRACE);
    const body: Statement[] = [];
    while (this.current().type !== TokenType.RBRACE) {
      body.push(this.statement());
    }
    this.expect(TokenType.RBRACE);
    return new ForStmt(init, condition, update, body);
  }

  private expr(): Expression {
    return this.binOp();
  }

  private binOp(minPrec: number = 0): Expression {
    let left = this.unary();

    while (this.isBinOp()) {
      const op = this.current().value;
      const prec = this.precedence(op);
      if (prec < minPrec) break;

      this.advance();
      const right = this.binOp(prec + 1);
      left = new BinOp(left, op, right);
    }

    return left;
  }

  private isBinOp(): boolean {
    const type = this.current().type;
    return (
      type === TokenType.PLUS ||
      type === TokenType.MINUS ||
      type === TokenType.STAR ||
      type === TokenType.SLASH ||
      type === TokenType.GT ||
      type === TokenType.LT ||
      type === TokenType.GE ||
      type === TokenType.LE ||
      type === TokenType.EQ
    );
  }

  private precedence(op: string): number {
    switch (op) {
      case '+':
      case '-':
        return 1;
      case '*':
      case '/':
        return 2;
      case '>':
      case '<':
      case '>=':
      case '<=':
      case '==':
        return 0;
      default:
        return -1;
    }
  }

  private unary(): Expression {
    if (this.current().type === TokenType.MINUS) {
      this.advance();
      return new BinOp(new Num(0), '-', this.unary());
    }
    return this.primary();
  }

  private primary(): Expression {
    if (this.current().type === TokenType.NUMBER) {
      const value = this.current().value;
      this.advance();
      return new Num(value);
    }

    if (this.current().type === TokenType.IDENT) {
      const name = this.current().value;
      this.advance();
      return new Var(name);
    }

    if (this.current().type === TokenType.LPAREN) {
      this.advance();
      const expr = this.expr();
      this.expect(TokenType.RPAREN);
      return expr;
    }

    throw new Error(`Unexpected token: ${this.current()}`);
  }
}
