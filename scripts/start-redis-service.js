const { spawn } = require('child_process');
const path = require('path');

function startRedisService() {
  // 从环境变量获取Redis微服务地址，默认为localhost:50052
  const grpcHost = process.env.REDIS_GRPC_HOST || 'localhost';
  const grpcPort = process.env.REDIS_GRPC_PORT || '50052';
  const grpcUrl = `${grpcHost}:${grpcPort}`;
  
  console.log(`Starting Redis microservice on ${grpcUrl}...`);
  
  // 使用PowerShell运行命令，以解决Windows兼容性问题
  const redisService = spawn('powershell.exe', [
    '-Command', 
    'npx ts-node microservices/redis-service/redis.grpc.server.ts'
  ], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: { ...process.env }
  });

  redisService.on('error', (err) => {
    console.error('Failed to start Redis microservice:', err);
  });

  redisService.on('close', (code) => {
    console.log(`Redis microservice exited with code ${code}`);
  });

  return redisService;
}

// 启动Redis微服务
startRedisService();