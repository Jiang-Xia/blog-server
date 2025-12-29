// Redis gRPC module
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisClientService } from './redis-client.service';
import * as path from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_GRPC_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'redis',
          protoPath: path.join(process.cwd(), 'proto/redis.proto'),
          url: process.env.REDIS_GRPC_URL || 'localhost:50052', // 默认连接到Redis微服务
          // 添加连接选项以提高可靠性
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
          },
        },
      },
    ]),
  ],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisGrpcModule {}
