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

function startMainApp() {
  // 从环境变量获取Redis微服务地址，默认为localhost:50052
  const redisGrpcUrl = process.env.REDIS_GRPC_URL || 'localhost:50052';
  const [host, port] = redisGrpcUrl.split(':');
  const redisHost = host || 'localhost';
  const redisPort = parseInt(port) || 50052;
  
  console.log(`Waiting for Redis microservice to be ready on ${redisGrpcUrl}...`);
  
  // 检查Redis服务是否就绪
  const checkInterval = setInterval(async () => {
    const isReady = await checkPort(redisPort, redisHost);
    if (isReady) {
      clearInterval(checkInterval);
      console.log('Redis microservice is ready. Starting main application...');
      
      // 启动主应用
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

      mainApp.on('close', (code) => {
        console.log(`Main application exited with code ${code}`);
      });
    }
  }, 2000); // 每2秒检查一次
}

// 启动主应用
startMainApp();