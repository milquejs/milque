import * as Eventable from '../util/Eventable.js';

export const DEFAULT_FRAME_TIME = 1000 / 60;

const INSTANCES = new Map();

/**
 * @version 1.2
 * @description
 * Handles a steady update loop.
 * 
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
 * 
 * @property {Number} prevFrameTime The time of the previous frame in milliseconds.
 * @property {Object} animationFrameHandle The handle for the animation frame request. Used by cancelAnimationRequest().
 * @property {Object} gameContext The context of the game loop to run in.
 * @property {Object} frameTime The expected time taken per frame.
 * @property {Object} started Whether the game has started.
 * @property {Object} paused Whether the game is paused.
 * 
 * @fires start
 * @fires stop
 * @fires pause
 * @fires resume
 * @fires update
 */
export class GameLoop
{
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
    static start(handle = undefined)
    {
        let result;
        if (INSTANCES.has(handle))
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
        INSTANCES.set(handle, result);

        // Start the loop (right after any chained method calls, like event listeners)
        setTimeout(() => result.start(), 0);
        return result;
    }

    /**
     * Stops a game loop. This is not required to stop a loop, but is
     * here for ease of use.
     */
    static stop(handle)
    {
        if (INSTANCES.has(handle))
        {
            let gameLoop = INSTANCES.get(handle);
            gameLoop.stop();
            INSTANCES.delete(handle);
            return gameLoop;
        }

        return null;
    }

    constructor(context = {})
    {
        this.prevFrameTime = 0;
        this.animationFrameHandle = null;
        this.frameTime = DEFAULT_FRAME_TIME;
        this.started = false;
        this.paused = false;

        this.gameContext = context;

        this.run = this.run.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);

        // HACK: This overrides Eventable's callback context.
        this.__context = context;
    }

    /** Sets the frame time. Only changes dt; does NOT change how many times update() is called. */
    setFrameTime(frameTime)
    {
        this.frameTime = frameTime;
        return this;
    }

    /** Runs the game loop. Will call itself. */
    run(now)
    {
        this.animationFrameHandle = requestAnimationFrame(this.run);
        const dt = (now - this.prevFrameTime) / this.frameTime;
        this.prevFrameTime = now;

        if (typeof this.gameContext.update === 'function') this.gameContext.update.call(this.gameContext, dt);
        this.emit('update', dt);
    }

    /** Starts the game loop. Calls run(). */
    start()
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

    /** Stops the game loop. */
    stop()
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

    /** Pauses the game loop. */
    pause()
    {
        if (!this.started || this.paused) return;

        cancelAnimationFrame(this.animationFrameHandle);
        this.animationFrameHandle = null;
        this.paused = true;

        if (typeof this.gameContext.pause === 'function') this.gameContext.pause.call(this.gameContext);
        this.emit('pause');
    }

    /** Resumes the game loop. */
    resume()
    {
        if (!this.started || !this.pause) return;

        this.prevFrameTime = performance.now();
        this.paused = false;

        if (typeof this.gameContext.resume === 'function') this.gameContext.resume.call(this.gameContext);
        this.emit('resume');

        this.run(this.prevFrameTime);
    }
}
Eventable.mixin(GameLoop);
