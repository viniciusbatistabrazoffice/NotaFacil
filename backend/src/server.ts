import 'reflect-metadata';
import { AppDataSource } from './database/data-source';
import { app } from './app';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

bootstrap();
