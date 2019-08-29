import Eventable from './util/Eventable.js';

class GameLoop
{
    constructor()
    {
        this.handle = 0;
        this.ticks = 0;

        this._prevtime = 0;
        this._running = false;

        this.run = this.run.bind(this);
    }

    hasStarted()
    {
        return this._running;
    }

    start()
    {
        this.emit('start');
        this.handle = requestAnimationFrame(this.run);
        this._prevtime = performance.now();
        this._running = true;
        this.ticks = 0;
        return this;
    }

    stop()
    {
        cancelAnimationFrame(this.handle);
        this.handle = 0;
        this._running = false;
        this.emit('stop');
        return this;
    }

    run(now)
    {
        this.handle = requestAnimationFrame(this.run);
        const dt = now - this._prevtime;
        this.emit('update', dt);
        
        this._prevtime = now;
        ++this.ticks;
    }
}

Eventable.mixin(GameLoop);

export default GameLoop;