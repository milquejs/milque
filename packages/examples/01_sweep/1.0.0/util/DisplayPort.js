/**
 * @module DisplayPort
 * @version 1.0
 * 
 * # Changelog
 * ## 1.0
 * - Created DisplayPort
 */

export const MODE_NONE = 'none';
export const MODE_TOPLEFT = 'topleft';
export const MODE_CENTER = 'center';
export const MODE_FIT = 'fit';

const INNER_HTML = `
<label class="hidden" id="title">display-port</label>
<label class="hidden" id="fps">00</label>
<label class="hidden" id="dimension">0x0</label>
<canvas></canvas>`;
const INNER_STYLE = `
<style>
    :host {
        display: inline-block;
        color: #555555;
    }
    div {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
    }
    canvas {
        background: #000000;
        margin: auto;
    }
    label {
        font-family: monospace;
        color: currentColor;
        position: absolute;
    }
    #title {
        left: 0.5rem;
        top: 0.5rem;
    }
    #fps {
        right: 0.5rem;
        top: 0.5rem;
    }
    #dimension {
        left: 0.5rem;
        bottom: 0.5rem;
    }
    .hidden {
        display: none;
    }
    :host([debug]) div {
        outline: 8px dashed rgba(0, 0, 0, 0.4);
        outline-offset: -4px;
        background-color: rgba(0, 0, 0, 0.1);
    }
    :host([mode="${MODE_NONE}"]) canvas, :host([mode="${MODE_TOPLEFT}"]) canvas {
        margin: 0;
        top: 0;
        left: 0;
    }
    :host([mode="${MODE_FIT}"]), :host([mode="${MODE_CENTER}"]) {
        width: 100vw;
        height: 100vh;
    }
</style>`;

export class DisplayPort extends HTMLElement
{
    /** @override */
    static get observedAttributes()
    {
        return [
            'width',
            'height',
            // NOTE: For debuggin purposes...
            'id',
            'class',
            'debug'
        ];
    }

    constructor()
    {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<div>${INNER_STYLE}${INNER_HTML}</div>`;

        this._canvasElement = this.shadowRoot.querySelector('canvas');
        this._canvasContext = this._canvasElement.getContext('2d');
        this._canvasContext.imageSmoothingEnabled = false;

        this._titleElement = this.shadowRoot.querySelector('#title');
        this._fpsElement = this.shadowRoot.querySelector('#fps');
        this._dimensionElement = this.shadowRoot.querySelector('#dimension');

        this._animationRequestHandle = 0;
        this._prevAnimationFrameTime = 0;

        this._width = 300;
        this._height = 300;

        this.update = this.update.bind(this);
    }

    /** @override */
    connectedCallback()
    {
        if (!this.hasAttribute('mode')) this.mode = MODE_CENTER;

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
            case 'width':
                this._width = value;
                break;
            case 'height':
                this._height = value;
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

    update(now)
    {
        this._animationRequestHandle = requestAnimationFrame(this.update);

        this.updateCanvasSize();

        // NOTE: For debugging purposes...
        if (this.debug)
        {
            // Update FPS...
            const dt = now - this._prevAnimationFrameTime;
            const frames = dt <= 0 ? '--' : String(Math.round(1000 / dt)).padStart(2, '0');
            this._prevAnimationFrameTime = now;
            this._fpsElement.innerText = frames;

            // Update dimensions...
            this._dimensionElement.innerText = `${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;
        }

        this.dispatchEvent(new CustomEvent('frame', { detail: { now, context: this._canvasContext }, bubbles: false, composed: true }));
    }

    pause()
    {
        cancelAnimationFrame(this._animationRequestHandle);
    }

    resume()
    {
        this._animationRequestHandle = requestAnimationFrame(this.update);
    }

    updateCanvasSize()
    {
        let clientRect = this.shadowRoot.host.getBoundingClientRect();
        const clientWidth = clientRect.width;
        const clientHeight = clientRect.height;

        let canvas = this._canvasElement;
        let canvasWidth = this._width;
        let canvasHeight = this._height;

        const mode = this.mode;

        if (mode !== MODE_TOPLEFT)
        {
            let flag = clientWidth < canvasWidth || clientHeight < canvasHeight || mode === MODE_FIT;
            if (flag)
            {
                let aspectX = clientWidth * canvasHeight;
                let aspectY = clientHeight * canvasWidth;
    
                let canvasDir = canvasWidth < canvasHeight;
                let clientDir = clientWidth < clientHeight;
    
                if (canvasDir ^ clientDir)
                {
                    canvasWidth = clientWidth;
                    canvasHeight = (clientWidth * canvasWidth * aspectY) / (clientHeight * aspectX);
                }
                else
                {
                    canvasHeight = clientHeight;
                    canvasWidth = (clientHeight * canvasHeight * aspectX) / (clientWidth * aspectY);
                }
            }
        }

        canvasWidth = Math.floor(canvasWidth);
        canvasHeight = Math.floor(canvasHeight);

        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight)
        {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvas.style = `width: ${canvasWidth}px; height: ${canvasHeight}px`;

            this.dispatchEvent(new CustomEvent('resize', { detail: { width: canvasWidth, height: canvasHeight }, bubbles: false, composed: true }));
        }
    }

    getCanvas() { return this._canvasElement; }
    getContext() { return this._canvasContext; }

    get width() { return this._width; }
    set width(value) { return this.setAttribute('width', value); }

    get height() { return this._height; }
    set height(value) { return this.setAttribute('height', value); }

    get mode() { return this.getAttribute('mode'); }
    set mode(value) { return this.setAttribute('mode', value); }

    // NOTE: For debugging purposes...
    get debug() { return this.hasAttribute('debug'); }
    set debug(value) { if (value) this.setAttribute('debug', ''); else this.removeAttribute('debug'); }
}
window.customElements.define('display-port', DisplayPort);
export default DisplayPort;
