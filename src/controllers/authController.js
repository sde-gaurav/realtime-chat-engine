const authService = require('../services/authService');

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production', 
  sameSite: 'strict',
  path: '/',
};

const ACCESS_TOKEN_COOKIE_EXPIRY  = 15 * 60 * 1000;          
const REFRESH_TOKEN_COOKIE_EXPIRY = 7 * 24 * 60 * 60 * 1000; 

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_COOKIE_EXPIRY,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_COOKIE_EXPIRY,
  });
};

const clearTokenCookies = (res) => {
  res.clearCookie('accessToken',  { ...cookieOptions });
  res.clearCookie('refreshToken', { ...cookieOptions });
};

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      const { refreshToken, ...responseData } = result;

      setTokenCookies(res, result.accessToken, refreshToken);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: responseData,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { phone, password } = req.body;
      const result = await authService.login(phone, password);
      const { refreshToken, ...responseData } = result;

      setTokenCookies(res, result.accessToken, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: responseData,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

      const result = await authService.refresh(incomingRefreshToken);
      const { refreshToken, ...responseData } = result;

      setTokenCookies(res, result.accessToken, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: responseData,
      });
    } catch (error) {
      clearTokenCookies(res);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      await authService.logout(req.user._id);

      clearTokenCookies(res);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
