"use client";
import React from 'react';

export default function OutputPanel({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  let programOutput: string[] = [];
  let messages: string[] = [];

  // Robust parser: capture lines between "Program Output:" and the next dashed separator
  const startIdx = lines.findIndex(l => l.trim().toLowerCase() === 'program output:' || l.trim().toLowerCase().startsWith('program output'));
  if (startIdx >= 0) {
    const sepIdx = lines.findIndex((l, i) => i > startIdx && l.trim().replace(/\s+/g, '') === '------------------------------');
    const endSepIdx = sepIdx >= 0 ? sepIdx : -1;
    if (endSepIdx > startIdx) {
      const raw = lines.slice(startIdx + 1, endSepIdx);
      programOutput = raw.filter(l => l.trim().length > 0);
      messages = [...lines.slice(0, startIdx), ...lines.slice(endSepIdx + 1)];
    } else {
      messages = lines;
    }
  } else {
    messages = lines;
  }

  // Build message blocks, preserving order, but highlight the [PHASE 3] ... dashed section
  type Block = { type: 'highlight' | 'normal' | 'error'; lines: string[] };
  const blocks: Block[] = [];
  const sepMatcher = (l: string) => l.trim().replace(/\s+/g, '') === '------------------------------';
  let i = 0;
  while (i < messages.length) {
    const line = messages[i];
    if (line.toLowerCase().includes('[phase 3]')) {
      // collect until separator (inclusive) or end
      let j = i + 1;
      while (j < messages.length && !sepMatcher(messages[j])) {
        j++;
      }
      if (j < messages.length && sepMatcher(messages[j])) j++;
      blocks.push({ type: 'highlight', lines: messages.slice(i, j) });
      i = j;
    } else {
      // collect consecutive normal lines until next phase3 or end
      let j = i + 1;
      while (j < messages.length && !messages[j].toLowerCase().includes('[phase 3]')) {
        j++;
      }
      const slice = messages.slice(i, j);
      const hasError = slice.some(l => /error/i.test(l));
      blocks.push({ type: hasError ? 'error' : 'normal', lines: slice });
      i = j;
    }
  }

  return (
    <div className="space-y-3">
      {programOutput.length > 0 && (
        <div className="rounded-lg border border-emerald-600 bg-emerald-950/40 p-3">
          <div className="text-emerald-400 font-semibold mb-2">Program Output</div>
          <div className="space-y-2">
            {programOutput.map((line, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 px-3 py-2 rounded font-bold text-lg"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 space-y-3">
        <div className="text-slate-400 font-semibold mb-2">Compiler Messages</div>
        {blocks.map((block, idx) => (
          <pre
            key={idx}
            className={block.type === 'highlight'
              ? 'rounded border border-cyan-600 bg-cyan-950/40 text-slate-100 text-sm leading-6 px-2 py-2'
              : block.type === 'error'
              ? 'rounded border border-red-700 bg-red-950/40 text-red-200 text-sm leading-6 px-2 py-2'
              : 'text-slate-300 text-sm leading-6'}
          >
            {block.lines.join('\n')}
          </pre>
        ))}
      </div>
    </div>
  );
}
