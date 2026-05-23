import { Router, Response } from 'express';
import NumberModel from '../models/Number';
import SMSModel from '../models/SMS';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { getProvider, Provider } from '../providers';
import { apiKeyMiddleware } from '../middleware/apiKey';

const router = Router();
const auth = [authMiddleware];

// Public: list active numbers
router.get('/', async (req, res) => {
  const { country, page = '1', limit = '20' } = req.query;
  const filter: Record<string, unknown> = { status: 'active' };
  if (country) filter.country = country;
  const nums = await NumberModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit);
  const total = await NumberModel.countDocuments(filter);
  res.json({ numbers: nums, total, page: +page });
});

// Public: countries list
router.get('/countries', async (_req, res) => {
  const countries = await NumberModel.distinct('country', { status: 'active' });
  res.json(countries);
});

// Get single number + SMS
router.get('/:id', async (req, res) => {
  const num = await NumberModel.findById(req.params.id);
  if (!num) return res.status(404).json({ error: 'Not found' });
  const messages = await SMSModel.find({ numberId: req.params.id }).sort({ receivedAt: -1 });
  res.json({ number: num, messages });
});

// Buy number (auth required)
router.post('/buy', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { provider = 'sms-activate', service = 'any', country = 'us' } = req.body;
    const user = await User.findById(req.userId);
    if (!user || user.credits < 1) return res.status(402).json({ error: 'Insufficient credits' });

    const p = getProvider(provider as Provider);
    const { providerId, phone } = await p.getNumber(service, country);

    const num = await NumberModel.create({
      phone, country, countryCode: country.toUpperCase(),
      provider, providerId, service,
      userId: req.userId,
      expiresAt: new Date(Date.now() + 20 * 60 * 1000),
    });

    user.credits--;
    await user.save();
    res.json(num);
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Provider error' });
  }
});

// Cancel number
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  const num = await NumberModel.findOne({ _id: req.params.id, userId: req.userId });
  if (!num) return res.status(404).json({ error: 'Not found' });
  try {
    const p = getProvider(num.provider as Provider);
    await p.cancelNumber(num.providerId);
  } catch { /* ignore */ }
  num.status = 'expired';
  await num.save();
  res.json({ ok: true });
});

// API key access
router.get('/api/numbers', apiKeyMiddleware, async (_req, res) => {
  const nums = await NumberModel.find({ status: 'active' }).limit(50);
  res.json(nums);
});

export default router;
