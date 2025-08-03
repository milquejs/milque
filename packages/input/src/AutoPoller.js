/**
 * @callback OnPollCallback
 * @param {number} now
 *
 * @typedef Pollable
 * @property {OnPollCallback} onPoll
 */

/**
 * A class to automatically call onPoll() on animation frame.
 */
export class AutoPoller {
  /**
   * @param {Pollable} pollable
   */
  constructor(pollable) {
    /** @private */
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    /** @private */
    this.animationFrameHandle = null;
    /** @private */
    this.pollable = pollable;
  }

  get running() {
    return this.animationFrameHandle !== null;
  }

  start() {
    let handle = this.animationFrameHandle;
    if (handle) cancelAnimationFrame(handle);
    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
  }

  stop() {
    let handle = this.animationFrameHandle;
    if (handle) cancelAnimationFrame(handle);
    this.animationFrameHandle = null;
  }

  /** @private */
  onAnimationFrame(now) {
    this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    this.pollable.onPoll(now);
  }
}
