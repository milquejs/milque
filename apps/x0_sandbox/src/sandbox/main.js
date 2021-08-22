/**
 * @typedef {import('../game/Game.js').Game} Game
 */

/**
 * @param {Game} game 
 */
export async function main(game)
{
    game.on('frame', () => {
        // Do something.
    });
}
