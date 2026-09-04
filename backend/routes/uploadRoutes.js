import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadSingleFile } from '../controllers/uploadController.js';

const router = express.Router();

// Upload single file field name 'file' or 'image'
router.post('/', upload.single('file'), uploadSingleFile);
router.post('/image', upload.single('image'), uploadSingleFile);

export default router;
