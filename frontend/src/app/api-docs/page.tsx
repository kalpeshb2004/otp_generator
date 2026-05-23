import CopyButton from '../../components/CopyButton';

const endpoints = [
  {
    method: 'GET', path: '/api/numbers', auth: false,
    desc: 'List active numbers. Query: ?country=us&page=1&limit=20',
    response: '{ numbers: [], total: 42, page: 1 }',
  },
  {
    method: 'GET', path: '/api/numbers/:id', auth: false,
    desc: 'Get number details and its SMS messages',
    response: '{ number: {}, messages: [] }',
  },
  {
    method: 'POST', path: '/api/numbers/buy', auth: true,
    desc: 'Buy a temp number (1 credit). Body: { provider, service, country }',
    response: '{ _id, phone, country, expiresAt, ... }',
  },
  {
    method: 'DELETE', path: '/api/numbers/:id', auth: true,
    desc: 'Cancel and expire a number',
    response: '{ ok: true }',
  },
  {
    method: 'GET', path: '/api/sms/number/:numberId', auth: false,
    desc: 'Get all SMS for a number',
    response: '[{ _id, sender, text, otp, receivedAt }]',
  },
  {
    method: 'GET', path: '/api/sms/recent', auth: false,
    desc: 'Get 20 most recent SMS globally',
    response: '[{ _id, phone, text, otp, receivedAt }]',
  },
  {
    method: 'GET', path: '/api/sms/history', auth: true,
    desc: 'Get authenticated user SMS history',
    response: '[{ _id, phone, text, otp, receivedAt }]',
  },
  {
    method: 'GET', path: '/api/keys', auth: true,
    desc: 'List your API keys',
    response: '[{ _id, label, key, active, usageCount }]',
  },
  {
    method: 'POST', path: '/api/keys', auth: true,
    desc: 'Create new API key. Body: { label }',
    response: '{ _id, key, label, active }',
  },
];

const methodColors: Record<string, string> = {
  GET: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  POST: 'text-primary bg-primary/10 border-primary/30',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/30',
  PATCH: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
};

const exampleCode = `// JavaScript example
const response = await fetch('https://api.tempsms.io/api/numbers', {
  headers: { 'x-api-key': 'sk_your_key_here' }
});
const { numbers } = await response.json();

// Buy a number
const number = await fetch('https://api.tempsms.io/api/numbers/buy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({ provider: 'sms-activate', service: 'google', country: 'us' })
}).then(r => r.json());`;

const wsExample = `// WebSocket (Socket.io)
import { io } from 'socket.io-client';

const socket = io('https://api.tempsms.io');

// Subscribe to a number
socket.emit('subscribe:number', numberId);

// Listen for new SMS
socket.on('sms:new', (sms) => {
  console.log('New SMS:', sms.text, 'OTP:', sms.otp);
});

// Listen for expiry
socket.on('number:expired', ({ numberId }) => {
  console.log('Number expired:', numberId);
});`;

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-mono text-white mb-2">
          API <span className="text-primary">Reference</span>
        </h1>
        <p className="text-gray-400">Base URL: <code className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">https://api.tempsms.io</code></p>
      </div>

      {/* Auth */}
      <section className="mb-10">
        <h2 className="text-lg font-mono font-bold text-white mb-4">Authentication</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-surface-1 border border-border rounded-xl p-4">
            <div className="text-xs font-mono text-gray-500 mb-2">JWT BEARER</div>
            <code className="text-sm font-mono text-gray-300">Authorization: Bearer YOUR_TOKEN</code>
          </div>
          <div className="bg-surface-1 border border-border rounded-xl p-4">
            <div className="text-xs font-mono text-gray-500 mb-2">API KEY</div>
            <code className="text-sm font-mono text-gray-300">x-api-key: sk_your_key</code>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="mb-10">
        <h2 className="text-lg font-mono font-bold text-white mb-4">Endpoints</h2>
        <div className="space-y-3">
          {endpoints.map((ep, i) => (
            <div key={i} className="bg-surface-1 border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded border font-bold ${methodColors[ep.method]}`}>
                  {ep.method}
                </span>
                <code className="font-mono text-white text-sm">{ep.path}</code>
                {ep.auth && (
                  <span className="text-xs font-mono text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 rounded">
                    Auth
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-2">{ep.desc}</p>
              <code className="text-xs font-mono text-gray-500 bg-surface-2 px-3 py-2 rounded-lg block">{ep.response}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Code example */}
      <section className="mb-10">
        <h2 className="text-lg font-mono font-bold text-white mb-4">REST Example</h2>
        <div className="relative bg-surface-1 border border-border rounded-xl p-4">
          <div className="absolute top-3 right-3">
            <CopyButton text={exampleCode} />
          </div>
          <pre className="text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre">{exampleCode}</pre>
        </div>
      </section>

      {/* WebSocket */}
      <section>
        <h2 className="text-lg font-mono font-bold text-white mb-4">WebSocket Events</h2>
        <div className="relative bg-surface-1 border border-border rounded-xl p-4 mb-4">
          <div className="absolute top-3 right-3">
            <CopyButton text={wsExample} />
          </div>
          <pre className="text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre">{wsExample}</pre>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {[
            { event: 'sms:new', dir: 'receive', desc: 'New SMS received for subscribed number' },
            { event: 'sms:global', dir: 'receive', desc: 'Any new SMS globally (home feed)' },
            { event: 'number:expired', dir: 'receive', desc: 'Subscribed number expired' },
          ].map(ev => (
            <div key={ev.event} className="bg-surface-1 border border-border rounded-xl p-3">
              <code className="text-primary text-sm font-mono">{ev.event}</code>
              <div className="text-xs text-gray-500 mt-1">{ev.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
