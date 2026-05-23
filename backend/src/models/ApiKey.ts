import { Schema, model, Document } from 'mongoose';

export interface IApiKey extends Document {
  userId: string;
  key: string;
  label: string;
  active: boolean;
  usageCount: number;
  lastUsed?: Date;
}

const ApiKeySchema = new Schema<IApiKey>({
  userId: { type: String, required: true, index: true },
  key: { type: String, required: true, unique: true },
  label: { type: String, default: 'My Key' },
  active: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 },
  lastUsed: { type: Date },
}, { timestamps: true });

export default model<IApiKey>('ApiKey', ApiKeySchema);
