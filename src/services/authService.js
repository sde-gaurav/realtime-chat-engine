const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

class AuthService {
  async register(userData) {
    const { name, phone, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new Error('Phone number already registered');
    }

    // Create new user
    const user = await User.create({
      name,
      phone,
      password,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(phone, password) {
    // Find user with password field
    const user = await User.findOne({ phone }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
      },
      accessToken,
      refreshToken,
    };
  }
}

module.exports = new AuthService();
