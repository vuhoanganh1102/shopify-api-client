import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.setGlobalPrefix('shopify-api-client');
  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: true, // Bắt buộc nếu dùng HTTPS (ngrok)
        sameSite: 'none', // Tránh lỗi khi Shopify lưu OAuth cookie
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
