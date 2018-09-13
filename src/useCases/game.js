// External libraries
const _ = require('lodash');

// Errors
const errorNames = require('../errors');

// Entities
const { Game } = require('../entities');

// Game Instance
const GameModel = new Game('game');

// Use cases
const { sendMessage } = require('./room');

// Logger
const logger = require('../logger');

// Events
const events = require('../events');

/**
 * Method to allow the user play the game
 * @param {String} room - Id of room
 * @param {String} player - Id of player
 * @param {String} choice - Choice of player
 */
const playerChoice = async ({ io, room, player, choice }) => {
  if (!(_.includes(['PAPER', 'SCISOR', 'ROCK'], choice.toUpperCase()))) {
   return { error: errorNames.INVALID_OPTION }; 
  }
  // Add play
  await GameModel.add({ room, player, choice });
  // Validate if all players already play
  const gamePlays = await GameModel.read(room);
  if (gamePlays.length === 2) {
    // Find winner
    logger.info('Find winner');
    logger.info(`Game plays: `, gamePlays);
    await sendMessage({
      io,
      room,
      event: events.GAME_WINNER,
      data: { message: 'test message' },
    });
  }


}
module.exports = { playerChoice };
