import { Schema, model, Document } from 'mongoose';

export interface INumber extends Document {
  phone: string;
  country: string;
  countryCode: string;
  provider: 'sms-activate' | '5sim' | 'smspool';
  providerId: string;
  service: string;
  status: 'active' | 'expired' | 'used';
  userId?: string;
  expiresAt: Date;
  createdAt: Date;
}

const NumberSchema = new Schema<INumber>({
  phone: { type: String, required: true },
  country: { type: String, required: true },
  countryCode: { type: String, required: true },
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
  service: { type: String, default: 'any' },
  status: { type: String, enum: ['active', 'expired', 'used'], default: 'active' },
  userId: { type: String },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export default model<INumber>('Number', NumberSchema);
