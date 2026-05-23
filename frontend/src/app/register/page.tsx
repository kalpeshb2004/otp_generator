'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2 } from 'lucide-react';
import { register } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password min 6 chars'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await register({ email, password });
      setAuth(data.user, data.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center">
            <UserPlus size={20} className="text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-1 font-mono">Create account</h1>
        <p className="text-gray-500 text-sm text-center mb-8 font-mono">Get 10 free credits on sign up</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1.5">EMAIL</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="you@example.com"
              className="w-full bg-surface-1 border border-border rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1.5">PASSWORD</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="Min 6 characters"
              className="w-full bg-surface-1 border border-border rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm font-mono bg-red-900/20 border border-red-900/50 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-black font-bold font-mono py-3 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm font-mono text-gray-500 mt-6">
          Have account?{' '}
          <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
