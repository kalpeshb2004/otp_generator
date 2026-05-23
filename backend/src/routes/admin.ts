import { Router } from 'express';
import User from '../models/User';
import NumberModel from '../models/Number';
import SMSModel from '../models/SMS';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

const router = Router();
router.use(authMiddleware, adminMiddleware);

router.get('/stats', async (_req, res) => {
  const [users, numbers, sms] = await Promise.all([
    User.countDocuments(),
    NumberModel.countDocuments(),
    SMSModel.countDocuments(),
  ]);
  res.json({ users, numbers, sms });
});

router.get('/users', async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

router.patch('/users/:id/credits', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { credits: req.body.credits }, { new: true });
  res.json(user);
});

router.patch('/users/:id/role', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.json(user);
});

router.delete('/numbers/:id', async (req, res) => {
  await NumberModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

router.get('/numbers', async (_req, res) => {
  const nums = await NumberModel.find().sort({ createdAt: -1 }).limit(100);
  res.json(nums);
});

export default router;
