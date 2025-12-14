"use client";
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';

export default function CodeEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-700">
      <CodeMirror
        value={value}
        height="540px"
        theme="dark"
        extensions={[cpp()]}
        onChange={onChange}
        className="text-lg"
      />
    </div>
  );
}
