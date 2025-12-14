# b++ Web IDE

A modern, browser-based IDE for the **b++** toy language. Write, run, and download b++ programs instantly—now powered fully by a TypeScript compiler (no Python dependency). Deploys cleanly to Vercel using the default Node.js runtime.

## Features
- Live code editor with syntax highlighting (CodeMirror 6)
- One-click Run, Clear, Download, and Help (modal)
- Examples dropdown in the header
- Copy buttons (editor header + help modal) with “Copied” feedback
- Distinct output styling (PHASE blocks, errors in red, selection visible)
- Dark, responsive UI with custom favicon and page metadata

## Quick Start (Local)
- Prerequisites: Node.js 16+ and npm
- Install: `npm install`
- Dev server: `npm run dev` → open http://localhost:3000
- Production build: `npm run build` then `npm start`

## Deployment (Vercel)
- No `vercel.json` needed; use default settings
- Build command: leave empty (defaults to `npm run build`)
- Output: default Next.js
- Runtime: Vercel’s Node.js (Python not required)

## b++ Language Reference
Keywords: `dhori` (declare), `dekhao` (print), `jodi` (if), `nahole` (else), `ghuri` (for). 
Operators: arithmetic `+ - * /`, assignment `=`, comparisons `== > < >= <=`.
Statements end with `;`. Blocks use `{ ... }`. For loops: `ghuri (init; condition; update) { ... }`.

Examples (available in the UI):
- If/Else, For Loop, Sum, Factorial

## Project Structure
```
app/
  api/run/route.ts       # API endpoint calling TS compiler
  page.tsx               # Main IDE
  layout.tsx             # Metadata + favicon
  globals.css            # Global + CodeMirror styling
components/
  OutputPanel.tsx
  ExamplesMenu.tsx
compiler/
  lexer.ts
  parser.ts
  ast_nodes.ts
  interpreter.ts
  main.ts                # runCode pipeline (PHASE 1-3)
public/
  icon.svg
next.config.js           # Webpack alias for @/compiler
package.json

```

## How It Works (Pipeline)
1) POST /api/run with code
2) Lexer → Parser → Interpreter (TypeScript) via `runCode()`
3) Output string includes PHASE 1/2/3 and Program Output block
4) Frontend displays styled output; errors in red

## UI Details
- Controls order: Run → Clear → Download → Help
- Examples dropdown in header
- Help shown as centered modal with copy button
- Selection highlight visible (cyan overlay) in editor/output
- Output: PHASE 3 block cyan; errors red

## Troubleshooting
- “Invalid request: runtime” → ensure `vercel.json` is removed and no custom build command on Vercel
- “Unexpected token '<'” → API returned HTML; confirm /api/run succeeds locally and Vercel build uses Node runtime
- For loop parse errors fixed (ensure code uses `ghuri (dhori i = 0; i < 5; i = i + 1) { ... }`)

## License
Course project for Compiler Design.
- Examples dropdown lives in the header (and on mobile inside the controls row)
