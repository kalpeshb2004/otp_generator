import axios from 'axios';

const BASE = 'https://api.smspool.net';
const KEY = () => process.env.SMSPOOL_KEY!;

export const smsPool = {
  async getNumber(service: string, country: string = 'US') {
    const { data } = await axios.post(`${BASE}/purchase/sms`, {
      key: KEY(), service, country,
    });
    if (!data.success) throw new Error(data.message);
    return { providerId: String(data.order_id), phone: data.phonenumber };
  },

  async getSMS(id: string) {
    const { data } = await axios.post(`${BASE}/sms/check`, { key: KEY(), orderid: id });
    if (data.status === 3 && data.sms) return data.sms;
    return null;
  },

  async cancelNumber(id: string) {
    await axios.post(`${BASE}/sms/cancel`, { key: KEY(), orderid: id });
  },
};
