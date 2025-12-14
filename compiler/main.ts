import { Lexer } from './lexer';
import { Parser } from './parser';
import { Interpreter } from './interpreter';

export function runCode(code: string): string {
  const outLines: string[] = [];

  try {
    outLines.push('[PHASE 1] Lexical Analysis...');
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    outLines.push(`Tokenization successful. ${tokens.length} tokens generated.`);
    outLines.push('');

    outLines.push('[PHASE 2] Syntax Analysis (Parsing)...');
    const parser = new Parser(tokens);
    const ast = parser.parse();
    outLines.push('Parsing successful. AST generated.');
    outLines.push('');

    outLines.push('[PHASE 3] Semantic Analysis & Interpretation...');
    const interpreter = new Interpreter();
    const programOutput = interpreter.interpret(ast);
    outLines.push('');
    outLines.push('Program Output:');
    outLines.push('------------------------------');
    if (programOutput) {
      outLines.push(programOutput);
    }
    outLines.push('------------------------------');
    outLines.push('');
    outLines.push('Execution successful.');
  } catch (error: any) {
    outLines.push(`ERROR: ${error.message}`);
  }

  return outLines.join('\n');
}
