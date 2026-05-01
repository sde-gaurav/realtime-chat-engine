const messageService = require('../services/messageService');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

class MessageController {
  async sendMessage(req, res, next) {
    try {
      const { chatId, content, type } = req.body;
      let mediaUrl = null;
      let fileName = null;

      // Handle file upload if present
      if (req.file) {
        // Upload to cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'chat-media',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });

        mediaUrl = uploadResult.secure_url;
        fileName = req.file.originalname;
      }

      const message = await messageService.sendMessage(
        chatId,
        req.user._id,
        content,
        type,
        mediaUrl,
        fileName
      );

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { chatId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const result = await messageService.getMessages(
        chatId,
        req.user._id,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsDelivered(req, res, next) {
    try {
      const { messageId } = req.body;
      const message = await messageService.markAsDelivered(messageId, req.user._id);

      res.status(200).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { messageId } = req.body;
      const message = await messageService.markAsRead(messageId, req.user._id);

      res.status(200).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const { id } = req.params;
      const { deleteForEveryone = false } = req.body;

      const message = await messageService.deleteMessage(
        id,
        req.user._id,
        deleteForEveryone
      );

      res.status(200).json({
        success: true,
        message: 'Message deleted successfully',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();
