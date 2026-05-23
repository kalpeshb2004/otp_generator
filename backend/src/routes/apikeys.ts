import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import ApiKey from '../models/ApiKey';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  const keys = await ApiKey.find({ userId: req.userId });
  res.json(keys);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { label } = req.body;
  const key = await ApiKey.create({
    userId: req.userId,
    key: `sk_${uuidv4().replace(/-/g, '')}`,
    label: label || 'My Key',
  });
  res.json(key);
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await ApiKey.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ ok: true });
});

router.patch('/:id/toggle', async (req: AuthRequest, res: Response) => {
  const key = await ApiKey.findOne({ _id: req.params.id, userId: req.userId });
  if (!key) return res.status(404).json({ error: 'Not found' });
  key.active = !key.active;
  await key.save();
  res.json(key);
});

export default router;
