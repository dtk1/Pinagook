'use client';

import React from 'react';

interface FormattedContentRendererProps {
  content: string;
  className?: string;
}

export default function FormattedContentRenderer({ content, className = '' }: FormattedContentRendererProps) {
  if (!content) return null;

  const renderInlineFormatting = (text: string) => {
    // Process bold (**text**), italic (*text*), and code (`text`)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-700">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-slate-100 text-[#0EA5B7] px-1.5 py-0.5 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const parseCells = (rowStr: string) => {
    return rowStr
      .split('|')
      .map(c => c.trim())
      .filter((c, idx, arr) => idx !== 0 && idx !== arr.length - 1);
  };

  const renderTable = (rows: string[], keyPrefix: string) => {
    const cleanRows = rows.filter(r => !r.includes(':---') && !r.includes('---'));
    if (cleanRows.length === 0) return null;

    const headers = parseCells(cleanRows[0]);
    const bodyRows = cleanRows.slice(1);

    return (
      <div key={`${keyPrefix}-table`} className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200">
              {headers.map((h, hIdx) => (
                <th key={hIdx} className="px-4 py-3 font-semibold text-slate-800 border-r border-slate-200/60 last:border-r-0">
                  {renderInlineFormatting(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {bodyRows.map((bRow, rIdx) => {
              const cells = parseCells(bRow);
              return (
                <tr key={rIdx} className="hover:bg-[#0EA5B7]/5 transition-colors even:bg-slate-50/40">
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 text-slate-700 border-r border-slate-100 last:border-r-0">
                      {renderInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Group lines into blocks (tables vs individual lines)
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let tableAccumulator: string[] = [];

  const flushAccumulator = (idx: number) => {
    if (tableAccumulator.length > 0) {
      const tableEl = renderTable(tableAccumulator, `tbl-${idx}`);
      if (tableEl) elements.push(tableEl);
      tableAccumulator = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      tableAccumulator.push(trimmed);
      continue;
    }

    flushAccumulator(i);

    if (!trimmed) {
      elements.push(<div key={`spacer-${i}`} className="h-2" />);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mt-4 mb-3">
          {renderInlineFormatting(trimmed.replace('### ', ''))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-lg font-semibold text-[#0EA5B7] mt-4 mb-2 flex items-center gap-2">
          <span>📌</span> {renderInlineFormatting(trimmed.replace('#### ', ''))}
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith('> ')) {
      elements.push(
        <div key={`quote-${i}`} className="bg-[#F0FDF4] border-l-4 border-[#10B981] p-3 rounded-r-xl text-emerald-900 my-3 font-medium text-sm">
          {renderInlineFormatting(trimmed.replace('> ', ''))}
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 text-slate-700 my-1 text-sm pl-2">
          <span className="text-[#0EA5B7] font-bold mt-0.5">•</span>
          <span>{renderInlineFormatting(trimmed.replace(/^[-*]\s+/, ''))}</span>
        </div>
      );
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="text-slate-700 leading-relaxed text-sm my-1.5">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  }

  flushAccumulator(lines.length);

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}
