import axios from 'axios';

const BASE = 'https://5sim.net/v1';
const headers = () => ({ Authorization: `Bearer ${process.env.FIVESIM_KEY}` });

export const fiveSim = {
  async getNumber(product: string, country: string = 'any', operator: string = 'any') {
    const { data } = await axios.get(
      `${BASE}/user/buy/activation/${country}/${operator}/${product}`,
      { headers: headers() }
    );
    return { providerId: String(data.id), phone: data.phone };
  },

  async getSMS(id: string) {
    const { data } = await axios.get(`${BASE}/user/check/${id}`, { headers: headers() });
    if (data.sms?.length) return data.sms[data.sms.length - 1].text;
    return null;
  },

  async cancelNumber(id: string) {
    await axios.get(`${BASE}/user/cancel/${id}`, { headers: headers() });
  },
};
