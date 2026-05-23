'use client';
import Link from 'next/link';
import { Phone, Clock } from 'lucide-react';
import LiveBadge from './LiveBadge';
import CopyButton from './CopyButton';

interface NumberCardProps {
  number: {
    _id: string;
    phone: string;
    country: string;
    countryCode: string;
    provider: string;
    status: string;
    expiresAt: string;
  };
}

const timeLeft = (exp: string) => {
  const diff = new Date(exp).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${m}m ${s}s`;
};

export default function NumberCard({ number }: NumberCardProps) {
  return (
    <div className="group bg-surface-1 border border-border hover:border-border-bright rounded-xl p-4 transition-all duration-200 hover:bg-surface-2 animate-fade">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Phone size={14} className="text-primary" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-mono">{number.countryCode} · {number.provider}</div>
            <div className="font-mono text-white font-semibold">{number.phone}</div>
          </div>
        </div>
        <LiveBadge active={number.status === 'active'} />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mb-3">
        <Clock size={12} />
        <span>{timeLeft(number.expiresAt)}</span>
      </div>

      <div className="flex items-center gap-2">
        <CopyButton text={number.phone} label={number.phone} />
        <Link
          href={`/number/${number._id}`}
          className="flex-1 text-center px-3 py-1.5 rounded-lg text-sm font-mono border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all duration-200"
        >
          View SMS →
        </Link>
      </div>
    </div>
  );
}
