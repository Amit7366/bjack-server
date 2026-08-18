import './load-globals'; // make sure globals load first

import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { corsOriginDelegate } from './app/config/cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import { callbackRoute } from './app/Bet/callback.route';
import { launchGameRoute } from './app/Bet/game.route';
import { autopayRoute } from './app/AutoPay/autopay.route';

const app: Application = express();

/** 👉 trust upstream proxy (Nginx) for IPs/cookies/rate-limit */
app.set('trust proxy', 1);

/** 👉 Hot path FIRST: mount callback with its own tiny parser, no helmet here */
// app.use('/api/v1/callback', callbackRoute);
app.use("/api/v1/callback", callbackRoute);
app.use("/api/v1/game-launch", launchGameRoute);
app.use("/api/v1/autopay", autopayRoute);


/** Body parsers & cookies for the rest */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/** Helmet/CSP (skip it for /callback, applied to the rest) */
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'https://www.google-analytics.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'https://www.google-analytics.com', 'https://stats.g.doubleclick.net'],
        connectSrc: [
          "'self'",
          'https://www.google-analytics.com',
          'https://bkbajiapi.xyz',
          'https://api.bkb444.site',
          'https://bm24api.xyz',
          'https://sbm777.com',
          'https://sbm777.vercel.app',
          'wss://bkbajiapi.xyz',
          'wss://api.bkb444.site',
          'wss://bm24api.xyz',
          'wss://sbm777.com',
        ],
        frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.google.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xContentTypeOptions: true,
    frameguard: { action: 'sameorigin' },
  })
);

/** Static files with cache control */
app.use(
  express.static(path.join(__dirname, '../public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.xml') || filePath.endsWith('.txt')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
      }
    },
  })
);

/** CORS for the rest (callback already responded earlier) */
const corsOptions = {
  origin: corsOriginDelegate,
  credentials: true,
  exposedHeaders: ['X-Handler-Time-ms', 'Server-Timing'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/** Health check */
app.get('/', (_req: Request, res: Response) => {
  res.send('🔥 App is Running');
});


app.post("/api/v1/launch-game", async (req, res) => {
  // res.json({status: "success", message: "Game launched successfully",data: req.body});
  try {
    const response = await fetch("https://account.24gameapi.org/api/gameLaunch.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err :any) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});
/** API modules */
app.use('/api/v1', router);

/** Errors */
app.use(globalErrorHandler);
app.use(notFound);

export default app;
