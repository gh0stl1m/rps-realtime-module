// External libraries
const _ = require('lodash');
const { statisticsInterface } = require('rps-user-module');
const { roomInterface } = require('rps-room-module');

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

// Utilities
const { gameUtilities } = require('../utils');

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
  await GameModel.add({ room, player, choice: choice.toUpperCase() });
  // Validate if all players already play
  const gamePlays = await GameModel.read(room);
  if (gamePlays.length === 2) {
    // Find winner
    const playerWinner = await gameUtilities.findWinner(gamePlays);
    if (playerWinner) {
      logger.info(`(rps-realtime-module): Round winner ${playerWinner}`);
      const gameWinner = await roomInterface.AddGameRound({ room, winner: playerWinner, choice });
      if (gameWinner) {
        logger.info(`(rps-realtime-module): Game winner ${gameWinner}`);
        await GameModel.removeList(room);
        const playerGameWinner = (gameWinner.player1.wins === 3) ? gameWinner.player1.user : gameWinner.player2.user;
        const playerGameLooser = (gameWinner.player1.wins <= 3) ? gameWinner.player1.user : gameWinner.player2.user;
        const gameWinnerMessage = await sendMessage({
          io,
          room,
          event: events.GAME_WINNER,
          data: {
            message: 'GAME_WINNER',
            winner: playerGameWinner,
          },
        });
        // Notify user statistics
        // User winner
        statisticsInterface.ReportStatistics(playerGameWinner, 'WIN')
          .then(() => logger.info('(rps-realtime-module): Statistics notified success'))
          .catch(err => logger.error(`(rps-realtime-module): Error in notify statistics ${err.message}`));
        // User defeat
        statisticsInterface.ReportStatistics(playerGameLooser, 'DEFEAT')
          .then(() => logger.info('(rps-realtime-module): Statistics notified success'))
          .catch(err => logger.error(`(rps-realtime-module): Error in notify statistics ${err.message}`));

        return gameWinnerMessage;
      }
      // Restart game
      await GameModel.removeList(room);
      await sendMessage({
        io,
        room,
        event: events.ROUND_WINNER,
        data: {
          message: 'ROUND_WINNER',
          winner: playerWinner,
        },
      });
    } else {
      logger.info('(rps-realtime-module): Round tie');
      // Game Tie
      await GameModel.removeList(room);
      await sendMessage({
        io,
        room,
        event: events.ROUND_TIE,
        data: { message: 'ROUND_TIE' },
      });
    }
  }
  return {
    message: 'completed',
  };
};

module.exports = { playerChoice };
