// Drivers
const { RedisConnection } = require('../drivers');

// Logger
const logger = require('../logger');

/**
 * @class
 * @param {String} name - Name of room
 */
class Room {
  constructor(name) {
    this.name = name;
    this.redis = RedisConnection;
  }
  // Method to add member to room
  async add({ room: roomId, user: userId }) {
    logger.info(`Will add user ${userId} to room ${roomId}`);
    await this.redis.sadd(`${this.name}:${roomId}`, userId);
  }
  // Method to remove member of room
  async remove({ room: roomId, user: userId}) {
    logger.info(`Will remove user ${userId} to room ${roomId}`);
    await this.redis.srem(`${this.name}:${roomId}`, userId);
  }
  // Method to remove room
  async removeList(roomId) {
    logger.info('Will remove list of room: ', roomId);
    await this.redis.del(`${this.name}:${roomId}`);
  }
}

module.exports = Room;