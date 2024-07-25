module.exports = {
  apps: [{
    name: "index",
    script: "index.js",
    error_file: "/var/log/pm2/error.log",
    out_file: "/var/log/pm2/pm2.log",
    watch: true,
    env: {
      NODE_ENV: 'Your-ENV'
    }
  }]
};
