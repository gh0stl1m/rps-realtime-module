// External libraries
const IO = require('socket.io');
const redisAdapter = require('socket.io-redis');

// Config
const config = require('../config/redis');

// Logger
const logger = require('../logger');

// Models
const { Room } = require('../entities');

// Model instance
const RoomModel = new Room('room');

/**
 * Method to initialize the socker server
 * @param {Object} server - Http server
 */
const initServer = (server) => {
  // Socket middleware
  server.use((socket, next) => {
    const req = socket.request._query;
    console.log('PARAMS: ', req);
    next();
  });
  // Events
  server.on('connection', (socket) => {
    socket.emit('connected', 'connection established succedd');
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