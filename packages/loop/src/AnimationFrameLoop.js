/**
 * @template {keyof AnimationFrameEventMap} K
 * @typedef {(this: AnimationFrameLoop, ev: AnimationFrameEventMap[K]) => any} AnimationFrameCallback
 */

/**
 * @typedef {{
 *  "frame": CustomEvent<AnimationFrameDetail>,
 *  "fixedframe": CustomEvent<FixedFrameDetail>,
 *  "postframe": CustomEvent<AnimationFrameDetail>,
 * }} AnimationFrameEventMap
 */

/** @typedef {{ accumulatedTime: number, skippedFrames: number }} FixedFrameDetail */
/** @typedef {{ prevTime: number, currentTime: number, deltaTime: number }} AnimationFrameDetail */

const DEFAULT_MIN_FIXED_FRAMES = 30;
const DEFAULT_MAX_FIXED_FRAMES = 100;

export class AnimationFrameLoop extends EventTarget {

  static now() {
    return document.timeline.currentTime;
  }

  /** Time of last frame in milliseconds */
  prevTime = -1;
  /** Time of current frame in milliseconds */
  currentTime = -1;
  /** Time since last frame in milliseconds */
  deltaTime = 0;

  /** Time accumulated since the last fixed frame in milliseconds */
  accumulatedTime = 0;
  /** Number of frames skipped since last fixed frame */
  skippedFrames = 0;

  /** Number of fixed frames per second */
  fixedFrames = {
    min: 0,
    max: 0,
  };

  #event = new CustomEvent('frame', {
    detail: /** @type {AnimationFrameDetail} */ (this),
  });
  #fixedEvent = new CustomEvent('fixedframe', {
    detail: /** @type {FixedFrameDetail} */ (this),
  });
  #postEvent = new CustomEvent('postframe', {
    detail: /** @type {AnimationFrameDetail} */ (this),
  });

  /**
   * @readonly
   * @protected
   */
  animationFrameProvider;

  /**
   * @protected
   * @type {ReturnType<requestAnimationFrame>}
   */
  handle = 0;

  /**
   * @param {object} [opts]
   * @param {AnimationFrameProvider} [opts.animationFrameProvider]
   * @param {number|{min: number, max: number}} [opts.fixedFrames]
   * @param {() => DOMHighResTimeStamp} [opts.currentTimeProvider]
   */
  constructor(opts = {}) {
    super();

    /** @protected */
    this.animationFrameProvider = opts?.animationFrameProvider ?? window;
    /** @protected */
    this.currentTimeProvider = opts?.currentTimeProvider ?? AnimationFrameLoop.now;

    if (typeof opts?.fixedFrames === 'object') {
      this.fixedFrames.max = Number(opts.fixedFrames.max);
      this.fixedFrames.min = Number(opts.fixedFrames.min);
    } else if (typeof opts?.fixedFrames === 'number') {
      this.fixedFrames.max = this.fixedFrames.min = Number(opts.fixedFrames);
    } else {
      this.fixedFrames.max = DEFAULT_MAX_FIXED_FRAMES;
      this.fixedFrames.min = DEFAULT_MIN_FIXED_FRAMES;
    }

    /** @protected */
    this.next = this.next.bind(this);
    this.start = this.start.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  get running() {
    return this.handle !== 0;
  }

  /**
   * @override
   * @template {keyof AnimationFrameEventMap} K
   * @param {K} type
   * @param {AnimationFrameCallback<K>|EventListenerObject|null} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  addEventListener(type, listener, options) {
    super.addEventListener(type, /** @type {any} */ (listener), options);
  }

  /**
   * @override
   * @template {keyof AnimationFrameEventMap} K
   * @param {K} type
   * @param {AnimationFrameCallback<K>|EventListenerObject|null} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  removeEventListener(type, listener, options) {
    super.removeEventListener(type, /** @type {any} */ (listener), options);
  }

  /** @protected */
  next(now = performance.now()) {
    this.handle = this.animationFrameProvider.requestAnimationFrame(this.next);
    this.prevTime = this.currentTime;
    this.currentTime = now;
    this.deltaTime = this.currentTime - this.prevTime;
    this.dispatchFrame();
    this.dispatchFixedFrames();

    // Update the frame time again, since earlier callbacks might take a while...
    now = performance.now();
    this.currentTime = now;
    this.deltaTime = this.currentTime - this.prevTime;
    this.dispatchPostFrame();
  }

  /** @protected */
  dispatchFrame() {
    this.dispatchEvent(this.#event);
  }

  /** @protected */
  dispatchPostFrame() {
    this.dispatchEvent(this.#postEvent);
  }

  /** @protected */
  dispatchFixedFrames() {
    let i = countAvailableFixedUpdates(this, this.deltaTime, this.fixedFrames.min, this.fixedFrames.max);
    if (i > 0) {
      this.dispatchEvent(this.#fixedEvent);
    }
    // Only emit skipped-frames once.
    this.skippedFrames = 0;
    // ... now do the rest.
    for (; i > 1; --i) {
      this.dispatchEvent(this.#fixedEvent);
    }
  }

  start() {
    this.handle = this.animationFrameProvider.requestAnimationFrame(this.next);
    return this;
  }

  cancel() {
    this.animationFrameProvider.cancelAnimationFrame(this.handle);
    return this;
  }
}

/**
 * @param {{ accumulatedTime: number, skippedFrames: number }} out
 * @param {number} deltaTime
 * @param {number} minUpdatesPerSecond
 * @param {number} maxUpdatesPerSecond
 */
function countAvailableFixedUpdates(
  out,
  deltaTime,
  minUpdatesPerSecond,
  maxUpdatesPerSecond
) {
  let result = out.accumulatedTime + deltaTime;
  const millisPerUpdate = 1_000 / minUpdatesPerSecond;
  const overTime = result - maxUpdatesPerSecond * millisPerUpdate;
  if (overTime > 0) {
    const skippedUpdates = Math.trunc(overTime / millisPerUpdate);
    out.skippedFrames = skippedUpdates;
    result -= skippedUpdates * millisPerUpdate;
  }
  out.accumulatedTime = result % millisPerUpdate;
  return Math.trunc(result / millisPerUpdate);
}
