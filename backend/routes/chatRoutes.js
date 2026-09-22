import express from 'express';
import { handleChatMessage } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Public endpoint so any visitor or authenticated user can ask questions
router.post('/', handleChatMessage);

export default router;
