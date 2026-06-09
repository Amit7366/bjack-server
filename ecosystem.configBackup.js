module.exports = {
  apps: [
    {
      name: 'bm24-api',
      script: './dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: { NODE_ENV: 'production', PORT: 5000 },
      max_memory_restart: '400M',
    },
    {
      name: 'callback-worker',
      script: './dist/app/GameCallback/queue/callbackQueue.consumer.js',
      instances: 2,
      exec_mode: 'fork',
      watch: false,
      env: { NODE_ENV: 'production' },
      max_memory_restart: '400M',
    },
  ],
};
