import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const userController = new UserController();

export const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get('/', userController.findAll);
userRoutes.get('/:id', userController.findById);
userRoutes.post('/', userController.create);
userRoutes.put('/:id', userController.update);
userRoutes.delete('/:id', userController.delete);
