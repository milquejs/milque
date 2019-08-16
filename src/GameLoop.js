import Eventable from './util/Eventable.js';

class GameLoop
{
    constructor()
    {
        this.handle = 0;
        this.ticks = 0;

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

    run()
    {
        this.handle = requestAnimationFrame(this.run);
        this.emit('update');

        ++this.ticks;
    }
}

Eventable.mixin(GameLoop);

export default GameLoop;