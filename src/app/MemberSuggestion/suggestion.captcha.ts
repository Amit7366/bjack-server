import { randomBytes } from 'crypto';

const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const CAPTCHA_COLORS = ['#7c3aed', '#eab308', '#2563eb', '#16a34a', '#92400e'];

type CaptchaEntry = {
  answer: string;
  expiresAt: number;
};

const captchaStore = new Map<string, CaptchaEntry>();

function purgeExpiredCaptchas() {
  const now = Date.now();
  for (const [id, entry] of captchaStore) {
    if (entry.expiresAt <= now) {
      captchaStore.delete(id);
    }
  }
}

function buildCaptchaSvg(code: string): string {
  const chars = code.split('');
  const textElements = chars
    .map((char, index) => {
      const x = 16 + index * 22;
      const y = 32 + Math.floor(Math.random() * 7) - 3;
      const rotate = Math.floor(Math.random() * 24) - 12;
      const color = CAPTCHA_COLORS[index % CAPTCHA_COLORS.length];
      return `<text x="${x}" y="${y}" fill="${color}" font-size="22" font-family="Arial,sans-serif" font-weight="700" transform="rotate(${rotate} ${x} ${y})">${char}</text>`;
    })
    .join('');

  const lines = Array.from({ length: 5 }, (_, index) => {
    const y = 8 + index * 9;
    return `<line x1="0" y1="${y}" x2="130" y2="${y + 7}" stroke="#d1d5db" stroke-width="1" opacity="0.65"/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="130" height="48" viewBox="0 0 130 48"><rect width="130" height="48" fill="#f3f4f6" rx="4"/>${lines}${textElements}</svg>`;
}

export function createSuggestionCaptcha() {
  purgeExpiredCaptchas();

  const code = String(Math.floor(10000 + Math.random() * 90000));
  const captchaId = randomBytes(16).toString('hex');
  captchaStore.set(captchaId, {
    answer: code,
    expiresAt: Date.now() + CAPTCHA_TTL_MS,
  });

  const svg = buildCaptchaSvg(code);
  const image = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

  return { captchaId, image };
}

export function verifySuggestionCaptcha(captchaId: string, answer: string): boolean {
  purgeExpiredCaptchas();

  const entry = captchaStore.get(captchaId);
  captchaStore.delete(captchaId);

  if (!entry || entry.expiresAt <= Date.now()) {
    return false;
  }

  return entry.answer === answer.trim();
}
