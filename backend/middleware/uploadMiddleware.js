import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure local 'uploads/' directory exists dynamically
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure temporary disk storage before uploading to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// File filter for images, documents, and voice/audio recordings
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp|pdf/;
  const allowedAudioTypes = /wav|mp3|m4a|ogg|webm/;

  const extname = path.extname(file.originalname).toLowerCase();
  const isImageOrDoc = allowedImageTypes.test(extname);
  const isAudio = allowedAudioTypes.test(extname);

  if (isImageOrDoc || isAudio) {
    return cb(null, true);
  }

  cb(
    new Error(
      'Unsupported file format. Only images (JPG, PNG, WEBP, PDF) and audio (WAV, MP3, M4A, OGG, WEBM) are allowed.'
    ),
    false
  );
};

// Initialize Multer Instance (25MB file limit)
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB Max Size
  fileFilter,
});

export default upload;