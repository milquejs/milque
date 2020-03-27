import Eventable from './Eventable.js';

const GameLoop = Eventable.assign({
    _animationFrameHandle: null,
    _prevFrameTime: 0,
    start()
    {
        this.emit('start');
        this.run(this._prevFrameTime);
    },
    stop()
    {
        cancelAnimationFrame(this._animationFrameHandle);
        this.emit('stop');
    },
    run(now)
    {
        this._animationFrameHandle = requestAnimationFrame(this.run);

        const dt = now - this._prevFrameTime;
        this._prevFrameTime = now;
        this.emit('update', dt);
    }
});
GameLoop.run = GameLoop.run.bind(GameLoop);

export default GameLoop;