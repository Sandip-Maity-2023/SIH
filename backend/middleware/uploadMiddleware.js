
// const multer = require('multer');
// const path = require('path');

// // Configure temporary disk storage for processing files before uploading to cloud
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
//     );
//   },
// });

// // File filter for Crop Images and Voice Recordings
// const fileFilter = (req, file, cb) => {
//   const allowedImageTypes = /jpeg|jpg|png|webp/;
//   const allowedAudioTypes = /wav|mp3|m4a|ogg|webm/;

//   const extname = path.extname(file.originalname).toLowerCase();
//   const isImage = allowedImageTypes.test(extname);
//   const isAudio = allowedAudioTypes.test(extname);

//   if (isImage || isAudio) {
//     return cb(null, true);
//   } else {
//     cb(
//       new Error(
//         'Unsupported file format. Only images (JPG, PNG, WEBP) and audio (WAV, MP3, OGG) are allowed.'
//       ),
//       false
//     );
//   }
// };

// // Initialize Multer Instance (5MB file limit)
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB Max Size
//   fileFilter,
// });

// module.exports = upload;


const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// File filter for images and voice/audio recordings
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const allowedAudioTypes = /wav|mp3|m4a|ogg|webm/;

  const extname = path.extname(file.originalname).toLowerCase();
  const isImage = allowedImageTypes.test(extname);
  const isAudio = allowedAudioTypes.test(extname);

  if (isImage || isAudio) {
    return cb(null, true);
  }

  cb(
    new Error(
      'Unsupported file format. Only images (JPG, PNG, WEBP) and audio (WAV, MP3, M4A, OGG, WEBM) are allowed.'
    ),
    false
  );
};

// Initialize Multer Instance (5MB file limit)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB Max Size
  fileFilter,
});

module.exports = upload;