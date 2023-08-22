/**
 * @typedef {(frameDetail: AnimationFrameLoop) => void} AnimationFrameLoopCallback
 */

export class AnimationFrameLoop {
  /**
   * @param {object} [opts]
   * @param {AnimationFrameLoopCallback} [opts.callback]
   * @param {Window} [opts.animationFrameSource]
   */
  constructor(opts = {}) {
    const { callback = () => {}, animationFrameSource = window } = opts;

    /** @type {ReturnType<requestAnimationFrame>} */
    this.handle = 0;
    this.detail = new AnimationFrameDetail();

    /** @protected */
    this.animationFrameSource = animationFrameSource;

    /** @protected */
    this.callback = callback;

    this.next = this.next.bind(this);
    this.start = this.start.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  get running() {
    return this.handle !== 0;
  }

  /** @protected */
  next(now = performance.now()) {
    this.handle = this.animationFrameSource.requestAnimationFrame(this.next);
    let d = this.detail;
    d.prevTime = d.currentTime;
    d.currentTime = now;
    d.deltaTime = d.currentTime - d.prevTime;
    this.callback(this);
  }

  /**
   * @param {AnimationFrameLoopCallback} [callback]
   */
  start(callback = undefined) {
    if (typeof callback !== 'undefined') {
      this.callback = callback;
    }
    this.handle = this.animationFrameSource.requestAnimationFrame(this.next);
    return this;
  }

  cancel() {
    this.animationFrameSource.cancelAnimationFrame(this.handle);
    return this;
  }
}

export class AnimationFrameDetail {
  prevTime = -1;
  currentTime = -1;
  deltaTime = 0;
}
