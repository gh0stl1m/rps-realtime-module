// Prefix
const prefix = require('./environment');

module.exports = {
  host: process.env[`${prefix}REDIS_HOST`],
  port: process.env[`${prefix}REDIS_PORT`],
  family: process.env[`${prefix}REDIS_FAMILY`],
};
