const MAX_FIXED_UPDATES = 250;

export class Application
{
    onStart() {}
    onStop() {}

    onPreUpdate(dt) {}
    onUpdate(dt) {}
    onFixedUpdate() {}
    onPostUpdate(dt) {}

    onPause() {}
    onResume() {}
}

export class ApplicationLoop
{
    static currentTime() { return performance.now(); }

    static start(app)
    {
        let result = new ApplicationLoop(app, false);
        result.start();
        return result;
    }

    constructor(app, controlled = false)
    {
        this.app = app;

        this._controlled = controlled;
        this._animationFrameHandle = null;

        this.prevFrameTime = 0;
        this.started = false;
        this.paused = false;
        this.fixedTimeStep = 1 / 60;
        this.prevAccumulatedTime = 0;

        this._onstart = null;
        this._onstop = null;
        this._onpreupdate = null;
        this._onupdate = null;
        this._onfixedupdate = null;
        this._onpostupdate = null;
        this._onpause = null;
        this._onresume = null;

        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        this.onWindowFocus = this.onWindowFocus.bind(this);
        this.onWindowBlur = this.onWindowBlur.bind(this);
    }

    setFixedUpdatesPerSecond(count)
    {
        this.fixedTimeStep = 1 / count;
        return this;
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
    step(now = ApplicationLoop.currentTime())
    {
        if (!this.started) return false;

        const deltaTime = now - this.prevFrameTime;
        this.prevFrameTime = now;
        
        if (this.paused) return false;

        this.app.onPreUpdate(deltaTime);
        this.app.onUpdate(deltaTime);

        this.prevAccumulatedTime += deltaTime / 1000;
        if (this.prevAccumulatedTime > MAX_FIXED_UPDATES * this.fixedTimeStep)
        {
            let max = MAX_FIXED_UPDATES * this.fixedTimeStep;
            let count = Math.floor((this.prevAccumulatedTime - max) / this.fixedTimeStep);
            this.prevAccumulatedTime = max;
            console.error(`[ApplicationLoop] Too many updates! Skipped ${count} fixed updates.`);
        }

        while(this.prevAccumulatedTime >= this.fixedTimeStep)
        {
            this.prevAccumulatedTime -= this.fixedTimeStep;
            this.app.onFixedUpdate();
        }

        this.app.onPostUpdate(deltaTime);
    }

    /** Starts the game loop. Calls run(), unless recursive is set to false. */
    start()
    {
        if (this.started) throw new Error('Loop already started.');

        // If the window is out of focus, just ignore the time.
        window.addEventListener('focus', this.onWindowFocus);
        window.addEventListener('blur', this.onWindowBlur);

        this.started = true;
        this.prevFrameTime = ApplicationLoop.currentTime();

        this.app.onStart();
        
        if (!this.controlled)
        {
            this.onAnimationFrame(this.prevFrameTime);
        }
    }

    /** Stops the game loop. */
    stop()
    {
        if (!this.started) throw new Error('Loop not yet started.');
        
        // If the window is out of focus, just ignore the time.
        window.removeEventListener('focus', this.onWindowFocus);
        window.removeEventListener('blur', this.onWindowBlur);

        this.started = false;

        this.app.onStop();

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
        
        this.app.onPause();
    }

    /** Resumes the game loop. */
    resume()
    {
        if (!this.pause) return;

        // This is an intentional frame skip (due to pause).
        this.prevFrameTime = ApplicationLoop.currentTime();

        this.paused = false;

        this.app.onResume();
    }
}
