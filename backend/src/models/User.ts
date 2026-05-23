import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'user' | 'admin';
  credits: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  credits: { type: Number, default: 10 },
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
