const User = require('../models/User');

class PresenceService {
  constructor() {
    // In-memory storage for online users and socket mappings
    this.onlineUsers = new Map(); // userId -> { socketId, lastSeen }
    this.typingUsers = new Map(); // chatId -> Set of userIds
    this.typingTimeouts = new Map(); // chatId:userId -> timeoutId
  }

  async setUserOnline(userId, socketId) {
    // Store in memory
    this.onlineUsers.set(userId.toString(), {
      socketId,
      lastSeen: new Date(),
    });

    // Update database
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastSeen: new Date(),
    });
  }

  async setUserOffline(userId) {
    // Remove from memory
    this.onlineUsers.delete(userId.toString());
    
    // Update database
    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastSeen: new Date(),
    });
  }

  isUserOnline(userId) {
    return this.onlineUsers.has(userId.toString());
  }

  getUserSocketId(userId) {
    const user = this.onlineUsers.get(userId.toString());
    return user ? user.socketId : null;
  }

  setTyping(userId, chatId, isTyping) {
    const chatKey = chatId.toString();
    const userKey = userId.toString();
    const timeoutKey = `${chatKey}:${userKey}`;

    if (isTyping) {
      // Add user to typing set
      if (!this.typingUsers.has(chatKey)) {
        this.typingUsers.set(chatKey, new Set());
      }
      this.typingUsers.get(chatKey).add(userKey);

      // Clear existing timeout
      if (this.typingTimeouts.has(timeoutKey)) {
        clearTimeout(this.typingTimeouts.get(timeoutKey));
      }

      // Auto-remove after 5 seconds
      const timeout = setTimeout(() => {
        this.setTyping(userId, chatId, false);
      }, 5000);

      this.typingTimeouts.set(timeoutKey, timeout);
    } else {
      // Remove user from typing set
      if (this.typingUsers.has(chatKey)) {
        this.typingUsers.get(chatKey).delete(userKey);
        
        // Clean up empty sets
        if (this.typingUsers.get(chatKey).size === 0) {
          this.typingUsers.delete(chatKey);
        }
      }

      // Clear timeout
      if (this.typingTimeouts.has(timeoutKey)) {
        clearTimeout(this.typingTimeouts.get(timeoutKey));
        this.typingTimeouts.delete(timeoutKey);
      }
    }
  }

  getTypingUsers(chatId) {
    const chatKey = chatId.toString();
    const typingSet = this.typingUsers.get(chatKey);
    return typingSet ? Array.from(typingSet) : [];
  }

  refreshOnlineStatus(userId) {
    const userKey = userId.toString();
    if (this.onlineUsers.has(userKey)) {
      const userData = this.onlineUsers.get(userKey);
      userData.lastSeen = new Date();
      this.onlineUsers.set(userKey, userData);
    }
  }

  // Get all online users (useful for debugging)
  getAllOnlineUsers() {
    return Array.from(this.onlineUsers.keys());
  }

  // Clean up stale connections (optional, can be called periodically)
  cleanupStaleConnections(maxAgeMinutes = 10) {
    const now = new Date();
    const staleUsers = [];

    for (const [userId, userData] of this.onlineUsers.entries()) {
      const ageMinutes = (now - userData.lastSeen) / 1000 / 60;
      if (ageMinutes > maxAgeMinutes) {
        staleUsers.push(userId);
      }
    }

    // Remove stale users
    staleUsers.forEach(userId => {
      this.onlineUsers.delete(userId);
      User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      }).catch(err => console.error('Error updating stale user:', err));
    });

    return staleUsers.length;
  }
}

module.exports = new PresenceService();
