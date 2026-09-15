import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/async-handler';

const authController = new AuthController();

export const authRoutes = Router();

authRoutes.post('/register', asyncHandler((req, res) => authController.register(req, res)));
authRoutes.post('/login', asyncHandler((req, res) => authController.login(req, res)));
authRoutes.post('/forgot-password', asyncHandler((req, res) => authController.forgotPassword(req, res)));
authRoutes.post('/reset-password', asyncHandler((req, res) => authController.resetPassword(req, res)));
