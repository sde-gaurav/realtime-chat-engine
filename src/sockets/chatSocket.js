const messageService = require('../services/messageService');
const presenceService = require('../services/presenceService');
const Chat = require('../models/Chat');
const { verifyAccessToken } = require('../utils/jwt');

const setupChatSocket = (io) => {
  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log(`User connected: ${userId}`);

    // Set user online
    await presenceService.setUserOnline(userId, socket.id);

    // Notify user's contacts about online status
    const userChats = await Chat.find({ members: userId }).select('members');
    const contactIds = new Set();
    
    userChats.forEach(chat => {
      chat.members.forEach(memberId => {
        if (memberId.toString() !== userId.toString()) {
          contactIds.add(memberId.toString());
        }
      });
    });

    // Emit online status to contacts
    for (const contactId of contactIds) {
      const contactSocketId = await presenceService.getUserSocketId(contactId);
      if (contactSocketId) {
        io.to(contactSocketId).emit('user_online', { userId });
      }
    }

    // Join user to their chat rooms
    userChats.forEach(chat => {
      socket.join(chat._id.toString());
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { chatId, content, type = 'text' } = data;

        // Save message to database
        const message = await messageService.sendMessage(
          chatId,
          userId,
          content,
          type
        );

        // Emit to all users in the chat room
        io.to(chatId).emit('receive_message', message);

        // Mark as delivered for online users
        const chat = await Chat.findById(chatId);
        for (const memberId of chat.members) {
          if (memberId.toString() !== userId.toString()) {
            const isOnline = await presenceService.isUserOnline(memberId.toString());
            if (isOnline) {
              await messageService.markAsDelivered(message._id, memberId);
              io.to(chatId).emit('message_delivered', {
                messageId: message._id,
                chatId,
              });
            }
          }
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle message delivered
    socket.on('message_delivered', async (data) => {
      try {
        const { messageId, chatId } = data;
        await messageService.markAsDelivered(messageId, userId);
        
        io.to(chatId).emit('message_delivered', {
          messageId,
          chatId,
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle message read
    socket.on('message_read', async (data) => {
      try {
        const { messageId, chatId } = data;
        await messageService.markAsRead(messageId, userId);
        
        io.to(chatId).emit('message_read', {
          messageId,
          chatId,
          userId,
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle typing indicator
    socket.on('typing', async (data) => {
      try {
        const { chatId } = data;
        await presenceService.setTyping(userId, chatId, true);
        
        socket.to(chatId).emit('typing', {
          chatId,
          userId,
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle stop typing
    socket.on('stop_typing', async (data) => {
      try {
        const { chatId } = data;
        await presenceService.setTyping(userId, chatId, false);
        
        socket.to(chatId).emit('stop_typing', {
          chatId,
          userId,
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${userId}`);
      
      // Set user offline
      await presenceService.setUserOffline(userId);

      // Notify contacts about offline status
      for (const contactId of contactIds) {
        const contactSocketId = await presenceService.getUserSocketId(contactId);
        if (contactSocketId) {
          io.to(contactSocketId).emit('user_offline', { userId });
        }
      }
    });
  });
};

module.exports = setupChatSocket;
