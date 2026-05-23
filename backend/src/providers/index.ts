import { smsActivate } from './smsActivate';
import { fiveSim } from './fiveSim';
import { smsPool } from './smsPool';

export type Provider = 'sms-activate' | '5sim' | 'smspool';

export const getProvider = (p: Provider) => {
  if (p === 'sms-activate') return smsActivate;
  if (p === '5sim') return fiveSim;
  return smsPool;
};

export const extractOTP = (text: string): string | undefined => {
  const m = text.match(/\b(\d{4,8})\b/);
  return m?.[1];
};
