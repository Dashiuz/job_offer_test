import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('api.port');
  const environment = config.get('environment');

  const swaggerConfig = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Apply Digital Test')
      .setDescription(`API test for a job application`)
      .setVersion('1.0')
      .addBearerAuth(
        { name: 'Authorization', scheme: 'Bearer', type: 'http' },
        'Authentication',
      )
      .build(),
  );

  SwaggerModule.setup('api/docs', app, swaggerConfig);

  app.enableCors(config.get('cors'));

  await app.listen(port, () => {
    console.log('🚀 API running on port ', port);
    console.log(`🖥 You're working on environment `, environment);
  });
}
bootstrap();
