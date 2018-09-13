// Drivers
const { RedisConnection } = require('../drivers');

// Logger
const logger = require('../logger');

/**
 * @class
 * @param {String} name - Name of game
 */
class Room {
  constructor(name) {
    this.name = name;
    this.redis = RedisConnection;
  }
  // Method to add member to room
  async add({ room: roomId, player: userId, choice }) {
    logger.info(`(rps-realtime-module): Will add user ${userId} to game ${roomId}`);
    await this.redis.sadd(`${this.name}:${roomId}`, `${userId}:${choice}`);
  }
  async read(roomId) {
    logger.info(`(rps-realtime-module): Will read members of game ${roomId}`);
    await this.redis.smembers(`${this.name}:${roomId}`);

  }
  // Method to remove member of room
  async remove({ room: roomId, user: userId, choice }) {
    logger.info(`(rps-realtime-module): Will remove user ${userId} to room ${roomId}`);
    await this.redis.srem(`${this.name}:${roomId}`, `${userId}:${choice}`);
  }
  // Method to remove room
  async removeList(roomId) {
    logger.info('(rps-realtime-module): Will remove list of room: ', roomId);
    await this.redis.del(`${this.name}:${roomId}`);
  }
}

module.exports = Room;