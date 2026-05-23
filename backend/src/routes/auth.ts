import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email taken' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, credits: user.credits } });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, credits: user.credits } });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
