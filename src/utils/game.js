/**
 * Method to find the winner of the game
 * @param {Array} players - Players of the game
 * @returns {String} - The method returns the id of the player who win the round
 *                     or undefined if the round is tie
 */
const findWinner = async (players) => {
  const player1 = {
    user: (players[0].split(':'))[0],
    choice: (players[0].split(':'))[1],
  };
  const player2 = {
    user: (players[2].split(':'))[0],
    choice: (players[2].split(':'))[1],
  };

  // Rules
  let winner;
  if (player1.choice === player2.choice) {
    winner = undefined;
  } else if (player1.choice === 'ROCK') {
    if (player2.choice === 'PAPER') {
      winner = player2.user;
    } else {
      winner = player1.user;
    }
  } else if (player1.choice === 'PAPER') {
    if (player2.choice === 'SCISOR') {
      winner = player2.user;
    } else {
      winner = player1.user;
    }
  } else if (player1.choice === 'SCISOR') {
    if (player2.choice === 'ROCK') {
      winner = player2.user;
    } else {
      winner = player1.user;
    }
  }

  return winner;
};

module.exports = { findWinner };
