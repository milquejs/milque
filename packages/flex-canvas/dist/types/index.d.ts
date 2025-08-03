/**
 * A canvas wrapper to scale and stretch with respect to the aspect ratio to fill the viewport or container.
 */
declare class FlexCanvas extends HTMLElement {
    static define(name?: string): void;
    /**
     * Override web component behavior.
     * @protected
     */
    protected static get observedAttributes(): string[];
    /** @private */
    private static get [TEMPLATE_NODE]();
    /** @private */
    private static get [TEMPLATE_STYLE]();
    /**
     * @param {object} [opts]
     * @param {HTMLElement} [opts.root]
     * @param {SizingMode} [opts.sizing]
     * @param {number} [opts.width]
     * @param {number} [opts.height]
     * @param {number} [opts.aspectRatio]
     * @param {ScalingMode} [opts.forceScaling]
     */
    constructor(opts?: {
        root?: HTMLElement | undefined;
        sizing?: SizingMode | undefined;
        width?: number | undefined;
        height?: number | undefined;
        aspectRatio?: number | undefined;
        forceScaling?: ScalingMode | undefined;
    });
    set scaling(value: ScalingMode);
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
    set sizing(value: SizingMode);
    /**
     * The sizing mode.
     * - `none`: Sizes to canvas.
     * - `container`: Sizes to 100% of parent container.
     * - `viewport`: Sizes to 100% of viewport.
     */
    get sizing(): SizingMode;
    set width(value: number);
    /**
     * The canvas width in pixels. This determines the aspect ratio and canvas buffer size.
     * @returns {number}
     */
    get width(): number;
    set height(value: number);
    /**
     * The canvas height in pixels. This determines the aspect ratio and canvas buffer size.
     * @returns {number}
     */
    get height(): number;
    get canvas(): HTMLCanvasElement | null;
    /**
     * @private
     * @type {SizingMode}
     */
    private _sizing;
    /** @private */
    private _width;
    /** @private */
    private _height;
    /** @private */
    private animationFrameHandle;
    /**
     * @private
     * @readonly
     */
    private readonly resizeDelay;
    /** @private */
    private resizeTimeoutHandle;
    /** @private */
    private resizeCanvasWidth;
    /** @private */
    private resizeCanvasHeight;
    /** @private */
    private canvasSlotElement;
    /**
     * @private
     * @type {HTMLCanvasElement|null}
     */
    private canvasElement;
    /** @private */
    private onResize;
    /**
     * @private
     * @param {number} _now
     */
    private onAnimationFrame;
    /**
     * @private
     * @param {Event} e
     */
    private onSlotChange;
    /**
     * Override web component behavior.
     * @protected
     */
    protected connectedCallback(): void;
    /**
     * Override web component behavior.
     * @protected
     */
    protected disconnectedCallback(): void;
    /**
     * Override web component behavior.
     * @protected
     * @param {string} attribute
     * @param {string} _prev
     * @param {string} value
     */
    protected attributeChangedCallback(attribute: string, _prev: string, value: string): void;
    /**
     * @private
     * @param {HTMLCanvasElement} canvas
     */
    private setCanvasElement;
    /**
     * @template {keyof GetRenderingContext} T
     * @param {T} contextId
     * @param {GetRenderingContextOptions[T]} [options]
     * @returns {GetRenderingContext[T]}
     */
    getContext<T extends keyof GetRenderingContext>(contextId: T, options?: GetRenderingContextOptions[T]): GetRenderingContext[T];
}
type ContextId = "2d" | "webgl" | "webgl2" | "bitmaprenderer";
type GetRenderingContext = {
    "2d": CanvasRenderingContext2D;
    "webgl": WebGLRenderingContext;
    "webgl2": WebGL2RenderingContext;
    "bitmaprenderer": ImageBitmapRenderingContext;
};
type GetRenderingContextOptions = {
    "2d": CanvasRenderingContext2DSettings;
    "webgl": WebGLContextAttributes;
    "webgl2": WebGLContextAttributes;
    "bitmaprenderer": ImageBitmapRenderingContextSettings;
};
type ScalingMode = "noscale" | "fit" | "scale" | "fill" | "stretch";
type SizingMode = "none" | "container" | "viewport";
declare const TEMPLATE_NODE: unique symbol;
declare const TEMPLATE_STYLE: unique symbol;

export { FlexCanvas };
export type { ContextId, GetRenderingContext, GetRenderingContextOptions, ScalingMode, SizingMode };
