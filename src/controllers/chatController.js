const chatService = require('../services/chatService');

class ChatController {
  async createOrGetChat(req, res, next) {
    try {
      const { userId, isGroup, groupName, members } = req.body;

      let chat;

      if (isGroup) {
        chat = await chatService.createGroupChat(req.user._id, groupName, members);
      } else {
        chat = await chatService.createOrGetChat(req.user._id, userId);
      }

      res.status(200).json({
        success: true,
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserChats(req, res, next) {
    try {
      const chats = await chatService.getUserChats(req.user._id);

      res.status(200).json({
        success: true,
        data: chats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getChatById(req, res, next) {
    try {
      const { chatId } = req.params;
      const chat = await chatService.getChatById(chatId, req.user._id);

      res.status(200).json({
        success: true,
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();
