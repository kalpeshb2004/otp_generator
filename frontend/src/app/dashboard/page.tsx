'use client';
import { useState, useEffect } from 'react';
import { Phone, MessageSquare, Key, Plus, Trash2, Eye, EyeOff, Loader2, CreditCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getHistory, getApiKeys, createApiKey, deleteApiKey, toggleApiKey, buyNumber } from '../../lib/api';
import SMSCard from '../../components/SMSCard';
import CopyButton from '../../components/CopyButton';

type Tab = 'numbers' | 'history' | 'apikeys';

export default function DashboardPage() {
  const { user } = useAuth(true);
  const [tab, setTab] = useState<Tab>('history');
  const [history, setHistory] = useState<unknown[]>([]);
  const [apiKeys, setApiKeys] = useState<unknown[]>([]);
  const [keyLabel, setKeyLabel] = useState('');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyForm, setBuyForm] = useState({ provider: 'sms-activate', service: 'any', country: 'us' });

  useEffect(() => {
    if (tab === 'history') getHistory().then(setHistory);
    if (tab === 'apikeys') getApiKeys().then(setApiKeys);
  }, [tab]);

  const handleCreateKey = async () => {
    if (!keyLabel) return;
    setLoading(true);
    const key = await createApiKey(keyLabel);
    setApiKeys(prev => [key, ...prev]);
    setKeyLabel('');
    setLoading(false);
  };

  const handleDeleteKey = async (id: string) => {
    await deleteApiKey(id);
    setApiKeys(prev => prev.filter((k: unknown) => (k as { _id: string })._id !== id));
  };

  const handleToggleKey = async (id: string) => {
    const updated = await toggleApiKey(id);
    setApiKeys(prev => prev.map((k: unknown) => (k as { _id: string })._id === id ? updated : k));
  };

  const handleBuy = async () => {
    setBuying(true);
    try {
      await buyNumber(buyForm);
      setTab('history');
    } catch (e) {
      alert('Purchase failed. Check credits or provider config.');
    } finally {
      setBuying(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'history', label: 'SMS History', icon: MessageSquare },
    { id: 'numbers', label: 'Buy Number', icon: Phone },
    { id: 'apikeys', label: 'API Keys', icon: Key },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Dashboard</h1>
          <p className="text-gray-500 font-mono text-sm">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-1 border border-border rounded-xl px-4 py-2">
          <CreditCard size={14} className="text-primary" />
          <span className="font-mono text-white font-bold">{user?.credits}</span>
          <span className="text-gray-500 font-mono text-xs">credits</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-1 border border-border rounded-xl p-1 mb-6">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-mono transition-all ${
              tab === t.id ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <t.icon size={14} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* SMS History */}
      {tab === 'history' && (
        <div className="space-y-3">
          {history.length === 0
            ? <div className="text-center py-16 text-gray-600 font-mono">No SMS history yet</div>
            : (history as Parameters<typeof SMSCard>[0]['sms'][]).map((sms) => (
                <SMSCard key={(sms as { _id: string })._id} sms={sms} />
              ))
          }
        </div>
      )}

      {/* Buy Number */}
      {tab === 'numbers' && (
        <div className="bg-surface-1 border border-border rounded-2xl p-6 max-w-md">
          <h2 className="font-mono font-bold text-white mb-4">Buy Temporary Number</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1.5">PROVIDER</label>
              <select
                value={buyForm.provider}
                onChange={e => setBuyForm(p => ({ ...p, provider: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary/50"
              >
                <option value="sms-activate">SMS-Activate</option>
                <option value="5sim">5SIM</option>
                <option value="smspool">SMSPool</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1.5">SERVICE</label>
              <input
                value={buyForm.service}
                onChange={e => setBuyForm(p => ({ ...p, service: e.target.value }))}
                placeholder="any / google / telegram..."
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1.5">COUNTRY</label>
              <input
                value={buyForm.country}
                onChange={e => setBuyForm(p => ({ ...p, country: e.target.value }))}
                placeholder="us / gb / de / ru..."
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50"
              />
            </div>

            <button
              onClick={handleBuy} disabled={buying || !user || user.credits < 1}
              className="w-full bg-primary text-black font-bold font-mono py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {buying ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {buying ? 'Purchasing...' : `Buy Number (1 credit)`}
            </button>

            {user && user.credits < 1 && (
              <p className="text-yellow-500 text-xs font-mono text-center">Insufficient credits. Contact admin.</p>
            )}
          </div>
        </div>
      )}

      {/* API Keys */}
      {tab === 'apikeys' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              value={keyLabel} onChange={e => setKeyLabel(e.target.value)}
              placeholder="Key label..."
              className="flex-1 bg-surface-1 border border-border rounded-xl px-4 py-2.5 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={handleCreateKey} disabled={loading || !keyLabel}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-black font-mono font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Create
            </button>
          </div>

          <div className="space-y-3">
            {(apiKeys as { _id: string; label: string; key: string; active: boolean; usageCount: number }[]).map((k) => (
              <div key={k._id} className="bg-surface-1 border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-semibold text-white">{k.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${k.active ? 'text-primary border-primary/30 bg-primary/10' : 'text-gray-500 border-gray-700'}`}>
                      {k.active ? 'Active' : 'Disabled'}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">{k.usageCount} calls</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono text-gray-400 bg-surface-2 rounded-lg px-3 py-2 overflow-hidden">
                    {showKeys[k._id] ? k.key : `${k.key.slice(0, 12)}${'•'.repeat(20)}`}
                  </code>
                  <button onClick={() => setShowKeys(p => ({ ...p, [k._id]: !p[k._id] }))} className="text-gray-500 hover:text-white transition-colors">
                    {showKeys[k._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <CopyButton text={k.key} />
                  <button onClick={() => handleToggleKey(k._id)} className="text-gray-500 hover:text-yellow-400 transition-colors text-xs font-mono">
                    {k.active ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => handleDeleteKey(k._id)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {apiKeys.length === 0 && (
              <div className="text-center py-12 text-gray-600 font-mono text-sm">No API keys yet</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
