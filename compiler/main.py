import sys
from pathlib import Path

# Ensure local directory is on sys.path so relative imports work
THIS_DIR = Path(__file__).parent
if str(THIS_DIR) not in sys.path:
    sys.path.insert(0, str(THIS_DIR))

# Local module imports
from lexer import Lexer
from parser import Parser, ParseError
from interpreter import Interpreter, SemanticError, RuntimeError as BppRuntimeError


def run_code(code: str) -> str:
    out_lines = []
    try:
        out_lines.append("[PHASE 1] Lexical Analysis...")
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        out_lines.append(f"Tokenization successful. {len(tokens)} tokens generated.")
        out_lines.append("")

        out_lines.append("[PHASE 2] Syntax Analysis (Parsing)...")
        parser = Parser(tokens)
        ast = parser.parse()
        out_lines.append("Parsing successful. AST generated.")
        out_lines.append("")

        out_lines.append("[PHASE 3] Semantic Analysis & Interpretation...")
        interpreter = Interpreter()
        interpreter.interpret(ast)
        out_lines.append("")
        out_lines.append("Program Output:")
        out_lines.append("------------------------------")
        for line in interpreter.output:
            out_lines.append(str(line))
        out_lines.append("------------------------------")
        out_lines.append("")
        out_lines.append("Execution successful.")
    except ParseError as e:
        out_lines.append(f"PARSE ERROR: {e.message}")
    except SemanticError as e:
        out_lines.append(f"SEMANTIC ERROR: {e}")
    except BppRuntimeError as e:
        out_lines.append(f"RUNTIME ERROR: {e}")
    except Exception as e:
        out_lines.append(f"ERROR: {e}")
    return "\n".join(out_lines)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("No input file provided.")
        sys.exit(1)
    file_path = sys.argv[1]
    code = Path(file_path).read_text(encoding='utf-8')
    print(run_code(code))
