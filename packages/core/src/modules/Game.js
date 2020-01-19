import { GameLoop } from '../game/GameLoop';

const GAME_LOOPS = new Map();

/**
 * Starts a game loop. This is not required to start a loop, but is
 * here for ease of use.
 * 
 * @example
 * let context = {
 *   start() {
 *     // Start code here...
 *   },
 *   update(dt) {
 *     // Update code here...
 *   }
 * };
 * GameLoop.start(context);
 * 
 * @example
 * GameLoop.start()
 *   .on('start', function start() {
 *     // Start code here...
 *   })
 *   .on('update', function update(dt) {
 *     // Update code here...
 *   });
 * 
 * @example
 * let gameLoop = new GameLoop();
 * gameLoop
 *   .on('start', ...)
 *   .on('update', ...)
 *   .on('stop', ...);
 * 
 * @param {Object} [handle] The handle that refers to the registered game
 * loop. If the handle has not been previously registered, it will
 * register the handle with a new game loop, with the handle serving as
 * both the new game loop's handle and context (only if the handle is
 * an object, otherwise, it will create an empty context).
 * 
 * @returns {GameLoop} The started game loop instance.
 */
export function start(handle = undefined)
{
    let result;
    if (GAME_LOOPS.has(handle))
    {
        throw new Error('Cannot start game loop with duplicate handle.');
    }
    else
    {
        let context;
        if (typeof handle === 'object') context = handle;
        else context = {};

        result = new GameLoop(context);
    }
    GAME_LOOPS.set(handle, result);

    // Start the loop (right after any chained method calls, like event listeners)
    setTimeout(() => result.start(), 0);
    return result;
}

/**
 * Stops a game loop. This is not required to stop a loop, but is
 * here for ease of use.
 */
export function stop(handle)
{
    if (GAME_LOOPS.has(handle))
    {
        let gameLoop = GAME_LOOPS.get(handle);
        gameLoop.stop();
        GAME_LOOPS.delete(handle);
        return gameLoop;
    }

    return null;
}

export function createGameLoop(context = {})
{
    return new GameLoop(context);
}
