const Chat = require('../models/Chat');
const Message = require('../models/Message');
const mongoose = require('mongoose');

class ChatService {
  async createOrGetChat(userId, otherUserId) {
    // Check if 1-to-1 chat already exists
    let chat = await Chat.findOne({
      isGroup: false,
      members: { $all: [userId, otherUserId], $size: 2 },
    }).populate('members', 'name phone avatar isOnline lastSeen')
      .populate('lastMessage');

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        isGroup: false,
        members: [userId, otherUserId],
      });

      chat = await chat.populate('members', 'name phone avatar isOnline lastSeen');
    }

    return chat;
  }

  async createGroupChat(adminId, groupName, memberIds) {
    // Ensure admin is in members
    const allMembers = [...new Set([adminId, ...memberIds])];

    const chat = await Chat.create({
      isGroup: true,
      groupName,
      admin: adminId,
      members: allMembers,
    });

    return await chat.populate('members', 'name phone avatar isOnline lastSeen');
  }

  async getUserChats(userId) {
    const chats = await Chat.find({
      members: userId,
    })
      .populate('members', 'name phone avatar isOnline lastSeen')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'senderId',
          select: 'name',
        },
      })
      .sort({ updatedAt: -1 });

    return chats;
  }

  async getChatById(chatId, userId) {
    const chat = await Chat.findOne({
      _id: chatId,
      members: userId,
    })
      .populate('members', 'name phone avatar isOnline lastSeen')
      .populate('admin', 'name phone');

    if (!chat) {
      throw new Error('Chat not found');
    }

    return chat;
  }
}

module.exports = new ChatService();
