export abstract class ASTNode {}

export class Program extends ASTNode {
  constructor(public statements: Statement[]) {
    super();
  }
}

export abstract class Statement extends ASTNode {}

export class VarDecl extends Statement {
  constructor(public name: string, public value: Expression) {
    super();
  }
}

export class AssignStmt extends Statement {
  constructor(public name: string, public value: Expression) {
    super();
  }
}

export class PrintStmt extends Statement {
  constructor(public value: Expression) {
    super();
  }
}

export class IfStmt extends Statement {
  constructor(
    public condition: Expression,
    public thenBlock: Statement[],
    public elseBlock: Statement[] | null = null
  ) {
    super();
  }
}

export class ForStmt extends Statement {
  constructor(
    public init: Statement,
    public condition: Expression,
    public update: Statement,
    public body: Statement[]
  ) {
    super();
  }
}

export abstract class Expression extends ASTNode {}

export class BinOp extends Expression {
  constructor(public left: Expression, public op: string, public right: Expression) {
    super();
  }
}

export class UnaryOp extends Expression {
  constructor(public op: string, public operand: Expression) {
    super();
  }
}

export class Num extends Expression {
  constructor(public value: number) {
    super();
  }
}

export class Var extends Expression {
  constructor(public name: string) {
    super();
  }
}
