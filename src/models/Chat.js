const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  isGroup: {
    type: Boolean,
    default: false,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  groupName: {
    type: String,
    trim: true,
  },
  groupAvatar: {
    type: String,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
}, {
  timestamps: true,
});

// Index for faster queries
chatSchema.index({ members: 1 });
chatSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);
