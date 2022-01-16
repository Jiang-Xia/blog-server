module.exports = {
  // pm2 配置
  apps: [
    {
      name: 'blog-serve', // 项目名字,启动后的名字
      script: './dist/main.js', // 执行的文件
      cwd: './', // 根目录
      args: '', // 传递给脚本的参数
      watch: true, // 开启监听文件变动重启
      ignore_watch: ['node_modules', 'public', 'logs'], // 不用监听的文件
      exec_mode: 'cluster_mode',
      instances: '2', // max表示最大的 应用启动实例个数，仅在 cluster 模式有效 默认为 fork
      autorestart: true, // 默认为 true, 发生异常的情况下自动重启
      max_memory_restart: '1G',
      instance_var: 'INSTANCE_ID', // 添加这一行可以实现使用nest-logs包的日志管理
      // error_file: './logs/app-err.log', // 错误日志文件
      // out_file: './logs/app-out.log', // 正常日志文件
      // merge_logs: true, // 设置追加日志而不是新建日志
      // log_date_format: 'YYYY-MM-DD HH:mm:ss', // 指定日志文件的时间格式
      min_uptime: '60s', // 应用运行少于时间被认为是异常启动
      max_restarts: 30, // 最大异常重启次数
      restart_delay: 60, // 异常重启情况下，延时重启时间
      env: {
        // 环境参数，当前指定为开发环境
        NODE_ENV: 'development',
      },
      env_production: {
        // 环境参数,当前指定为生产环境
        NODE_ENV: 'production', //使用production模式 pm2 start ecosystem.config.js --env production
      },
      env_test: {
        // 环境参数,当前为测试环境
        NODE_ENV: 'test',
      },
    },
  ],

  deploy: {
    production: {
      // 登录服务器的用户名
      user: 'root',
      // 服务器ip
      host: '42.192.145.236',
      // 服务器ssh登录端口，未修改的话一般默认为22
      port: '22',
      // 指定拉取的分支
      ref: 'origin/master',
      // 远程仓库地址
      repo: 'git@gitee.com:jiang-xia/blog-server.git',
      // 指定代码拉取到服务器的目录
      path: '/blog/pm2-serve/blog-server',
      ssh_options: 'StrictHostKeyChecking=no',
      'pre-deploy': 'git fetch --all', // 部署前执行
      // 部署后执行
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
