# b++ Web IDE

A modern, interactive web-based IDE for the **b++** programming language. Write, run, and download b++ programs instantly in your browser.

## Features

✨ **Live Code Editor** - Write b++ code with syntax highlighting and real-time feedback  
▶️ **Instant Execution** - Run your code and see results immediately  
📖 **Built-in Help** - Quick reference guide for language syntax and keywords  
📥 **Download Code** - Save your programs as `.bpp` files  
🎨 **Dark Theme** - Eye-friendly dark UI inspired by VS Code  
📱 **Responsive Design** - Works on desktop and mobile devices  
🔧 **Example Programs** - Pre-built examples to learn the language quickly  

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.7+

### Installation

```bash
cd web
npm install
```
📖 **Help Modal** - Centered modal with language guide and copy example button  
### Development
🔧 **Examples Dropdown** - Header dropdown to load pre-built examples quickly  
📋 **Copy Buttons** - One-click copy in editor header and help modal examples  
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## b++ Language Syntax

│   └── ExamplesMenu.tsx          # Examples dropdown button

| Keyword | Purpose |
|---------|---------|
| `dhori` | Declare and initialize a variable |
| `dekhao` | Print/output a value |
| `jodi` | If statement |
| `nahole` | Else statement |
| `nahole-jodi` | Else-if statement |
| `ghuri` | For loop |

### Operators

- **Arithmetic**: `+`, `-`, `*`, `/`
- **Assignment**: `=`
- **Comparison**: `==`, `>`, `<`, `>=`, `<=`
### Help Modal
- Quick reference for keywords
- Operator list with examples
- Sample programs shown in a centered modal
- Copy example code button
```bpp
dhori x = 10;
 - Visible selection highlight (cyan overlay) for text selection
 - Editor header includes a Copy button
```bpp
dhori age = 20;

### UI Controls Order
- Run → Clear → Download → Help (above the editor)
- Examples dropdown lives in the header (and on mobile inside the controls row)
jodi age >= 18 {
  dekhao 1;
} nahole {
  dekhao 0;
}
```

**For Loop**
```bpp
ghuri (dhori i = 0; i < 5; i = i + 1) {
  dekhao i;
}
```

**Sum Program**
```bpp
dhori s = 0;
ghuri (dhori i = 1; i <= 5; i = i + 1) {
  s = s + i;
}
dekhao s;
```

## Deployment

### Deploy to Vercel

The easiest way to deploy:

1. **Push to GitHub** (optional but recommended)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/bpp-web-ide.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Root Directory: `web`
   - Click "Deploy"

### Environment Variables

No environment variables required for basic functionality.

## Project Structure

```
web/
├── app/
│   ├── api/
│   │   └── run/
│   │       └── route.ts          # API endpoint for code execution
│   ├── page.tsx                  # Main IDE page
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/
│   ├── CodeEditor.tsx            # Code editor component
│   ├── OutputPanel.tsx           # Output display component
│   └── ExamplesMenu.tsx          # Example selector
├── compiler/
│   ├── lexer.py                  # Tokenizer
│   ├── parser.py                 # Parser
│   ├── interpreter.py            # Interpreter/executor
│   ├── ast_nodes.py              # AST definitions
│   ├── main.py                   # Entry point
│   └── __init__.py               # Package init
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind CSS config
└── next.config.js                # Next.js config
```

## How It Works

1. **Frontend** (Next.js/React): User writes code in the editor
2. **API Route** (route.ts): Receives code via POST request
3. **Backend** (Python): 
   - Lexer tokenizes the input
   - Parser builds an AST
   - Interpreter executes the AST
4. **Output**: Results sent back to frontend and displayed

## Features

### Code Editor
- Syntax highlighting (via CodeMirror)
- Real-time code validation
- Font size: 16px for readability
- VS Code dark theme colors

### Output Display
- Compiler phases (PHASE 1, 2, 3) shown
- Execution results highlighted in cyan-to-emerald gradient
- Error messages displayed in red
- Compiler messages in gray

### Help Panel
- Quick reference for keywords
- Operator list with examples
- Sample programs

### Download
- Save code as `.bpp` file
- Filename: `program.bpp`
- Works even if code has errors

## Troubleshooting

### "Python file not found"
- Ensure `compiler/` folder exists with `main.py`
- Check that Node server has Python in PATH

### "Unrecognized extension value"
- Clear `.next` build cache: `rm -r .next`
- Restart dev server: `npm run dev`

### Code not running
- Check syntax using the Help panel
- Ensure all statements end with `;`
- Variables must be declared with `dhori` before use

## Development

### Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Code Editor**: CodeMirror 6
- **Backend**: Python 3 (lexer, parser, interpreter)
- **Hosting**: Vercel

### Build Commands
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run linter
```

## License

This project is part of a Compiler Design course project.

## Support

For issues or questions, refer to the built-in Help panel in the IDE or check the `compiler/` folder for language implementation details.

---

**Made with ❤️ for learning compiler design concepts**
