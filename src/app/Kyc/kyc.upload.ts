import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { MAX_KYC_FILE_BYTES } from './kyc.constant';

const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename(_req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

function isAllowedMime(mime: string): boolean {
  return ['image/jpeg', 'image/jpg', 'image/png'].includes(mime.toLowerCase());
}

export const kycUpload = multer({
  storage,
  limits: { fileSize: MAX_KYC_FILE_BYTES },
  fileFilter(_req, file, cb) {
    if (isAllowedMime(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only JPG, JPEG, or PNG files are allowed'));
  },
});
