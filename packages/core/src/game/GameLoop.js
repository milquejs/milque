/**
 * @module GameLoop
 * @version 1.2
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
 * @description
 * # Changelog
 * 
 * ## 1.2
 * - Fixed incrementing dt on window blur
 * - Fixed large dt on first frame
 * 
 * ## 1.1
 * - Added pause and resume
 * 
 * ## 1.0
 * - Create GameLoop
 */
import * as Eventable from '../util/Eventable.js';

export const INSTANCES = new Map();
export const DEFAULT_FRAME_TIME = 1000 / 60;

/**
 * @typedef {Eventable.Eventable} GameLoop
 * 
 * @property {number} prevFrameTime The time of the previous frame in milliseconds.
 * @property {Object} animationFrameHandle The handle for the animation frame request. Used by cancelAnimationRequest().
 * @property {Object} gameContext The context of the game loop to run in.
 * @property {Object} frameTime The expected time taken per frame.
 * @property {Object} started Whether the game has started.
 * @property {Object} paused Whether the game is paused.
 * 
 * @property {function} run The game loop function itself.
 * @property {function} start Begins the game loop.
 * @property {function} stop Ends the game loop.
 * @property {function} pause Pauses the game loop.
 * @property {function} resume Resumes the game loop.
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
    result.frameTime = DEFAULT_FRAME_TIME;
    result.started = false;
    result.paused = false;

    /** Sets the frame time. Only changes dt; does NOT change how many times update() is called. */
    result.setFrameTime = function setFrameTime(dt)
    {
        this.frameTime = dt;
        return this;
    };

    /** Runs the game loop. Will call itself. */
    result.run = function run(now)
    {
        this.animationFrameHandle = requestAnimationFrame(this.run);
        const dt = (now - this.prevFrameTime) / this.frameTime;
        this.prevFrameTime = now;

        if (typeof this.gameContext.update === 'function') this.gameContext.update.call(this.gameContext, dt);
        this.emit('update', dt);
    }
    .bind(result);

    /** Starts the game loop. Calls run(). */
    result.start = function start()
    {
        if (this.started) throw new Error('Loop already started.');

        // If the window is out of focus, just ignore the time.
        window.addEventListener('focus', this.resume);
        window.addEventListener('blur', this.pause);

        this.prevFrameTime = performance.now();
        this.started = true;

        if (typeof this.gameContext.start === 'function') this.gameContext.start.call(this.gameContext);
        this.emit('start');

        this.run(this.prevFrameTime);
    }
    .bind(result);

    /** Stops the game loop. */
    result.stop = function stop()
    {
        if (!this.started) throw new Error('Loop not yet started.');

        // If the window is out of focus, just ignore the time.
        window.removeEventListener('focus', this.resume);
        window.removeEventListener('blur', this.pause);

        cancelAnimationFrame(this.animationFrameHandle);
        this.animationFrameHandle = null;
        this.started = false;

        if (typeof this.gameContext.stop === 'function') this.gameContext.stop.call(this.gameContext);
        this.emit('stop');
    }
    .bind(result);

    /** Pauses the game loop. */
    result.pause = function pause()
    {
        if (!this.started || this.paused) return;

        cancelAnimationFrame(this.animationFrameHandle);
        this.animationFrameHandle = null;
        this.paused = true;

        if (typeof this.gameContext.pause === 'function') this.gameContext.pause.call(this.gameContext);
        this.emit('pause');
    }
    .bind(result);

    /** Resumes the game loop. */
    result.resume = function resume()
    {
        if (!this.started || !this.pause) return;

        this.prevFrameTime = performance.now();
        this.paused = false;

        if (typeof this.gameContext.resume === 'function') this.gameContext.resume.call(this.gameContext);
        this.emit('resume');

        this.run(this.prevFrameTime);
    }
    .bind(result);

    return result;
}
