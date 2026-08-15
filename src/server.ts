import './load-globals';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import config from './app/config';
import seedSuperAdmin from './app/DB';
import { setupSocketIO } from './app/socket/socket.config';
import { setIO } from './app/socket/io';

let isConnected = false;
let server: http.Server | null = null;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(config.database_url as string);
  await seedSuperAdmin();
  isConnected = true;
  console.log('✅ MongoDB connected');
}

function getAllowedOrigins(): string[] {
  const corsFromEnv = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'https://bkbaji.com',
    'https://www.bkbaji.com',
    'https://admin.bkbaji.com',
    'https://aff.bkbaji.com',
    'https://bkb444.site',
    'https://www.bkb444.site',
    ...corsFromEnv,
  ];
}

async function startServer() {
  try {
    await connectDB();

    server = http.createServer(app);

    const io = new Server(server, {
      path: '/socket.io',
      cors: {
        origin: getAllowedOrigins(),
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      pingInterval: 25000,
      pingTimeout: 60000,
    });

    setIO(io);
    setupSocketIO(io);

    server.keepAliveTimeout = 70_000;
    server.headersTimeout = 75_000;

    const port = config.port || 5000;
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port} with Socket.IO`);
    });
  } catch (err) {
    console.error('❌ Server start failed:', err);
    process.exit(1);
  }
}

startServer();

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
