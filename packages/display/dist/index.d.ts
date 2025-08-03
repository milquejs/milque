/**
 * No scaling is applied. The canvas size maintains a
 * 1:1 pixel ratio to the defined display dimensions.
 */
declare const MODE_NOSCALE: "noscale";
/**
 * No scaling is applied, but the element fills the
 * entire viewport. The canvas size maintains a 1:1
 * pixel ratio to the defined display dimensions and
 * is centered inside the scaled element.
 */
declare const MODE_CENTER: "center";
/**
 * Scales the canvas to fill the entire viewport and
 * maintains the same aspect ratio. This will adjust
 * canvas resolution to fit the viewport dimensions.
 * In other words, the canvas pixel size remains
 * constant, but the number of pixels in the canvas
 * will increase or decrease to compensate. This is
 * the default scaling mode.
 */
declare const MODE_FIT: "fit";
/**
 * Scales the canvas to fill the entire viewport and
 * maintains the same aspect ratio and pixel
 * resolution. This will upscale and downscale the
 * pixel size depending on the viewport dimentions
 * in order to preserve the canvas pixel count. In
 * other words, the number of pixels in the canvas
 * remain constant but appear larger or smaller to
 * compensate.
 */
declare const MODE_SCALE: "scale";
/**
 * Resizes the canvas to fill the entire viewport.
 * This does not maintain the aspect ratio nor pixel
 * count (adds and removes pixels to fill size). If you
 * care about aspect ratio but not pixel count, consider
 * using 'fit' mode instead.
 */
declare const MODE_FILL: "fill";
/**
 * Scales the canvas to fill the entire viewport.
 * This does not maintain the aspect ratio but
 * does preserve pixel count (by stretching the pixel
 * size). If you care about aspect ratio and pixel
 * count, consider using 'scale' mode instead.
 */
declare const MODE_STRETCH: "stretch";
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
 * @typedef {MODE_CENTER|MODE_FIT|MODE_NOSCALE|MODE_SCALE|MODE_FILL|MODE_STRETCH} DisplayScaling
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
    /**
     * @param {object} [opts]
     * @param {HTMLElement} [opts.root]
     * @param {string} [opts.id]
     * @param {DisplayScaling} [opts.mode]
     * @param {number} [opts.width]
     * @param {number} [opts.height]
     * @param {boolean} [opts.debug]
     */
    static create(opts?: {
        root?: HTMLElement;
        id?: string;
        mode?: DisplayScaling;
        width?: number;
        height?: number;
        debug?: boolean;
    }): DisplayPort;
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
    /**
     * @private
     * @type {HTMLCanvasElement}
     */
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
    /**
     * @private
     * @param {Event} e
     */
    private onSlotChange;
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
type FrameEvent = CustomEvent;
type DisplayScaling = "center" | "fit" | "noscale" | "scale" | "fill" | "stretch";

/**
 * @typedef {SIZING_NONE|SIZING_CONTAINER|SIZING_VIEWPORT|string} SizingMode
 */
/**
 * @typedef {SCALING_NOSCALE|SCALING_SCALE|SCALING_FILL|SCALING_FIT|SCALING_STRETCH} ScalingMode
 */
/**
 * A canvas wrapper to scale and stretch with respect to the aspect ratio to fill the viewport or container.
 */
declare class FlexCanvas extends HTMLElement {
    /**
     * @param {object} [opts]
     * @param {HTMLElement} [opts.root]
     * @param {string} [opts.id]
     * @param {ScalingMode} [opts.scaling]
     * @param {SizingMode} [opts.sizing]
     * @param {number} [opts.width]
     * @param {number} [opts.height]
     */
    static create(opts?: {
        root?: HTMLElement;
        id?: string;
        scaling?: ScalingMode;
        sizing?: SizingMode;
        width?: number;
        height?: number;
    }): FlexCanvas;
    static define(customElements?: CustomElementRegistry): void;
    /**
     * @protected
     * Override for web component.
     */
    protected static get observedAttributes(): string[];
    set scaling(arg: ScalingMode);
    /**
     * The scaling mode.
     * - `noscale`: Do not perform scaling.
     * - `fit`: Resize resolution to fill the entire viewport and maintains the aspect
     * ratio. The pixel resolution is changed. This is the default behavior.
     * - `fill`: Resize resolution to fill the entire viewport but does not maintain
     * aspect ratio.
     * - `stretch`: Perform scaling to fill the entire viewport but does not maintain
     * aspect ratio.
     * - `scale`: Perform scaling to fill the entire viewport and maintains the
     * aspect ratio and resolution. The pixel resolution remains constant.
     */
    get scaling(): ScalingMode;
    set sizing(arg: string);
    /**
     * The sizing mode.
     * - `none`: Sizes to canvas.
     * - `container`: Sizes to 100% of parent container.
     * - `viewport`: Sizes to 100% of viewport.
     */
    get sizing(): string;
    set resizeDelay(arg: number);
    /**
     * @returns {number}
     */
    get resizeDelay(): number;
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
    get canvas(): HTMLCanvasElement;
    /** @private */
    private _sizing;
    /** @private */
    private _width;
    /** @private */
    private _height;
    /** @private */
    private _resizeDelay;
    /** @private */
    private animationFrameHandle;
    /** @private */
    private resizeTimeoutHandle;
    /** @private */
    private resizeCanvasWidth;
    /** @private */
    private resizeCanvasHeight;
    /** @private */
    private canvasSlotElement;
    /** @private */
    private canvasElement;
    /** @private */
    private onResize;
    /**
     * @private
     * @param {number} now
     */
    private onAnimationFrame;
    /**
     * @private
     * @param {Event} e
     */
    private onSlotChange;
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
     * @private
     * @param {HTMLCanvasElement} canvas
     */
    private setCanvasElement;
    /**
     * @param {'2d'|'webgl'|'webgl2'} [contextId]
     * @param {CanvasRenderingContext2DSettings} [options]
     */
    getContext(contextId?: '2d' | 'webgl' | 'webgl2', options?: CanvasRenderingContext2DSettings): RenderingContext;
}
type SizingMode = "none" | "conatiner" | "viewport" | string;
type ScalingMode = "noscale" | "scale" | "fill" | "fit" | "stretch";

export { DisplayPort, DisplayScaling, FlexCanvas, FrameEvent, MODE_CENTER, MODE_FILL, MODE_FIT, MODE_NOSCALE, MODE_SCALE, MODE_STRETCH, ScalingMode, SizingMode };
