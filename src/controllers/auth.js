import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';
import { registerUserService } from "../services/auth.js";

// Kullanıcı kaydetme kontrolörü
export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await registerUserService({ name, email, password });
    res.status(201).json({
      status: "success",
      message: "Successfully registered a user!",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// Kullanıcı giriş kontrolörü
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, 'Invalid email or password');

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw createHttpError(401, 'Invalid email or password');

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    await Session.findOneAndDelete({ userId: user._id });
    const session = new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await session.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token ile yeni access token alma
export const refreshTokenController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw createHttpError(401, 'Refresh token missing');

    const session = await Session.findOne({ refreshToken });
    if (!session) throw createHttpError(403, 'Invalid refresh token');

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Kullanıcı çıkış yapma kontrolörü
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw createHttpError(401, 'No refresh token found');

    await Session.findOneAndDelete({ refreshToken });
    res.clearCookie('refreshToken');
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged out!',
    });
  } catch (error) {
    next(error);
  }
};
