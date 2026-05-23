'use client';
import { useState, useEffect } from 'react';
import { Zap, Shield, Globe, RefreshCw } from 'lucide-react';
import NumberCard from '../components/NumberCard';
import CountryFilter from '../components/CountryFilter';
import SMSCard from '../components/SMSCard';
import { useNumbers } from '../hooks/useNumbers';
import { useSocket } from '../hooks/useSocket';
import { getRecentSMS } from '../lib/api';

export default function HomePage() {
  const [country, setCountry] = useState('');
  const { numbers, countries, loading, total, page, setPage, refetch } = useNumbers(country);
  const [recentSMS, setRecentSMS] = useState<unknown[]>([]);

  useEffect(() => { getRecentSMS().then(setRecentSMS); }, []);

  useSocket('sms:global', (sms) => {
    setRecentSMS(prev => [sms, ...prev].slice(0, 5));
  });

  const features = [
    { icon: Zap, title: 'Instant SMS', desc: 'Receive OTP codes in seconds via real provider APIs' },
    { icon: Shield, title: 'Anonymous', desc: 'No registration needed for public numbers' },
    { icon: Globe, title: 'Worldwide', desc: '20+ countries, multiple providers' },
    { icon: RefreshCw, title: 'Real-time', desc: 'WebSocket live updates, no refresh needed' },
  ];

  return (
    <div className="grid-bg min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse2" />
          <span className="text-primary text-xs font-mono font-medium">Live · {total} numbers active</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Receive SMS <span className="text-primary glow">Online</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Temporary phone numbers for OTP verification. Instant, anonymous, real-time.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {features.map(f => (
            <div key={f.title} className="bg-surface-1 border border-border rounded-xl p-4 text-left">
              <f.icon size={18} className="text-primary mb-2" />
              <div className="text-sm font-semibold text-white mb-1">{f.title}</div>
              <div className="text-xs text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-16 grid lg:grid-cols-3 gap-8">
        {/* Numbers */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-mono font-bold text-white">Available Numbers</h2>
            <button onClick={refetch} className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-white transition-colors">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          <CountryFilter countries={countries} selected={country} onChange={(c) => { setCountry(c); setPage(1); }} />

          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 bg-surface-1 border border-border rounded-xl animate-pulse" />
                ))
              : numbers.length === 0
              ? <div className="col-span-2 text-center py-16 text-gray-600 font-mono">No active numbers</div>
              : (numbers as { _id: string }[]).map((n) => <NumberCard key={n._id} number={n as Parameters<typeof NumberCard>[0]['number']} />)
            }
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(total / 20) }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded font-mono text-sm transition-colors ${
                    page === i + 1 ? 'bg-primary text-black font-bold' : 'bg-surface-2 text-gray-400 hover:bg-surface-3'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live feed */}
        <div>
          <h2 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse2" />
            Live Feed
          </h2>
          <div className="flex flex-col gap-3">
            {recentSMS.length === 0
              ? <div className="text-center py-12 text-gray-600 font-mono text-sm">Waiting for messages...</div>
              : (recentSMS as Parameters<typeof SMSCard>[0]['sms'][]).map((s, i) => (
                  <SMSCard key={(s as { _id: string })._id || i} sms={s} highlight={i === 0} />
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
