import { Router } from 'express';
import SMSModel from '../models/SMS';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import NumberModel from '../models/Number';

const router = Router();

// SMS history for a number
router.get('/number/:numberId', async (req, res) => {
  const msgs = await SMSModel.find({ numberId: req.params.numberId }).sort({ receivedAt: -1 });
  res.json(msgs);
});

// User SMS history
router.get('/history', authMiddleware, async (req: AuthRequest, res) => {
  const userNumbers = await NumberModel.find({ userId: req.userId }).select('_id');
  const ids = userNumbers.map(n => String(n._id));
  const msgs = await SMSModel.find({ numberId: { $in: ids } }).sort({ receivedAt: -1 }).limit(100);
  res.json(msgs);
});

// Recent global SMS (public)
router.get('/recent', async (_req, res) => {
  const msgs = await SMSModel.find().sort({ receivedAt: -1 }).limit(20);
  res.json(msgs);
});

export default router;
