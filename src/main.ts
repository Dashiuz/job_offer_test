import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('api.port') || 3000;
  const environment = config.get<string>('environment');

  const swaggerConfig = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Apply Digital Test')
      .setDescription(`API test for a job application`)
      .setVersion('1.0')
      .addBearerAuth(
        {
          name: 'Authorization',
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT',
          in: 'header',
          description: 'Paste your access token',
        },
        'access-token',
      )
      .build(),
  );

  SwaggerModule.setup('api/docs', app, swaggerConfig, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.enableCors(config.get('cors'));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port, () => {
    console.log('🚀 API running on port ', port);
    console.log(`🖥 You're working on environment `, environment);
  });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
