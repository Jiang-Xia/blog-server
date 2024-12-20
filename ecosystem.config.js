module.exports = {
  // pm2 配置
  apps: [
    {
      name: 'blog-server', // 项目名字,启动后的名字
      port: '5000',
      script: './dist/main.js', // 执行的文件
      cwd: './', // 根目录
      args: '', // 传递给脚本的参数
      watch: true, // 开启监听文件变动重启
      ignore_watch: ['node_modules', 'public', 'logs'], // 不用监听的文件
      exec_mode: 'cluster_mode',
      instances: '1',
      /* 
      多核部署会有session重写问题 // max表示最大的 应用启动实例个数，仅在 cluster 模式有效 默认为 fork
      node 中express session用pm2多核部署时，并发大时会造成session被重写。
      https://cnodejs.org/topic/53683f214f5bf53561006824 
      */
      autorestart: true, // 默认为 true, 发生异常的情况下自动重启
      max_memory_restart: '500M',
      error_file: './logs/app-err.log', // 错误日志文件
      out_file: './logs/app-out.log', // 正常日志文件
      merge_logs: true, // 设置追加日志而不是新建日志
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // 指定日志文件的时间格式
      min_uptime: '60s', // 应用运行少于时间被认为是异常启动
      max_restarts: 30, // 最大异常重启次数
      restart_delay: 60, // 异常重启情况下，延时重启时间
      // 环境配置不对可能会导致cookie传输不了
      env: {
        // 环境参数，当前指定为开发环境
        NODE_ENV: 'development',
        PORT: '5000',
      },
      env_production: {
        // 环境参数,当前指定为生产环境
        // 使用production模式 pm2 start ecosystem.config.js --env production
        NODE_ENV: 'production',
        PORT: '5000',
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
      host: '127.0.0.1',
      // 服务器ssh登录端口，未修改的话一般默认为22
      port: '22',
      // 指定拉取的分支
      ref: 'origin/master',
      // 远程仓库地址
      repo: 'git@gitee.com:jiang-xia/blog-server.git',
      // 指定代码拉取到服务器的目录
      path: '/blog/pm2-serve',
      ssh_options: 'StrictHostKeyChecking=no',
      'pre-deploy': 'git fetch --all', // 部署前执行
      // 部署后执行
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
