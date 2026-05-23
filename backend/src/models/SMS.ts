import { Schema, model, Document } from 'mongoose';

export interface ISMS extends Document {
  numberId: string;
  phone: string;
  sender: string;
  text: string;
  otp?: string;
  provider: string;
  receivedAt: Date;
}

const SMSSchema = new Schema<ISMS>({
  numberId: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  sender: { type: String, default: 'Unknown' },
  text: { type: String, required: true },
  otp: { type: String },
  provider: { type: String, required: true },
  receivedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default model<ISMS>('SMS', SMSSchema);
