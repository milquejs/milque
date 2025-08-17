declare class AnimationFrameLoop extends EventTarget {
    static now(): CSSNumberish | null;
    /**
     * @param {object} [opts]
     * @param {AnimationFrameProvider} [opts.animationFrameProvider]
     * @param {number|{min: number, max: number}} [opts.fixedFrames]
     * @param {() => DOMHighResTimeStamp} [opts.currentTimeProvider]
     */
    constructor(opts?: {
        animationFrameProvider?: AnimationFrameProvider | undefined;
        fixedFrames?: number | {
            min: number;
            max: number;
        } | undefined;
        currentTimeProvider?: (() => DOMHighResTimeStamp) | undefined;
    });
    /** Time of last frame in milliseconds */
    prevTime: number;
    /** Time of current frame in milliseconds */
    currentTime: number;
    /** Time since last frame in milliseconds */
    deltaTime: number;
    /** Time accumulated since the last fixed frame in milliseconds */
    accumulatedTime: number;
    /** Number of frames skipped since last fixed frame */
    skippedFrames: number;
    /** Number of fixed frames per second */
    fixedFrames: {
        min: number;
        max: number;
    };
    /**
     * @readonly
     * @protected
     */
    protected readonly animationFrameProvider: AnimationFrameProvider;
    /**
     * @protected
     * @type {ReturnType<requestAnimationFrame>}
     */
    protected handle: ReturnType<typeof requestAnimationFrame>;
    /** @protected */
    protected currentTimeProvider: typeof AnimationFrameLoop.now;
    /** @protected */
    protected next(now?: number): void;
    start(): this;
    cancel(): this;
    get running(): boolean;
    /**
     * @override
     * @template {keyof AnimationFrameEventMap} K
     * @param {K} type
     * @param {AnimationFrameCallback<K>|EventListenerObject|null} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    override addEventListener<K extends keyof AnimationFrameEventMap>(type: K, listener: AnimationFrameCallback<K> | EventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
    /**
     * @override
     * @template {keyof AnimationFrameEventMap} K
     * @param {K} type
     * @param {AnimationFrameCallback<K>|EventListenerObject|null} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    override removeEventListener<K extends keyof AnimationFrameEventMap>(type: K, listener: AnimationFrameCallback<K> | EventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
    /** @protected */
    protected dispatchFrame(): void;
    /** @protected */
    protected dispatchPostFrame(): void;
    /** @protected */
    protected dispatchFixedFrames(): void;
    #private;
}
type AnimationFrameCallback<K extends keyof AnimationFrameEventMap> = (this: AnimationFrameLoop, ev: AnimationFrameEventMap[K]) => any;
type AnimationFrameEventMap = {
    "frame": CustomEvent<AnimationFrameDetail>;
    "fixedframe": CustomEvent<FixedFrameDetail>;
    "postframe": CustomEvent<AnimationFrameDetail>;
};
type FixedFrameDetail = {
    accumulatedTime: number;
    skippedFrames: number;
};
type AnimationFrameDetail = {
    prevTime: number;
    currentTime: number;
    deltaTime: number;
};

export { AnimationFrameLoop };
export type { AnimationFrameCallback, AnimationFrameDetail, AnimationFrameEventMap, FixedFrameDetail };
