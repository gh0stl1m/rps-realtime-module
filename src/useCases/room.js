// External libraries
const { roomInterface } = require('rps-room-module');

// Errors
const errorNames = require('../errors');

// Logger
const logger = require('../logger');

// Events
const events = require('../events');

// Models
const { Room } = require('../entities');

const RoomModel = new Room('room');

/**
 * Add socket to room
 * @param {Object} socket - Socket id of client
 * @param {String} room - Room id
 * @param {String} user - User id
 * @param {String} player - player number
 */
const joinToRoom = async ({ socket, room, user, player }) => {
  // Creating room
  socket.join(room);
  await RoomModel.add({ room, user });
  // Notify to room module
  if (player === 'player1') {
    roomInterface.AddPlayer({ room, player1: user })
      .then(() => logger.info('Player notified success to room'))
      .catch(err => logger.error(`(rsp-realtime-module): Error in notify player to room ${err.message}`));
  } else {
    roomInterface.AddPlayer({ room, player2: user })
      .then(() => logger.info('Player notified success to room'))
      .catch(err => logger.error(`(rsp-realtime-module): Error in notify player to room ${err.message}`));
  }
};

/**
 * Send event to room
 * @param {Object} io - Socket server instance
 * @param {String} room - Room id
 * @param {String} event - Name of event
 * @param {String} data - Data to send
 * @returns {Object} - The method returns and object with the data sent to the room
 */
const sendMessage = async ({ io, room, event, data }) => {
  if (!room || !event || !data) return { error: errorNames.PARAMS_REQUIRED };
  if (!(event in events)) {
    return { error: errorNames.EVENT_DOES_NOT_EXIST };
  }
  // Send event to room
  await io.sockets.in(room).emit(event, data);

  return {
    message: 'Event sent success',
    event,
    data,
  };
};

module.exports = { joinToRoom, sendMessage };
