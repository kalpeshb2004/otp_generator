import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    credits: '10',
    period: 'on signup',
    features: ['10 free credits', 'Public numbers', 'SMS history', 'API access', 'Real-time updates'],
    cta: 'Get Started',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$5',
    credits: '50',
    period: 'per month',
    features: ['50 credits/mo', 'All providers', 'Priority support', 'API key management', 'SMS export'],
    cta: 'Buy Starter',
    href: '/register',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$15',
    credits: '200',
    period: 'per month',
    features: ['200 credits/mo', 'Webhook support', 'Advanced filtering', 'Bulk API access', 'Custom retention'],
    cta: 'Buy Pro',
    href: '/register',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-mono text-white mb-3">
          Simple <span className="text-primary">Pricing</span>
        </h1>
        <p className="text-gray-400">1 credit = 1 temporary phone number (20 min)</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {plans.map(plan => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-6 border transition-all ${
              plan.highlight
                ? 'bg-primary/5 border-primary/30 glow-border'
                : 'bg-surface-1 border-border'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-black text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap size={10} /> Most Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <div className="text-gray-400 font-mono text-sm mb-2">{plan.name}</div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold font-mono text-white">{plan.price}</span>
                <span className="text-gray-500 font-mono text-sm mb-1">/{plan.period}</span>
              </div>
              <div className="text-primary font-mono text-sm mt-1">{plan.credits} credits</div>
            </div>

            <ul className="space-y-2.5 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300 font-mono">
                  <Check size={13} className="text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`block text-center py-3 rounded-xl font-mono font-bold text-sm transition-all ${
                plan.highlight
                  ? 'bg-primary text-black hover:bg-primary-dark'
                  : 'border border-border text-white hover:border-border-bright hover:bg-surface-2'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold font-mono text-white text-center mb-8">FAQ</h2>
        <div className="space-y-4">
          {[
            { q: 'What is a credit?', a: '1 credit = 1 temporary phone number valid for 20 minutes. Unused time is not refunded.' },
            { q: 'Which providers are supported?', a: 'SMS-Activate, 5SIM, and SMSPool. Provider availability varies by country and service.' },
            { q: 'Can I use these for 2FA permanently?', a: 'No. Temporary numbers expire. For permanent 2FA, buy a real SIM.' },
            { q: 'Is there a free tier?', a: 'Yes. You get 10 credits on signup. No credit card required.' },
          ].map(faq => (
            <div key={faq.q} className="bg-surface-1 border border-border rounded-xl p-4">
              <div className="font-mono font-semibold text-white text-sm mb-1">{faq.q}</div>
              <div className="text-gray-400 text-sm">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
