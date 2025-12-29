import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { RedisServerModule } from './redis-server.module';
import * as path from 'path';

async function bootstrap() {
  const grpcHost = process.env.REDIS_GRPC_HOST || '0.0.0.0';
  const grpcPort = process.env.REDIS_GRPC_PORT || '50052';
  const grpcUrl = `${grpcHost}:${grpcPort}`;

  const app = await NestFactory.createMicroservice(RedisServerModule, {
    transport: Transport.GRPC,
    options: {
      package: 'redis',
      protoPath: path.join(process.cwd(), 'proto/redis.proto'),
      url: grpcUrl,
    },
  });

  await app.listen();
  console.log(`Redis gRPC microservice is running on ${grpcUrl}`);
}

bootstrap();
