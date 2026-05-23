import axios from 'axios';

const BASE = 'https://api.sms-activate.org/stubs/handler_api.php';
const KEY = () => process.env.SMS_ACTIVATE_KEY!;

export const smsActivate = {
  async getNumber(service: string, country: number = 0) {
    const { data } = await axios.get(BASE, {
      params: { api_key: KEY(), action: 'getNumber', service, country },
    });
    // Returns: ACCESS_NUMBER:id:phone
    const parts = String(data).split(':');
    if (parts[0] !== 'ACCESS_NUMBER') throw new Error(data);
    return { providerId: parts[1], phone: parts[2] };
  },

  async getSMS(id: string) {
    const { data } = await axios.get(BASE, {
      params: { api_key: KEY(), action: 'getStatus', id },
    });
    const s = String(data);
    if (s.startsWith('STATUS_OK')) return s.replace('STATUS_OK:', '');
    return null;
  },

  async cancelNumber(id: string) {
    await axios.get(BASE, {
      params: { api_key: KEY(), action: 'setStatus', id, status: 8 },
    });
  },
};
