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

export class Interpreter {
  private env: Map<string, number> = new Map();
  output: string[] = [];

  interpret(program: Program): string {
    try {
      for (const stmt of program.statements) {
        this.execStatement(stmt);
      }
      return this.output.join('\n');
    } catch (e: any) {
      throw new Error(`Runtime error: ${e.message}`);
    }
  }

  private execStatement(stmt: Statement): void {
    if (stmt instanceof VarDecl) {
      const value = this.evalExpression(stmt.value);
      this.env.set(stmt.name, value);
    } else if (stmt instanceof AssignStmt) {
      const value = this.evalExpression(stmt.value);
      this.env.set(stmt.name, value);
    } else if (stmt instanceof PrintStmt) {
      const value = this.evalExpression(stmt.value);
      this.output.push(String(value));
    } else if (stmt instanceof IfStmt) {
      const condition = this.evalExpression(stmt.condition);
      if (condition) {
        for (const s of stmt.thenBlock) {
          this.execStatement(s);
        }
      } else if (stmt.elseBlock) {
        for (const s of stmt.elseBlock) {
          this.execStatement(s);
        }
      }
    } else if (stmt instanceof ForStmt) {
      this.execStatement(stmt.init);
      while (this.evalExpression(stmt.condition)) {
        for (const s of stmt.body) {
          this.execStatement(s);
        }
        this.execStatement(stmt.update);
      }
    }
  }

  private evalExpression(expr: Expression): number {
    if (expr instanceof Num) {
      return expr.value;
    } else if (expr instanceof Var) {
      const val = this.env.get(expr.name);
      if (val === undefined) {
        throw new Error(`Undefined variable: ${expr.name}`);
      }
      return val;
    } else if (expr instanceof BinOp) {
      const left = this.evalExpression(expr.left);
      const right = this.evalExpression(expr.right);
      switch (expr.op) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          if (right === 0) throw new Error('Division by zero');
          return Math.floor(left / right);
        case '>':
          return left > right ? 1 : 0;
        case '<':
          return left < right ? 1 : 0;
        case '>=':
          return left >= right ? 1 : 0;
        case '<=':
          return left <= right ? 1 : 0;
        case '==':
          return left === right ? 1 : 0;
        default:
          throw new Error(`Unknown operator: ${expr.op}`);
      }
    }
    throw new Error('Unknown expression type');
  }
}
