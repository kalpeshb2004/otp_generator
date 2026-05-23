'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Trash2 } from 'lucide-react';
import { getNumber, cancelNumber } from '../../../lib/api';
import { useNumberSocket } from '../../../hooks/useSocket';
import SMSCard from '../../../components/SMSCard';
import CopyButton from '../../../components/CopyButton';
import LiveBadge from '../../../components/LiveBadge';

export default function NumberPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<{ number: Record<string, unknown>; messages: unknown[] } | null>(null);
  const [newSMS, setNewSMS] = useState<unknown[]>([]);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    getNumber(id).then(setData);
  }, [id]);

  useEffect(() => {
    if (!data?.number?.expiresAt) return;
    const tick = () => {
      const diff = new Date(data.number.expiresAt as string).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}m ${s}s`);
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [data]);

  useNumberSocket(
    id,
    (sms) => setNewSMS(prev => [sms, ...prev]),
    () => setExpired(true)
  );

  const allMessages = [...newSMS, ...(data?.messages || [])];

  const handleCancel = async () => {
    await cancelNumber(id);
    router.push('/');
  };

  if (!data) return (
    <div className="max-w-2xl mx-auto px-4 pt-16 text-center">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-surface-2 rounded w-48 mx-auto" />
        <div className="h-32 bg-surface-1 border border-border rounded-xl" />
      </div>
    </div>
  );

  const num = data.number;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white font-mono text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>

      {/* Number header */}
      <div className="bg-surface-1 border border-border rounded-2xl p-6 mb-6 glow-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs font-mono text-gray-500 mb-1">{num.countryCode as string} · {num.provider as string}</div>
            <div className="text-3xl font-mono font-bold text-white">{num.phone as string}</div>
          </div>
          <LiveBadge active={!expired && num.status === 'active'} />
        </div>

        <div className="flex items-center gap-2 text-sm font-mono text-gray-400 mb-4">
          <Clock size={14} />
          <span>{timeLeft}</span>
        </div>

        <div className="flex gap-3">
          <CopyButton text={num.phone as string} label={`Copy ${num.phone}`} />
          <button onClick={handleCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono text-red-400 border border-red-900/50 hover:bg-red-900/20 transition-colors">
            <Trash2 size={14} /> Cancel
          </button>
        </div>
      </div>

      {/* Messages */}
      <div>
        <h2 className="text-base font-mono font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse2" />
          Messages ({allMessages.length})
        </h2>

        {allMessages.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-xl bg-surface-1">
            <div className="text-gray-600 font-mono text-sm mb-2">Waiting for SMS...</div>
            <div className="text-gray-700 text-xs">Auto-updates every 5 seconds</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(allMessages as Parameters<typeof SMSCard>[0]['sms'][]).map((sms, i) => (
              <SMSCard key={(sms as { _id: string })._id || i} sms={sms} highlight={i === 0 && newSMS.length > 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
