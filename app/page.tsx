"use client";
"use client";
import React, { useState } from 'react';
import './globals.css';
import CodeEditor from '@/components/CodeEditor';
import OutputPanel from '@/components/OutputPanel';
import ExamplesMenu from '@/components/ExamplesMenu';

export default function Page() {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showInstructions, setShowInstructions] = useState(false);
    const [copiedEditor, setCopiedEditor] = useState(false);
    const [copiedExample, setCopiedExample] = useState(false);

    const runCode = async () => {
        setLoading(true);
        setOutput('');
        setError(null);
        try {
            const res = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await res.json();
            if (data.error) {
                setError(String(data.error));
            } else {
                setOutput(String(data.output || ''));
            }
        } catch (e: any) {
            setError('Network error: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadCode = () => {
        if (!code.trim()) {
            setError('Code is empty. Write some code before downloading.');
            return;
        }
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'program.bpp';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setCode('');
        setOutput('');
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200">
            <header className="border-b border-slate-800 bg-slate-950/60">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            b++ Web IDE
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Write b++ code and run it instantly.</p>
                    </div>
                    <div className="md:flex items-center gap-3">
                        <div className="hidden md:block">
                            <ExamplesMenu onSelect={setCode} />
                        </div>
                    </div>
                </div>
            </header>

            {error && (
                <div className="max-w-6xl mx-auto px-6 mt-4">
                    <div className="rounded-md border border-red-700 bg-red-950/40 text-red-300 px-4 py-2">
                        {error}
                    </div>
                </div>
            )}

            {showInstructions && (
                <div className="fixed inset-0 z-30 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setShowInstructions(false)}></div>
                    <div className="relative w-full max-w-2xl mx-auto rounded-lg border border-cyan-700 bg-slate-900 p-4 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-cyan-300 font-semibold text-lg">b++ Language Guide</h2>
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm">
                            <div>
                                <h3 className="text-cyan-300 font-semibold mb-2">Keywords</h3>
                                <ul className="space-y-1 font-mono text-xs">
                                    <li><span className="text-emerald-400">dhori</span> - Declare & initialize variable</li>
                                    <li><span className="text-emerald-400">dekhao</span> - Print output</li>
                                    <li><span className="text-emerald-400">jodi</span> - If statement</li>
                                    <li><span className="text-emerald-400">nahole</span> - Else statement</li>
                                    <li><span className="text-emerald-400">nahole-jodi</span> - Else if</li>
                                    <li><span className="text-emerald-400">ghuri</span> - For loop</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-cyan-300 font-semibold mb-2">Operators</h3>
                                <ul className="space-y-1 font-mono text-xs">
                                    <li><span className="text-blue-300">+ - * /</span> Arithmetic</li>
                                    <li><span className="text-blue-300">=</span> Assignment</li>
                                    <li><span className="text-blue-300">== &gt; &lt; &gt;= &lt;=</span> Comparison</li>
                                </ul>
                            </div>
                            <div className="md:col-span-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-cyan-300 font-semibold">Examples</h3>
                                    <button
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(`dhori x = 10;\ndekhao x;\n\njodi x > 5 {\n  dekhao 1;\n} nahole {\n  dekhao 0;\n}\n\nghuri (dhori i = 0; i < 5; i = i + 1) {\n  dekhao i;\n}`);
                                            setCopiedExample(true);
                                            setTimeout(() => setCopiedExample(false), 2000);
                                        }}
                                        className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 flex items-center gap-1"
                                        title="Copy example code"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M6 4a2 2 0 012-2h5a2 2 0 012 2v9a2 2 0 01-2 2H8a2 2 0 01-2-2V4zm-2 3h1v8a3 3 0 003 3h6v1H8a4 4 0 01-4-4V7z" />
                                        </svg>
                                        {copiedExample ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <pre className="bg-slate-950/50 p-2 rounded border border-slate-700 text-xs overflow-x-auto">
                                    {`dhori x = 10;
dekhao x;

jodi x > 5 {
  dekhao 1;
} nahole {
  dekhao 0;
}

ghuri (dhori i = 0; i < 5; i = i + 1) {
  dekhao i;
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Run */}
                        <button
                            onClick={runCode}
                            disabled={loading}
                            className="px-4 py-2 rounded-md bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-semibold shadow hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 flex items-center gap-2"
                            title="Run"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M6 4l10 6-10 6V4z" />
                            </svg>
                            {loading ? 'Running…' : 'Run'}
                        </button>
                        {/* Clear */}
                        <button
                            onClick={clearAll}
                            className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 flex items-center gap-2"
                            title="Clear editor and output"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400">
                                <path d="M6 7h8v2H6V7zm0 4h8v2H6v-2zM4 4h12v12H4V4z" />
                            </svg>
                            Clear
                        </button>
                        {/* Download */}
                        <button
                            onClick={downloadCode}
                            className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 flex items-center gap-2"
                            title="Download code as .bpp file"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-400">
                                <path d="M3 14a2 2 0 002 2h10a2 2 0 002-2v-1h-2v1H5v-1H3v1zm7-10a1 1 0 00-1 1v6.586l-2.293-2.293-1.414 1.414L10 15l3.707-3.707-1.414-1.414L11 11.586V5a1 1 0 00-1-1z" />
                            </svg>
                            Download
                        </button>
                        {/* Help */}
                        <button
                            onClick={() => setShowInstructions(true)}
                            className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 flex items-center gap-2"
                            title="Help"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-cyan-400">
                                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-9 3h2v2H9v-2zm1-8a3 3 0 00-3 3h2a1 1 0 112-1 1 1 0 00-1-1z" />
                            </svg>
                            Help
                        </button>
                    </div>
                    {/* Move Examples below controls on small screens */}
                    <div className="md:hidden">
                        <ExamplesMenu onSelect={setCode} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-slate-300 font-semibold">Editor</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(code);
                                        setCopiedEditor(true);
                                        setTimeout(() => setCopiedEditor(false), 2000);
                                    }}
                                    className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 flex items-center gap-1"
                                    title="Copy editor code"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                        <path d="M6 4a2 2 0 012-2h5a2 2 0 012 2v9a2 2 0 01-2 2H8a2 2 0 01-2-2V4zm-2 3h1v8a3 3 0 003 3h6v1H8a4 4 0 01-4-4V7z" />
                                    </svg>
                                    {copiedEditor ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>
                        <div className="p-3">
                            <CodeEditor value={code} onChange={setCode} />
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-slate-300 font-semibold">Output</h2>
                            <span className="text-xs text-slate-500">compiler</span>
                        </div>
                        <div className="p-3">
                            <OutputPanel text={output} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
