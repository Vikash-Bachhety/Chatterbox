import express from 'express';
import { receiveMessageController } from '../controllers/receiveMessageController.js';
import { sendMessageController } from '../controllers/sendMessageController.js';
import protectedRoute from '../middlewares/protectedRoute.js';

// Create an instance of Express
const router = express.Router();

// Message routes
router.get('/:id', protectedRoute, receiveMessageController);
router.post('/sent/:id', protectedRoute, sendMessageController); 

export default router;
