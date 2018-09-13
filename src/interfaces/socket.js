// External libraries
const IO = require('socket.io');
const redisAdapter = require('socket.io-redis');

// Use cases
const { room } = require('../useCases');

// Config
const config = require('../config/redis');

// Logger
const logger = require('../logger');

// Error
const BusinessError = require('../BusinessError');
const errorNames = require('../errors');

// Events
const events = require('../events');

// Models
const { Room } = require('../entities');

// Room model instace
const RoomModel = new Room('room');

/**
 * Method to initialize the socker server
 * @param {Object} server - Http server
 */
const initServer = (server) => {
  // Socket middleware
  server.use(async (socket, next) => {
    const req = socket.request._query;
    const roomId = req.room;
    const playerId = req.player
    if (!roomId || !playerId) {
      return next(new BusinessError(errorNames.PARAMS_REQUIRED, 'rps-realtime-module'));
    }
    socket.client.room = roomId;
    socket.client.player = playerId;
    
    next();
  });
  // Events
  server.on('connection', (socket) => {
    logger.info(`Player connected connected ${socket.client.player}`);

    // Join to room
    socket.on(events.JOIN_ROOM, async (data) => {
      logger.info(`User data: ${data}`);
      await room.joinToRoom({
        socket,
        room: socket.client.room,
        user: socket.client.player,
        player: data,
      });
    });

    socket.on('send_message', (data) => {
      server.sockets.emit('message', { data });
    });

  
    // Disconnect client
    socket.on('disconnect', async () => {
      logger.info(`Disconnect user ${socket.client.player}`);
      await RoomModel.remove({
        room: socket.client.room,
        user: socket.client.player
      });
    });
  });
}

// Create instance for socket io
const io = new IO({}, {
  pingTimeout: 30000,
  pingInterval: 10000,
  maxHttpBufferSize: 10E7,
  transports: ['websocket'],
  allowUpgrades: true,
  perMessageDeflate: true,
  httpCompression: true,
  cookie: 'io',
});

// Catch Redis adapter to Socket.io
io.adapter(redisAdapter({
  host: config.host,
  port: config.port,
}));

// Init server
initServer(io);

/**
 * Method to start the websocker server
 * @param {Number} port - Websocket server port
 */
let createServer;
const StartServer = (port) => {
  logger.info(`Will create a server at port ${port}`);
  // Creating server at port
  if (!createServer) {
    createServer = io.listen(port);
    logger.info('Server Created Success');
  }
};

module.exports = { io, StartServer}