/**
 * @module GameLoop
 * @version 1.0
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
 */
import * as Eventable from './Eventable.js';

export const INSTANCES = new Map();

/**
 * @typedef {Eventable.Eventable} GameLoop
 * 
 * @property {number} prevFrameTime The time of the previous frame in milliseconds.
 * @property {Object} animationFrameHandle The handle for the animation frame request. Used by cancelAnimationRequest().
 * @property {Object} gameContext The context of the game loop to run in.
 * 
 * @property {function} run The game loop function itself.
 * @property {function} start Begins the game loop.
 * @property {function} stop Ends the game loop.
 */

/**
 * Starts a game loop.
 * 
 * @param {Object} [handle] The handle that refers to the registered game
 * loop. If the handle has not been previously registered, it will
 * register the handle with a new game loop, with the handle serving as
 * both the new game loop's handle and context (only if the handle is
 * an object, otherwise, it will create an empty context).
 * @returns {GameLoop} The started game loop instance.
 */
export function start(handle = undefined)
{
    let gameLoop;
    if (INSTANCES.has(handle))
    {
        gameLoop = INSTANCES.get(handle);
    }
    else
    {
        let context;
        if (typeof handle === 'object') context = handle;
        else context = {};

        gameLoop = registerGameLoop(context, handle);
    }

    // Start the loop (right after any chained method calls, like event listeners)
    setTimeout(() => gameLoop.start(), 0);
    
    return gameLoop;
}

/**
 * Stops a game loop.
 * 
 * @param {Object} [handle] The handle that refers to the registered game loop.
 * @returns {GameLoop} The stopped game loop instance or null if no game loop
 * was found with handle.
 */
export function stop(handle)
{
    if (INSTANCES.has(handle))
    {
        let gameLoop = INSTANCES.get(handle);
        gameLoop.stop();
        return gameLoop;
    }

    return null;
}

export function registerGameLoop(context = {}, handle = context)
{
    const gameLoop = createGameLoop(context);
    INSTANCES.set(handle, gameLoop);
    return gameLoop;
}

export function createGameLoop(context = {})
{
    const result = Eventable.create(context);
    result.prevFrameTime = 0;
    result.animationFrameHandle = null;
    result.gameContext = context;

    /** Runs the game loop. Will call itself. */
    result.run = function run(now)
    {
        this.animationFrameHandle = requestAnimationFrame(this.run);
        const dt = now - this.prevFrameTime;
        this.prevFrameTime = now;

        if (typeof this.gameContext.update === 'function') this.gameContext.update.call(this.gameContext, dt);
        this.emit('update', dt);
    }
    .bind(result);

    /** Starts the game loop. Calls run(). */
    result.start = function start()
    {
        this.prevFrameTime = 0;
        if (typeof this.gameContext.start === 'function') this.gameContext.start.call(this.gameContext);
        this.emit('start');

        this.run(0);
    }
    .bind(result);

    /** Stops the game loop. */
    result.stop = function stop()
    {
        cancelAnimationFrame(this.animationFrameHandle);
        this.animationFrameHandle = null;

        if (typeof this.gameContext.stop === 'function') this.gameContext.stop.call(this.gameContext);
        this.emit('stop');
    }
    .bind(result);
    return result;
}
