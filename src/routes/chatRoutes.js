const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createChatSchema } = require('../utils/validators');

router.post('/', authenticate, validate(createChatSchema), chatController.createOrGetChat);
router.get('/', authenticate, chatController.getUserChats);
router.get('/:chatId', authenticate, chatController.getChatById);

module.exports = router;
