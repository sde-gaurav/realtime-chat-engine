const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/', authenticate, upload.single('file'), messageController.sendMessage);
router.get('/:chatId', authenticate, messageController.getMessages);
router.delete('/:id', authenticate, messageController.deleteMessage);
router.post('/delivered', authenticate, messageController.markAsDelivered);
router.post('/read', authenticate, messageController.markAsRead);

module.exports = router;
