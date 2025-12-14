"use client";
import React, { useState, useRef, useEffect } from 'react';

const examples: Record<string, string> = {
  "If/Else": `dhori x = 10;\njodi x > 5 {\n  dekhao 1;\n}\nnahole {\n  dekhao 0;\n}`,
  "For Loop": `ghuri (dhori i = 0; i < 5; i = i + 1) {\n  dekhao i;\n}`,
  "Sum": `dhori s = 0;\nghuri (dhori i = 1; i <= 5; i = i + 1) {\n  s = s + i;\n}\ndekhao s;`,
  "Factorial": `dhori n = 5;\ndhori r = 1;\nghuri (dhori i = 1; i <= n; i = i + 1) {\n  r = r * i;\n}\ndekhao r;`
};

export default function ExamplesMenu({ onSelect }: { onSelect: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleSelect = (code: string) => {
    onSelect(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Examples
        <span className="text-slate-400">▾</span>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-44 origin-top-left rounded-md border border-slate-700 bg-slate-900 shadow-lg">
          <ul className="py-1 text-sm text-slate-200">
            {Object.entries(examples).map(([name, code]) => (
              <li key={name}>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-slate-800"
                  onClick={() => handleSelect(code)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
