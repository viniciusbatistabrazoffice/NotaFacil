import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { createRoutes } from './routes';
import { errorHandler } from './middlewares/error-handler';
import { AppDataSource } from './database/data-source';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(createRoutes(AppDataSource));
app.use(errorHandler);
