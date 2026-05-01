const Message = require('../models/Message');
const Chat = require('../models/Chat');

class MessageService {
  async sendMessage(chatId, senderId, content, type = 'text', mediaUrl = null, fileName = null) {
    // Verify chat exists and user is a member
    const chat = await Chat.findOne({
      _id: chatId,
      members: senderId,
    });

    if (!chat) {
      throw new Error('Chat not found or unauthorized');
    }

    // Create message
    const message = await Message.create({
      chatId,
      senderId,
      content,
      type,
      mediaUrl,
      fileName,
      status: 'sent',
    });

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.updatedAt = new Date();
    await chat.save();

    // Populate sender info
    await message.populate('senderId', 'name avatar');

    return message;
  }

  async getMessages(chatId, userId, page = 1, limit = 50) {
    // Verify user is a member of the chat
    const chat = await Chat.findOne({
      _id: chatId,
      members: userId,
    });

    if (!chat) {
      throw new Error('Chat not found or unauthorized');
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({
      chatId,
      deletedFor: { $ne: userId },
      deletedForEveryone: false,
    })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({
      chatId,
      deletedFor: { $ne: userId },
      deletedForEveryone: false,
    });

    return {
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async markAsDelivered(messageId, userId) {
    const message = await Message.findById(messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }

    // Don't update if sender is marking their own message
    if (message.senderId.toString() === userId.toString()) {
      return message;
    }

    if (message.status === 'sent') {
      message.status = 'delivered';
      await message.save();
    }

    return message;
  }

  async markAsRead(messageId, userId) {
    const message = await Message.findById(messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }

    // Don't update if sender is marking their own message
    if (message.senderId.toString() === userId.toString()) {
      return message;
    }

    // Check if already read by this user
    const alreadyRead = message.readBy.some(
      read => read.userId.toString() === userId.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({
        userId,
        readAt: new Date(),
      });

      // Update status to read
      message.status = 'read';
      await message.save();
    }

    return message;
  }

  async deleteMessage(messageId, userId, deleteForEveryone = false) {
    const message = await Message.findById(messageId);
    
    if (!message) {
      throw new Error('Message not found');
    }

    if (deleteForEveryone) {
      // Only sender can delete for everyone (within 1 hour)
      if (message.senderId.toString() !== userId.toString()) {
        throw new Error('Unauthorized to delete for everyone');
      }

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (message.createdAt < oneHourAgo) {
        throw new Error('Can only delete for everyone within 1 hour');
      }

      message.deletedForEveryone = true;
      message.content = 'This message was deleted';
      message.mediaUrl = null;
    } else {
      // Delete for me
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
      }
    }

    await message.save();
    return message;
  }
}

module.exports = new MessageService();
