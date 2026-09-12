import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3001',
  mail: {
    mailjetApiKey: process.env.MAILJET_API_KEY ?? '',
    mailjetSecretKey: process.env.MAILJET_SECRET_KEY ?? '',
    from: process.env.MAIL_FROM ?? 'no-reply@notafacil.com',
    fromName: process.env.MAIL_FROM_NAME ?? 'NotaFacil',
  },
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'notafacil',
    logging: process.env.DB_LOGGING === 'true',
  },
};
