module.exports = {
  apps: [
    {
      name: 'sqrl-api',
      cwd: './backend',
      script: 'src/index.js',
      watch: false,
      env: { PORT: 4000 }
    },
    {
      name: 'sqrl-frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      watch: false
    }
  ]
};
