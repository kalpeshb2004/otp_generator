'use client';
import { MessageSquare } from 'lucide-react';
import CopyButton from './CopyButton';

interface SMSCardProps {
  sms: {
    _id: string;
    sender: string;
    text: string;
    otp?: string;
    receivedAt: string;
  };
  highlight?: boolean;
}

export default function SMSCard({ sms, highlight }: SMSCardProps) {
  return (
    <div className={`rounded-xl p-4 border transition-all duration-300 animate-slide ${
      highlight
        ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5'
        : 'bg-surface-1 border-border'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className={highlight ? 'text-primary' : 'text-gray-500'} />
          <span className="text-xs font-mono text-gray-500">{sms.sender}</span>
        </div>
        <span className="text-xs text-gray-600 font-mono">
          {new Date(sms.receivedAt).toLocaleTimeString()}
        </span>
      </div>

      <p className="text-gray-200 text-sm mb-3 leading-relaxed">{sms.text}</p>

      {sms.otp && (
        <div className="flex items-center gap-3 p-2 bg-surface-2 rounded-lg border border-border">
          <div>
            <div className="text-xs text-gray-500 font-mono">OTP CODE</div>
            <div className="text-xl font-mono font-bold text-primary tracking-widest">{sms.otp}</div>
          </div>
          <CopyButton text={sms.otp} label="Copy OTP" />
        </div>
      )}
    </div>
  );
}
