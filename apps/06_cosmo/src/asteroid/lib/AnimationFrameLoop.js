/** @typedef {(frameDetail: AnimationFrameLoop) => void} AnimationFrameLoopCallback */

export class AnimationFrameLoop {
    
    /**
     * @param {AnimationFrameLoopCallback} callback 
     * @param {object} [opts]
     * @param {Window} [opts.animationFrameHandler]
     */
    constructor(callback, opts = undefined) {
        const { animationFrameHandler = window } = opts || {};

        /** @type {ReturnType<requestAnimationFrame>} */
        this.handle = 0;
        this.detail = {
            prevTime: -1,
            currentTime: -1,
            deltaTime: 0,
        };

        /** @protected */
        this.animationFrameHandler = animationFrameHandler;

        /** @protected */
        this.callback = callback;

        this.next = this.next.bind(this);
        this.start = this.start.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    
    next(now = performance.now()) {
        this.handle = this.animationFrameHandler.requestAnimationFrame(this.next);
        let d = this.detail;
        d.prevTime = d.currentTime;
        d.currentTime = now;
        d.deltaTime = d.currentTime - d.prevTime;
        this.callback(this);
    }

    start() {
        this.handle = this.animationFrameHandler.requestAnimationFrame(this.next);
        return this;
    }

    cancel() {
        this.animationFrameHandler.cancelAnimationFrame(this.handle);
        return this;
    }
}
