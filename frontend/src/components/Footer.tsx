import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-1 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono font-bold text-white">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <MessageSquare size={12} className="text-black" />
          </div>
          TempSMS.io
        </div>
        <div className="flex gap-6 text-sm font-mono text-gray-500">
          <Link href="/api-docs" className="hover:text-white transition-colors">API</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
        <p className="text-xs text-gray-600 font-mono">© {new Date().getFullYear()} TempSMS.io</p>
      </div>
    </footer>
  );
}
