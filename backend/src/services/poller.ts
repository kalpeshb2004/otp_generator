import { Server } from 'socket.io';
import NumberModel from '../models/Number';
import SMSModel from '../models/SMS';
import { getProvider, extractOTP } from '../providers';

let io: Server;

export const initPoller = (socketIo: Server) => {
  io = socketIo;
  setInterval(pollAll, 5000);
};

const pollAll = async () => {
  const numbers = await NumberModel.find({ status: 'active' });
  for (const num of numbers) {
    if (new Date() > num.expiresAt) {
      num.status = 'expired';
      await num.save();
      io.to(`number:${num._id}`).emit('number:expired', { numberId: num._id });
      continue;
    }
    try {
      const provider = getProvider(num.provider);
      const text = await provider.getSMS(num.providerId);
      if (!text) continue;
      const exists = await SMSModel.findOne({ numberId: String(num._id), text });
      if (exists) continue;
      const otp = extractOTP(text);
      const sms = await SMSModel.create({
        numberId: String(num._id),
        phone: num.phone,
        sender: 'Unknown',
        text,
        otp,
        provider: num.provider,
      });
      io.to(`number:${num._id}`).emit('sms:new', sms);
      io.emit('sms:global', { ...sms.toObject(), country: num.country });
    } catch (e) {
      // Provider error — skip
    }
  }
};
