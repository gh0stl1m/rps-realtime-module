// External libraries
const Redis = require('ioredis');

// Logger
const logger = require('../logger');

// Config
const config = require('../config/redis');

const redis = new Redis(config);

// Events
redis.on('connect', () => logger.info('Connection oppened with redis'));
redis.on('error', err => logger.error(`Error trying to connect to redis ${err.message}`));

module.exports = redis;
