'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-all duration-200 ${
        copied
          ? 'bg-primary/20 text-primary border border-primary/50'
          : 'bg-surface-2 hover:bg-surface-3 text-gray-300 hover:text-white border border-border hover:border-border-bright'
      }`}
    >
      {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}
