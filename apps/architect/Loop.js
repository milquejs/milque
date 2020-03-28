export class Loop
{
    constructor(fixedStepsPerSecond = 60, maxFixedStepsPerFrame = fixedStepsPerSecond * 1.5)
    {
        this._prevTime = 0;
        this._accumulatedTime = 0;

        this._animationFrameHandle = null;
        this.onAnimationFrame = this.onAnimationFrame.bind(this);

        this._fixedTimeStep = 1000 / fixedStepsPerSecond;
        this._maxAccumulatedTime = maxFixedStepsPerFrame * this._fixedTimeStep;

        this._handlers = {
            early: [],
            step: [],
            fixed: [],
            late: [],
        };
    }

    on(event, handler)
    {
        this._handlers[event].push(handler);
        return this;
    }

    off(event, handler)
    {
        let handlers = this._handlers[event];
        let index = handlers.indexOf(handler);
        handlers.splice(index, 1);
        return this;
    }

    emit(event, args)
    {
        for(let handler of this._handlers[event])
        {
            handler.apply(undefined, args);
        }
        return this;
    }

    start()
    {
        this._prevTime = performance.now();
        this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        return this;
    }

    stop()
    {
        cancelAnimationFrame(this._animationFrameHandle);
        return this;
    }

    /** @private */
    onAnimationFrame(now)
    {
        let prev = this._prevTime;
        this._prevTime = now;

        this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        this.emit('early');

        let deltaTime = Math.max(now - prev, 0);
        this.emit('step', [ deltaTime / 1000 ]);

        this._accumulatedTime += deltaTime;
        if (this._accumulatedTime > this._maxAccumulatedTime + this._fixedTimeStep)
        {
            let skippedTime = this._accumulatedTime - this._maxAccumulatedTime;
            console.warn(`Too many updates! Skipping ${Math.floor(skippedTime / this._fixedTimeStep)} update(s)...`);
            this._accumulatedTime = 0;
        }

        while(this._accumulatedTime >= this._fixedTimeStep)
        {
            this._accumulatedTime -= this._fixedTimeStep;
            this.emit('fixed');
        }

        this.emit('late');
    }
}
