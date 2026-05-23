'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageSquare, LayoutDashboard, Shield, Key, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const navLinks = [
  { href: '/', label: 'Numbers' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/api-docs', label: 'API' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-mono font-bold text-white">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <MessageSquare size={14} className="text-black" />
          </div>
          <span>TempSMS<span className="text-primary">.</span>io</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-mono transition-colors ${
                pathname === l.href ? 'text-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs font-mono text-gray-500 border border-border px-2 py-1 rounded-lg">
                {user.credits} credits
              </span>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white font-mono transition-colors">
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-1.5 text-sm text-yellow-400 hover:text-yellow-300 font-mono transition-colors">
                  <Shield size={14} />
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 font-mono transition-colors">
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-mono text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="text-sm font-mono bg-primary text-black px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu btn */}
        <button className="md:hidden text-gray-400" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-surface-1 p-4 flex flex-col gap-3">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-sm font-mono text-gray-400 hover:text-white">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-mono text-gray-300 flex items-center gap-2">
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="text-sm font-mono text-red-400 text-left flex items-center gap-2">
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-mono text-gray-400 hover:text-white">Login</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="text-sm font-mono bg-primary text-black px-3 py-1.5 rounded-lg font-semibold">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
