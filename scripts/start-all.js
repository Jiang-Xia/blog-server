const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

function checkPort(port, host = 'localhost', timeout = 5000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      socket.end();
      resolve(false);
    }, timeout);

    const socket = new net.Socket();

    const cleanUp = () => {
      clearTimeout(timer);
      socket.destroy();
    };

    socket.connect(port, host, () => {
      cleanUp();
      resolve(true);
    });

    socket.on('error', () => {
      cleanUp();
      resolve(false);
    });
  });
}

function startRedisService() {
  console.log('Starting Redis microservice on localhost:50052...');
  
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

  return redisService;
}

function startMainApp() {
  console.log('Starting main application...');
  
  const mainApp = spawn('powershell.exe', [
    '-Command',
    'npx nest start'
  ], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: { ...process.env }
  });

  mainApp.on('error', (err) => {
    console.error('Failed to start main application:', err);
  });

  return mainApp;
}

async function startAllServices() {
  // 启动Redis微服务
  const redisService = startRedisService();

  // 等待Redis服务就绪
  console.log('Waiting for Redis microservice to be ready...');
  const checkInterval = setInterval(async () => {
    const isReady = await checkPort(50052);
    if (isReady) {
      clearInterval(checkInterval);
      console.log('Redis microservice is ready. Starting main application...');
      
      // 启动主应用
      startMainApp();
    }
  }, 2000);
}

// 启动所有服务
startAllServices();