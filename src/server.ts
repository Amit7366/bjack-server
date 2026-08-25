import './load-globals';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { corsOriginDelegate } from './app/config/cors';
import config from './app/config';
import seedSuperAdmin from './app/DB';
import { setupSocketIO } from './app/socket/socket.config';
import { setIO } from './app/socket/io';
import { startApivexoTxnIngestCron } from './app/cron/apivexoTxnIngest.cron';

let isConnected = false;
let server: http.Server | null = null;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(config.database_url as string);
  await seedSuperAdmin();
  isConnected = true;
  console.log('✅ MongoDB connected');
}

async function startServer() {
  try {
    await connectDB();

    server = http.createServer(app);

    const io = new Server(server, {
      path: '/socket.io',
      cors: {
        origin: corsOriginDelegate,
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
      startApivexoTxnIngestCron();
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
