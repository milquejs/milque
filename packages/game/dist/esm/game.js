/**
 * @version 1.4.0
 * @description
 * Handles a steady update loop.
 * 
 * # Changelog
 * ## 1.4.0
 * - Removed Eventable in favor of addEventListener()
 * - Changed GameLoop into a web component
 * ## 1.3.0
 * - Removed frameTime in favor of deltaTimeFactor
 * - Moved static start()/stop() for game loop to modules
 * ## 1.2.0
 * - Fixed incrementing dt on window blur
 * - Fixed large dt on first frame
 * ## 1.1.0
 * - Added pause and resume
 * ## 1.0.0
 * - Create GameLoop
 * 
 * @fires start
 * @fires stop
 * @fires pause
 * @fires resume
 * @fires update
 */
class GameLoop extends HTMLElement
{
    static currentTime() { return performance.now(); }

    constructor(startImmediately = true, controlled = false)
    {
        super();

        this._controlled = controlled;
        this._connectedStart = startImmediately;
        this._animationFrameHandle = null;

        this.prevFrameTime = 0;
        this.started = false;
        this.paused = false;
        this.deltaTimeFactor = 1 / 1000;

        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        this.onWindowFocus = this.onWindowFocus.bind(this);
        this.onWindowBlur = this.onWindowBlur.bind(this);
    }

    setDeltaTimeFactor(value)
    {
        this.deltaTimeFactor = value;
        return this;
    }

    /** @override */
    connectedCallback()
    {
        // If the window is out of focus, just ignore the time.
        window.addEventListener('focus', this.onWindowFocus);
        window.addEventListener('blur', this.onWindowBlur);

        if (this._connectedStart) this.start();
    }

    /** @override */
    disconnectedCallback()
    {
        // If the window is out of focus, just ignore the time.
        window.removeEventListener('focus', this.onWindowFocus);
        window.removeEventListener('blur', this.onWindowBlur);

        this.stop();
    }

    onWindowFocus()
    {
        if (!this.started) return;
        this.resume();
    }

    onWindowBlur()
    {
        if (!this.started) return;
        this.pause();
    }

    /**
     * Runs the game loop. If this is a controlled game loop, it will call itself
     * continuously until stop() or pause().
     */
    onAnimationFrame(now)
    {
        if (this._controlled) throw new Error('Cannot run controlled game loop; call step() instead.');
        if (!this.started) throw new Error('Must be called after start().');

        this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        this.step(now);
    }

    /** Runs one update step for the game loop. This is usually called 60 times a second. */
    step(now = GameLoop.currentTime())
    {
        if (!this.started) return;

        const delta = (now - this.prevFrameTime) * this.deltaTimeFactor;
        this.prevFrameTime = now;
        
        if (this.paused) return;

        this.dispatchEvent(new CustomEvent('update', {
            detail: { delta },
            bubbles: false,
            composed: true
        }));
    }

    /** Starts the game loop. Calls run(), unless recursive is set to false. */
    start()
    {
        if (this.started) throw new Error('Loop already started.');

        this.started = true;
        this.prevFrameTime = GameLoop.currentTime();

        this.dispatchEvent(new CustomEvent('start', {
            bubbles: false,
            composed: true
        }));
        
        if (!this.controlled)
        {
            this.onAnimationFrame(this.prevFrameTime);
        }
    }

    /** Stops the game loop. */
    stop()
    {
        if (!this.started) throw new Error('Loop not yet started.');

        this.started = false;

        this.dispatchEvent(new CustomEvent('stop', {
            bubbles: false,
            composed: true
        }));

        if (!this._controlled)
        {
            if (this.animationFrameHandle)
            {
                cancelAnimationFrame(this.animationFrameHandle);
                this.animationFrameHandle = null;
            }
        }
    }

    /** Pauses the game loop. */
    pause()
    {
        if (this.paused) return;

        this.paused = true;
        
        this.dispatchEvent(new CustomEvent('pause', {
            bubbles: false,
            composed: true
        }));
    }

    /** Resumes the game loop. */
    resume()
    {
        if (!this.pause) return;

        this.paused = false;

        this.dispatchEvent(new CustomEvent('resume', {
            bubbles: false,
            composed: true
        }));
    }
}
window.customElements.define('game-loop', GameLoop);

export { GameLoop };
