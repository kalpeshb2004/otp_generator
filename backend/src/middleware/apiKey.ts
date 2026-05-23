import { Request, Response, NextFunction } from 'express';
import ApiKey from '../models/ApiKey';
import { AuthRequest } from './auth';

export const apiKeyMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const key = req.headers['x-api-key'] as string;
  if (!key) return res.status(401).json({ error: 'API key required' });
  const apiKey = await ApiKey.findOne({ key, active: true });
  if (!apiKey) return res.status(401).json({ error: 'Invalid API key' });
  apiKey.usageCount++;
  apiKey.lastUsed = new Date();
  await apiKey.save();
  req.userId = apiKey.userId;
  next();
};
