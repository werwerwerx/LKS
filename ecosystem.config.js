module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      cwd: './app',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'image-server',
      cwd: './image-server',
      script: 'file-server.js',
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
} 