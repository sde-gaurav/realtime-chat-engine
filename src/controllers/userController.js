const User = require('../models/User');

class UserController {
  async getMe(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req, res, next) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      const users = await User.find({
        _id: { $ne: req.user._id }, // Exclude current user
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } },
        ],
      })
        .select('name phone avatar isOnline lastSeen')
        .limit(20);

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
