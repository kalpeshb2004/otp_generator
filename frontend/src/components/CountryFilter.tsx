'use client';
import { Globe } from 'lucide-react';

interface Props {
  countries: string[];
  selected: string;
  onChange: (c: string) => void;
}

export default function CountryFilter({ countries, selected, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
      <Globe size={16} className="text-gray-500 shrink-0" />
      {['', ...countries].map((c) => (
        <button
          key={c || 'all'}
          onClick={() => onChange(c)}
          className={`shrink-0 px-3 py-1 rounded-full text-sm font-mono border transition-all ${
            selected === c
              ? 'bg-primary text-black border-primary font-bold'
              : 'bg-surface-2 text-gray-400 border-border hover:border-border-bright hover:text-white'
          }`}
        >
          {c || 'All'}
        </button>
      ))}
    </div>
  );
}
