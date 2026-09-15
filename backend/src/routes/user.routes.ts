import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const userController = new UserController();

export const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get('/', asyncHandler((req, res) => userController.findAll(req, res)));
userRoutes.get('/:id', asyncHandler((req, res) => userController.findById(req, res)));
userRoutes.post('/', asyncHandler((req, res) => userController.create(req, res)));
userRoutes.put('/:id', asyncHandler((req, res) => userController.update(req, res)));
userRoutes.delete('/:id', asyncHandler((req, res) => userController.delete(req, res)));
