'use client';
import { useState, useEffect } from 'react';
import { Users, Phone, MessageSquare, Shield, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getAdminStats, getAdminUsers, getAdminNumbers, updateCredits, updateRole } from '../../lib/api';

type Tab = 'stats' | 'users' | 'numbers';

export default function AdminPage() {
  const { user, isAdmin } = useAuth(true);
  const [tab, setTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<{ users: number; numbers: number; sms: number } | null>(null);
  const [users, setUsers] = useState<unknown[]>([]);
  const [numbers, setNumbers] = useState<unknown[]>([]);
  const [editCredits, setEditCredits] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAdmin) return;
    if (tab === 'stats') getAdminStats().then(setStats);
    if (tab === 'users') getAdminUsers().then(setUsers);
    if (tab === 'numbers') getAdminNumbers().then(setNumbers);
  }, [tab, isAdmin]);

  if (!isAdmin) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Shield size={40} className="text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500 font-mono">Admin access required</p>
      </div>
    </div>
  );

  const handleUpdateCredits = async (id: string) => {
    const credits = parseInt(editCredits[id] || '0');
    const updated = await updateCredits(id, credits);
    setUsers(prev => prev.map((u: unknown) => (u as { _id: string })._id === id ? updated : u));
    setEditCredits(p => { const n = { ...p }; delete n[id]; return n; });
  };

  const handleUpdateRole = async (id: string, role: string) => {
    const updated = await updateRole(id, role === 'admin' ? 'user' : 'admin');
    setUsers(prev => prev.map((u: unknown) => (u as { _id: string })._id === id ? updated : u));
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'stats', label: 'Stats', icon: MessageSquare },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'numbers', label: 'Numbers', icon: Phone },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-center">
          <Shield size={18} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Admin Panel</h1>
          <p className="text-gray-500 font-mono text-xs">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-1 border border-border rounded-xl p-1 mb-6 max-w-xs">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-mono transition-all ${
              tab === t.id ? 'bg-yellow-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}>
            <t.icon size={13} />{t.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {tab === 'stats' && stats && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-400' },
            { label: 'Total Numbers', value: stats.numbers, icon: Phone, color: 'text-primary' },
            { label: 'Total SMS', value: stats.sms, icon: MessageSquare, color: 'text-purple-400' },
          ].map(s => (
            <div key={s.label} className="bg-surface-1 border border-border rounded-2xl p-6">
              <s.icon size={20} className={`${s.color} mb-3`} />
              <div className="text-3xl font-mono font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 font-mono mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-mono text-gray-500 border-b border-border">
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Credits</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(users as { _id: string; email: string; role: string; credits: number; createdAt: string }[]).map(u => (
                <tr key={u._id} className="text-sm font-mono">
                  <td className="py-3 pr-4 text-white">{u.email}</td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => handleUpdateRole(u._id, u.role)}
                      className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                        u.role === 'admin'
                          ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20'
                          : 'text-gray-500 border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {u.role}
                    </button>
                  </td>
                  <td className="py-3 pr-4">
                    {editCredits[u._id] !== undefined ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number" value={editCredits[u._id]}
                          onChange={e => setEditCredits(p => ({ ...p, [u._id]: e.target.value }))}
                          className="w-16 bg-surface-2 border border-border rounded px-2 py-0.5 text-white text-xs font-mono"
                        />
                        <button onClick={() => handleUpdateCredits(u._id)} className="text-primary hover:text-primary-dark"><Check size={12} /></button>
                        <button onClick={() => setEditCredits(p => { const n = { ...p }; delete n[u._id]; return n; })} className="text-gray-500 hover:text-red-400"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-primary">{u.credits}</span>
                        <button onClick={() => setEditCredits(p => ({ ...p, [u._id]: String(u.credits) }))} className="text-gray-600 hover:text-white">
                          <Edit2 size={11} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Numbers */}
      {tab === 'numbers' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-mono text-gray-500 border-b border-border">
                <th className="pb-3 pr-4">Phone</th>
                <th className="pb-3 pr-4">Country</th>
                <th className="pb-3 pr-4">Provider</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Expires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(numbers as { _id: string; phone: string; country: string; provider: string; status: string; expiresAt: string }[]).map(n => (
                <tr key={n._id} className="text-sm font-mono">
                  <td className="py-3 pr-4 text-white">{n.phone}</td>
                  <td className="py-3 pr-4 text-gray-400">{n.country}</td>
                  <td className="py-3 pr-4 text-gray-400">{n.provider}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      n.status === 'active' ? 'text-primary border-primary/30 bg-primary/10' : 'text-gray-500 border-gray-700'
                    }`}>{n.status}</span>
                  </td>
                  <td className="py-3 text-gray-500">{new Date(n.expiresAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
