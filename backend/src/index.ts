import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import { apiLimiter } from './middleware/rateLimit';
import authRoutes from './routes/auth';
import numberRoutes from './routes/numbers';
import smsRoutes from './routes/sms';
import adminRoutes from './routes/admin';
import apiKeyRoutes from './routes/apikeys';
import { initPoller } from './services/poller';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || '*', credentials: true },
});

app.use(cors());
app.use(express.json());
app.use(apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/numbers', numberRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/keys', apiKeyRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

io.on('connection', (socket) => {
  socket.on('subscribe:number', (numberId: string) => {
    socket.join(`number:${numberId}`);
  });
  socket.on('unsubscribe:number', (numberId: string) => {
    socket.leave(`number:${numberId}`);
  });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on :${PORT}`));
  initPoller(io);
});
