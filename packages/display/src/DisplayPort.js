import { properties, customEvents, attachShadowTemplate } from '@milque/cuttle.macro';

import INNER_HTML from './DisplayPort.template.html';
import INNER_STYLE from './DisplayPort.module.css';

/**
 * No scaling is applied. The canvas size maintains a 1:1 pixel ratio to the defined
 * display dimensions.
 */
export const MODE_NOSCALE = 'noscale';

/**
 * No scaling is applied, but the element fills the entire viewport. The canvas size
 * maintains a 1:1 pixel ratio to the defined display dimensions and is centered
 * inside the scaled element.
 */
export const MODE_CENTER = 'center';

/**
 * Scales the canvas to fill the entire viewport and maintains the same aspect ratio
 * with respect to the defined display dimensions. In effect, this will upscale and
 * downscale the pixel size depending on the viewport resolution and aspect ratio. This
 * is the default scaling mode.
 */
export const MODE_FIT = 'fit';

/**
 * Scales the canvas to fill the entire viewport. This does not maintain the aspect
 * ratio. If you care about aspect ratio, consider using 'fit' mode instead.
 */
export const MODE_STRETCH = 'stretch';

// The default display dimensions. This is the same as the canvas element default.
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 150;

// The default display scaling mode.
const DEFAULT_MODE = MODE_FIT;

/**
 * @typedef {CustomEvent} FrameEvent
 * @property {number} detail.now The current time in milliseconds.
 * @property {number} detail.prevTime The previous frame time in milliseconds.
 * @property {number} detail.deltaTime The time taken between the current and previous frame in milliseconds.
 * @property {HTMLCanvasElement} detail.canvas The canvas element.
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
export class DisplayPort extends HTMLElement
{
    /** @override */
    static get observedAttributes()
    {
        return [
            'id',
            'class',
        ];
    }

    static get [properties]()
    {
        return {
            /** The canvas width in pixels. This determines the aspect ratio and canvas buffer size. */
            width: Number,
            /** The canvas height in pixels. This determines the aspect ratio and canvas buffer size. */
            height: Number,
            /** If disabled, animation frames will not fire. */
            disabled: Boolean,
            /** Enable for debug information. */
            debug: Boolean,
            /**
             * The scaling mode.
             * - `noscale`: Does not perform scaling. This is effectively the same as a regular
             * canvas.
             * - `center`: Does not perform pixel scaling but stretches the display to fill the
             * entire viewport. The unscaled canvas is centered.
             * - `fit`: Performs scaling to fill the entire viewport and maintains the aspect
             * ratio. This is the default behavior.
             * - `stretch`: Performs scaling to fill the entire viewport but does not maintain
             * aspect ratio.
             */
            mode: { type: String, value: DEFAULT_MODE, observed: false },
        };
    }

    static get [customEvents]()
    {
        return [
            /** Fired every animation frame. */
            'frame'
        ];
    }

    constructor()
    {
        super();
        attachShadowTemplate(this, INNER_HTML, INNER_STYLE, { mode: 'open' });

        /** @private */
        this._canvasElement = this.shadowRoot.querySelector('canvas');

        /** @private */
        this._titleElement = this.shadowRoot.querySelector('#title');
        /** @private */
        this._fpsElement = this.shadowRoot.querySelector('#fps');
        /** @private */
        this._dimensionElement = this.shadowRoot.querySelector('#dimension');

        /** @private */
        this._animationRequestHandle = 0;
        /** @private */
        this._prevAnimationFrameTime = 0;

        /** @private */
        this._width = DEFAULT_WIDTH;
        /** @private */
        this._height = DEFAULT_HEIGHT;

        /** @private */
        this.update = this.update.bind(this);
    }

    /** Get the canvas element. */
    get canvas() { return this._canvasElement; }
    
    /** @override */
    connectedCallback()
    {
        // Allows this element to be focusable
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', 0);

        this.updateCanvasSize();
        this.resume();
    }

    /** @override */
    disconnectedCallback()
    {
        this.pause();
    } 

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'disabled':
                if (value)
                {
                    this.update(0);
                    this.pause();
                }
                else
                {
                    this.resume();
                }
                break;
            // NOTE: For debugging purposes...
            case 'id':
            case 'class':
                this._titleElement.innerHTML = `display-port${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
                break;
            case 'debug':
                this._titleElement.classList.toggle('hidden', value);
                this._fpsElement.classList.toggle('hidden', value);
                this._dimensionElement.classList.toggle('hidden', value);
                break;
        }
    }

    /** Pause animation of the display frames. */
    pause()
    {
        cancelAnimationFrame(this._animationRequestHandle);
    }

    /** Resume animation of the display frames. */
    resume()
    {
        this._animationRequestHandle = requestAnimationFrame(this.update);
    }

    /** @private */
    update(now)
    {
        this._animationRequestHandle = requestAnimationFrame(this.update);

        this.updateCanvasSize();
        const deltaTime = now - this._prevAnimationFrameTime;
        this._prevAnimationFrameTime = now;

        // NOTE: For debugging purposes...
        if (this.debug)
        {
            // Update FPS...
            const frames = deltaTime <= 0 ? '--' : String(Math.round(1000 / deltaTime)).padStart(2, '0');
            if (this._fpsElement.innerText !== frames)
            {
                this._fpsElement.innerText = frames;
            }

            // Update dimensions...
            if (this.mode === MODE_NOSCALE)
            {
                let result = `${this._width}x${this._height}`;
                if (this._dimensionElement.innerText !== result)
                {
                    this._dimensionElement.innerText = result;
                }
            }
            else
            {
                let result = `${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;
                if (this._dimensionElement.innerText !== result)
                {
                    this._dimensionElement.innerText = result;
                }
            }
        }

        this.dispatchEvent(new CustomEvent('frame', {
            detail: {
                now,
                prevTime: this._prevAnimationFrameTime,
                deltaTime: deltaTime,
                canvas: this._canvasElement,
            },
            bubbles: false,
            composed: true
        }));
    }
    
    /** @private */
    updateCanvasSize()
    {
        let clientRect = this.shadowRoot.host.getBoundingClientRect();
        const clientWidth = clientRect.width;
        const clientHeight = clientRect.height;

        let canvas = this._canvasElement;
        let canvasWidth = this._width;
        let canvasHeight = this._height;

        const mode = this.mode;

        if (mode === MODE_STRETCH)
        {
            canvasWidth = clientWidth;
            canvasHeight = clientHeight;
        }
        else if (mode !== MODE_NOSCALE)
        {
            let flag = clientWidth < canvasWidth || clientHeight < canvasHeight || mode === MODE_FIT;
            if (flag)
            {
                let ratioX = clientWidth / canvasWidth;
                let ratioY = clientHeight / canvasHeight;

                if (ratioX < ratioY)
                {
                    canvasWidth = clientWidth;
                    canvasHeight = canvasHeight * ratioX;
                }
                else
                {
                    canvasWidth = canvasWidth * ratioY;
                    canvasHeight = clientHeight;
                }
            }
        }

        canvasWidth = Math.floor(canvasWidth);
        canvasHeight = Math.floor(canvasHeight);

        if (canvas.clientWidth !== canvasWidth || canvas.clientHeight !== canvasHeight)
        {
            canvas.width = this._width;
            canvas.height = this._height;
            canvas.style = `width: ${canvasWidth}px; height: ${canvasHeight}px`;
            this.dispatchEvent(new CustomEvent('resize', { detail: { width: canvasWidth, height: canvasHeight }, bubbles: false, composed: true }));
        }
    }
}
window.customElements.define('display-port', DisplayPort);
