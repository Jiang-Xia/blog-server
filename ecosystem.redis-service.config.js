module.exports = {
  apps: [
    {
      name: 'redis-microservice-dev',
      script: './microservices/redis-service/redis.grpc.server.ts',
      interpreter: './node_modules/.bin/ts-node',
      interpreter_args: '-r tsconfig-paths/register',
      instances: 1,
      exec_mode: 'fork',
      env_file: './.env.production',  // 使用现有的环境配置文件，也可以根据需要改为./.env或./.env.development
      env: {
        NODE_ENV: 'production',
        REDIS_GRPC_HOST: process.env.REDIS_GRPC_HOST || '0.0.0.0',
        REDIS_GRPC_PORT: process.env.REDIS_GRPC_PORT || '50052',
      },
      error_file: './logs/redis-service-err.log',
      out_file: './logs/redis-service-out.log',
      log_file: './logs/redis-service-combined.log',
      time: true,
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: '10s',
      autorestart: true,
    },
    {
      name: 'redis-microservice-prod',
      script: './dist/microservices/redis-service/redis.grpc.server.js',
      instances: 1,
      exec_mode: 'fork',
      env_file: './.env.production',  // 使用现有的环境配置文件，也可以根据需要改为./.env或./.env.development
      env: {
        NODE_ENV: 'production',
        REDIS_GRPC_HOST: process.env.REDIS_GRPC_HOST || '0.0.0.0',
        REDIS_GRPC_PORT: process.env.REDIS_GRPC_PORT || '50052',
      },
      error_file: './logs/redis-service-err.log',
      out_file: './logs/redis-service-out.log',
      log_file: './logs/redis-service-combined.log',
      time: true,
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: '10s',
      autorestart: true,
    }
  ]
};