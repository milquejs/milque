/**
 * @typedef {CustomEvent} FrameEvent
 * @property {number} detail.now
 * The current time in milliseconds.
 * @property {number} detail.prevTime
 * The previous frame time in milliseconds.
 * @property {number} detail.deltaTime
 * The time taken between the current and previous
 * frame in milliseconds.
 * @property {HTMLCanvasElement} detail.canvas
 * The canvas element.
 */
/**
 * @typedef {MODE_CENTER
 *          |MODE_FIT
 *          |MODE_NOSCALE
 *          |MODE_SCALE
 *          |MODE_FILL
 *          |MODE_STRETCH} DisplayScaling
 */
/**
 * A canvas that can scale and stretch with respect to the aspect ratio to fill
 * the viewport size.
 *
 * To start drawing, you should get the canvas context like so:
 *
 * For Canvas2D:
 * ```
 * const display = document.querySelector('display-port');
 * const ctx = display.canvas.getContext('2d');
 * ctx.drawText(0, 0, 'Hello World!');
 * ```
 *
 * For WebGL:
 * ```
 * const display = document.querySelector('display-port');
 * const gl = display.canvas.getContext('webgl');
 * gl.clear(gl.COLOR_BUFFER_BIT);
 * ```
 *
 * Usually, you would want to set the `width` and `height` attributes to define
 * the canvas size and aspect ratio in pixels. You can also change the scaling
 * behavior by setting the `mode` attribute.
 *
 * And for convenience, this element also dispatches a `frame` event every animation
 * frame (60 fps). This is basically the same as calling `requestAnimationFrame()`.
 *
 * NOTE: The viewport size is usually the parent container size. However, in the
 * rare case the element must be nested in a child container, you can define the
 * boolean attribute `full` to force the dimensions to be the actual window size.
 */
declare class DisplayPort extends HTMLElement {
    static define(customElements?: CustomElementRegistry): void;
    /**
     * @protected
     * Override for web component.
     */
    protected static get observedAttributes(): string[];
    set mode(arg: DisplayScaling);
    /**
     * The scaling mode.
     * - `noscale`: Do not perform scaling.
     * - `center`: Do not perform scaling but stretch the display to fill the entire
     * viewport. The unscaled canvas is centered.
     * - `fit`: Resize resolution to fill the entire viewport and maintains the aspect
     * ratio. The pixel resolution is changed. This is the default behavior.
     * - `fill`: Resize resolution to fill the entire viewport but does not maintain
     * aspect ratio.
     * - `stretch`: Perform scaling to fill the entire viewport but does not maintain
     * aspect ratio.
     * - `scale`: Perform scaling to fill the entire viewport and maintains the
     * aspect ratio and resolution. The pixel resolution remains constant.
     * @returns {DisplayScaling} The current scaling mode.
     */
    get mode(): DisplayScaling;
    set debug(arg: boolean);
    /**
     * Set to true for debug information.
     * @returns {boolean}
     */
    get debug(): boolean;
    set disabled(arg: boolean);
    /**
     * If disabled, animation frames will not fire.
     * @returns {boolean}
     */
    get disabled(): boolean;
    set width(arg: number);
    /**
     * The canvas width in pixels. This determines the aspect ratio and canvas buffer size.
     * @returns {number}
     */
    get width(): number;
    set height(arg: number);
    /**
     * The canvas height in pixels. This determines the aspect ratio and canvas buffer size.
     */
    get height(): number;
    set onframe(arg: any);
    /** Fired every animation frame. */
    get onframe(): any;
    _onframe: any;
    /** @private */
    private _canvasElement;
    /**
     * @private
     * @type {HTMLDivElement}
     */
    private _contentElement;
    /**
     * @private
     * @type {HTMLSlotElement}
     */
    private _innerElement;
    /** @private */
    private _titleElement;
    /** @private */
    private _fpsElement;
    /** @private */
    private _dimensionElement;
    /** @private */
    private _debug;
    /** @private */
    private _disabled;
    /** @private */
    private _width;
    /** @private */
    private _height;
    /** @private */
    private _animationRequestHandle;
    /** @private */
    private _prevAnimationFrameTime;
    /** @private */
    private _resizeTimeoutHandle;
    /** @private */
    private _resizeCanvasWidth;
    /** @private */
    private _resizeCanvasHeight;
    /** @private */
    private _frameEvent;
    /** @private */
    private _resizeEvent;
    /** @private */
    private update;
    /** @private */
    private onDelayCanvasResize;
    /** Get the canvas element. */
    get canvas(): HTMLCanvasElement;
    /**
     * @protected
     * Override for web component.
     */
    protected connectedCallback(): void;
    /**
     * @protected
     * Override for web component.
     */
    protected disconnectedCallback(): void;
    /**
     * @protected
     * Override for web component.
     */
    protected attributeChangedCallback(attribute: any, prev: any, value: any): void;
    /**
     * @param {'2d'|'webgl'|'webgl2'} [contextId]
     * @param {CanvasRenderingContext2DSettings} [options]
     */
    getContext(contextId?: '2d' | 'webgl' | 'webgl2', options?: CanvasRenderingContext2DSettings): RenderingContext;
    /** Pause animation of the display frames. */
    pause(): void;
    /** Resume animation of the display frames. */
    resume(): void;
    delayCanvasResize(canvasWidth: any, canvasHeight: any): void;
    /** @private */
    private updateCanvasSize;
}
type DisplayScaling = "center" | "fit" | "noscale" | "scale" | "fill" | "stretch";

export { DisplayPort };
