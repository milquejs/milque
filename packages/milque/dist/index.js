(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.Milque = global.Milque || {}, global.Milque.Util = {})));
}(this, (function (exports) { 'use strict';

    const MODE_NOSCALE = 'noscale';
    const MODE_CENTER = 'center';
    const MODE_FIT = 'fit';
    const MODE_STRETCH = 'stretch';

    const DEFAULT_MODE = MODE_NOSCALE;
    const DEFAULT_WIDTH = 300;
    const DEFAULT_HEIGHT = 150;

    const INNER_HTML = `
<div class="container">
    <label class="hidden" id="title">display-port</label>
    <label class="hidden" id="fps">00</label>
    <label class="hidden" id="dimension">0x0</label>
    <canvas></canvas>
    <slot></slot>
</div>`;
    const INNER_STYLE = `
:host {
    display: inline-block;
    color: #555555;
}
.container {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
}
canvas {
    background: #000000;
    margin: auto;
    image-rendering: pixelated;
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
:host([debug]) .container {
    outline: 6px dashed rgba(0, 0, 0, 0.1);
    outline-offset: -4px;
    background-color: rgba(0, 0, 0, 0.1);
}
:host([mode="${MODE_NOSCALE}"]) canvas {
    margin: 0;
    top: 0;
    left: 0;
}
:host([mode="${MODE_FIT}"]), :host([mode="${MODE_CENTER}"]), :host([mode="${MODE_STRETCH}"]) {
    width: 100%;
    height: 100%;
}
:host([full]) {
    width: 100vw!important;
    height: 100vh!important;
}
:host([disabled]) {
    display: none;
}
slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    pointer-events: none;
}
::slotted(*) {
    pointer-events: auto;
}`;

    const TEMPLATE_KEY = Symbol('template');
    const STYLE_KEY = Symbol('style');

    /**
     * @version 1.2.2
     * @description
     * # Changelog
     * ## 1.2.2
     * - Removed 'contexttype'
     * ## 1.2.1
     * - Added 'contexttype' for getContext()
     * ## 1.2.0
     * - Moved template creation to static time
     * - Removed default export
     * ## 1.1.2
     * - Added clear()
     * - Added delta time for frame events
     * ## 1.1.1
     * - Added onframe and onresize attribute callbacks
     * - Added "stretch" mode
     * ## 1.1.0
     * - Changed "topleft" to "noscale"
     * - Changed default size to 640 x 480
     * - Changed "center" and "fit" to fill container instead of viewport
     * - Added "full" property to override and fill viewport
     * ## 1.0.2
     * - Moved default values to the top
     * ## 1.0.1
     * - Fixed scaling issues when dimensions do not match
     * ## 1.0.0
     * - Created DisplayPort
     * 
     * @fires frame Every time a new frame is rendered.
     * @fires resize When the display is resized.
     */
    class DisplayPort extends HTMLElement
    {
        static get [TEMPLATE_KEY]()
        {
            let template = document.createElement('template');
            template.innerHTML = INNER_HTML;
            Object.defineProperty(this, TEMPLATE_KEY, { value: template });
            return template;
        }

        static get [STYLE_KEY]()
        {
            let style = document.createElement('style');
            style.innerHTML = INNER_STYLE;
            Object.defineProperty(this, STYLE_KEY, { value: style });
            return style;
        }

        /** @override */
        static get observedAttributes()
        {
            return [
                'width',
                'height',
                'disabled',
                // Event handlers...
                'onframe',
                /*
                // NOTE: Already handled by GlobalEventHandlers...
                'onresize',
                */
                // NOTE: For debuggin purposes...
                'debug',
                // ...listening for built-in attribs...
                'id',
                'class',
            ];
        }

        constructor()
        {
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));
            this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

            this._canvasElement = this.shadowRoot.querySelector('canvas');

            this._titleElement = this.shadowRoot.querySelector('#title');
            this._fpsElement = this.shadowRoot.querySelector('#fps');
            this._dimensionElement = this.shadowRoot.querySelector('#dimension');

            this._animationRequestHandle = 0;
            this._prevAnimationFrameTime = 0;

            this._width = DEFAULT_WIDTH;
            this._height = DEFAULT_HEIGHT;

            this._onframe = null;
            /*
            // NOTE: Already handled by GlobalEventHandlers...
            this._onresize = null;
            */

            this.update = this.update.bind(this);
        }

        get canvas() { return this._canvasElement; }
        
        /** @override */
        connectedCallback()
        {
            if (!this.hasAttribute('mode')) this.mode = DEFAULT_MODE;
            
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
                case 'width':
                    this._width = value;
                    break;
                case 'height':
                    this._height = value;
                    break;
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
                // Event handlers...
                case 'onframe':
                    this.onframe = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                /*
                // NOTE: Already handled by GlobalEventHandlers...
                case 'onresize':
                    this.onresize = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                */
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
                    /** @deprecated */
                    get context() { let ctx = this.canvas.getContext('2d'); ctx.imageSmoothingEnabled = false; return ctx; },
                },
                bubbles: false,
                composed: true
            }));
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

        /*
        // NOTE: Already handled by GlobalEventHandlers...
        get onresize() { return this._onresize; }
        set onresize(value)
        {
            if (this._onresize) this.removeEventListener('resize', this._onresize);
            this._onresize = value;
            if (this._onresize) this.addEventListener('resize', value);
        }
        */

        get onframe() { return this._onframe; }
        set onframe(value)
        {
            if (this._onframe) this.removeEventListener('frame', this._onframe);
            this._onframe = value;
            if (this._onframe) this.addEventListener('frame', value);
        }

        get width() { return this._width; }
        set width(value) { this.setAttribute('width', value); }

        get height() { return this._height; }
        set height(value) { this.setAttribute('height', value); }

        get mode() { return this.getAttribute('mode'); }
        set mode(value) { this.setAttribute('mode', value); }

        get disabled() { return this.hasAttribute('disabled'); }
        set disabled(value) { if (value) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }

        // NOTE: For debugging purposes...
        get debug() { return this.hasAttribute('debug'); }
        set debug(value) { if (value) this.setAttribute('debug', ''); else this.removeAttribute('debug'); }
    }
    window.customElements.define('display-port', DisplayPort);

    class InputDevice
    {
        /** @abstract */
        static addInputEventListener(elementTarget, listener) {}
        
        /** @abstract */
        static removeInputEventListener(elementTarget, listener) {}

        constructor(eventTarget)
        {
            this.eventTarget = eventTarget;
        }
    }

    class Button
    {
        constructor()
        {
            this.down = 0;
            this.up = 0;
            this.value = 0;

            this.next = {
                up: 0,
                down: 0,
            };
        }

        update(event, value)
        {
            if (event === 'down')
            {
                this.next.down = value;
            }
            else
            {
                this.next.up = value;
            }
        }

        poll()
        {
            if (this.value)
            {
                if (this.up && !this.next.up)
                {
                    this.value = 0;
                }
            }
            else if (this.next.down)
            {
                this.value = 1;
            }

            this.down = this.next.down;
            this.up = this.next.up;

            this.next.down = 0;
            this.next.up = 0;
        }

        /** @override */
        toString()
        {
            return this.value;
        }
    }

    class Axis
    {
        constructor()
        {
            this.value = 0;
        }

        update(event, value)
        {
            this.value = value;
        }

        poll() {}

        /** @override */
        toString()
        {
            return this.value;
        }
    }

    class AggregatedAxis extends Axis
    {
        constructor()
        {
            super();

            this.next = 0;
        }

        /** @override */
        update(event, value)
        {
            this.next += value;
        }

        /** @override */
        poll()
        {
            this.value = this.next;
            this.next = 0;
        }
    }

    const KEYBOARD_CONTEXT_KEY = Symbol('keyboardEventContext');

    class Keyboard extends InputDevice
    {
        /** @override */
        static addInputEventListener(eventTarget, listener)
        {
            let ctx;
            if (!(KEYBOARD_CONTEXT_KEY in listener))
            {
                ctx = {
                    handler: listener,
                    target: eventTarget,
                    down: null,
                    up: null,
                    _keyEvent: {
                        type: 'key',
                        target: eventTarget,
                        device: 'keyboard',
                        key: null,
                        event: null,
                        value: null,
                        control: false,
                        shift: false,
                        alt: false,
                    },
                };
        
                let down = onKeyDown.bind(ctx);
                let up = onKeyUp.bind(ctx);
            
                ctx.down = down;
                ctx.up = up;
            
                listener[KEYBOARD_CONTEXT_KEY] = ctx;
            }
            else
            {
                ctx = listener[KEYBOARD_CONTEXT_KEY];
            }

            eventTarget.addEventListener('keyup', ctx.up);
            eventTarget.addEventListener('keydown', ctx.down);
        
            return eventTarget;
        }

        /** @override */
        static removeInputEventListener(eventTarget, listener)
        {
            if (KEYBOARD_CONTEXT_KEY in listener)
            {
                let ctx = listener[KEYBOARD_CONTEXT_KEY];
            
                eventTarget.removeEventListener('keyup', ctx.up);
                eventTarget.removeEventListener('keydown', ctx.down);
            }
        
            return eventTarget;
        }

        constructor(eventTarget, keyList = undefined)
        {
            super(eventTarget);

            this._buttons = [];
            this._managed = Array.isArray(keyList);

            this.onManagedKeyEvent = this.onManagedKeyEvent.bind(this);
            this.onUnmanagedKeyEvent = this.onUnmanagedKeyEvent.bind(this);

            if (this._managed)
            {
                for(let key of keyList)
                {
                    let button = new Button();
                    this[key] = button;
                    this._buttons.push(button);
                }

                Keyboard.addInputEventListener(eventTarget, this.onManagedKeyEvent);
            }
            else
            {
                Keyboard.addInputEventListener(eventTarget, this.onUnmanagedKeyEvent);
            }
        }

        get Up() { return Math.min((this.ArrowUp || 0) + (this.KeyW || 0), 1); }
        get Down() { return Math.min((this.ArrowDown || 0) + (this.KeyS || 0), 1); }
        get Left() { return Math.min((this.ArrowLeft || 0) + (this.KeyA || 0), 1); }
        get Right() { return Math.min((this.ArrowRight || 0) + (this.KeyD || 0), 1); }

        destroy()
        {
            if (this._managed)
            {
                Keyboard.removeInputEventListener(this.eventTarget, this.onManagedKeyEvent);
            }
            else
            {
                Keyboard.removeInputEventListener(this.eventTarget, this.onUnmanagedKeyEvent);
            }
            this.eventTarget = null;
        }

        poll()
        {
            for(let button of this._buttons)
            {
                button.poll();
            }
            return this;
        }

        onUnmanagedKeyEvent(e)
        {
            if (!(e.key in this))
            {
                let button = new Button();
                this[e.key] = button;
                this._buttons.push(button);
            }
            
            this[e.key].update(e.event, e.value);
            
            return true;
        }

        onManagedKeyEvent(e)
        {
            if (e.key in this)
            {
                this[e.key].update(e.event, e.value);

                return true;
            }
        }
    }

    function onKeyDown(e)
    {
        // Ignore repeat events.
        if (e.repeat)
        {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        let event = this._keyEvent;
        // NOTE: You could use `e.key`, but we care about location rather than printable character.
        event.key = e.code;
        event.event = 'down';
        event.value = 1;
        event.control = e.ctrlKey;
        event.shift = e.shiftKey;
        event.alt = e.altKey;

        let result = this.handler.call(undefined, event);

        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    function onKeyUp(e)
    {
        let event = this._keyEvent;
        // NOTE: You could use `e.key`, but we care about location rather than printable character.
        event.key = e.code;
        event.event = 'up';
        event.value = 1;
        event.control = e.ctrlKey;
        event.shift = e.shiftKey;
        event.alt = e.altKey;

        let result = this.handler.call(undefined, event);

        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    const MOUSE_CONTEXT_KEY = Symbol('mouseEventContext');

    class Mouse extends InputDevice
    {
        /** @override */
        static addInputEventListener(eventTarget, listener)
        {
            let ctx;
            if (!(MOUSE_CONTEXT_KEY in listener))
            {
                ctx = {
                    handler: listener,
                    target: eventTarget,
                    down: null,
                    up: null,
                    move: null,
                    contextmenu: null,
                    _down: false,
                    _keyEvent: {
                        type: 'key',
                        target: eventTarget,
                        device: 'mouse',
                        key: null,
                        event: null,
                        value: null,
                    },
                    _posEvent: {
                        type: 'pos',
                        target: eventTarget,
                        device: 'mouse',
                        key: 'pos',
                        event: 'move',
                        x: 0, y: 0, dx: 0, dy: 0,
                    },
                };
        
                let down = onMouseDown.bind(ctx);
                let up = onMouseUp.bind(ctx);
                let move = onMouseMove.bind(ctx);
                let contextmenu = onContextMenu.bind(ctx);
            
                ctx.down = down;
                ctx.up = up;
                ctx.move = move;
                ctx.contextmenu = contextmenu;
            
                listener[MOUSE_CONTEXT_KEY] = ctx;
            }
            else
            {
                ctx = listener[MOUSE_CONTEXT_KEY];
            }
        
            eventTarget.addEventListener('mousedown', ctx.down);
            document.addEventListener('mouseup', ctx.up);
            eventTarget.addEventListener('contextmenu', ctx.contextmenu);
            document.addEventListener('mousemove', ctx.move);
        
            return eventTarget;
        }

        /** @override */
        static removeInputEventListener(eventTarget, listener)
        {
            if (MOUSE_CONTEXT_KEY in listener)
            {
                let ctx = listener[MOUSE_CONTEXT_KEY];
            
                eventTarget.removeEventListener('mousedown', ctx.down);
                document.removeEventListener('mouseup', ctx.up);
                eventTarget.removeEventListener('contextmenu', ctx.contextmenu);
                document.removeEventListener('mousemove', ctx.move);
            }
        
            return eventTarget;
        }

        constructor(eventTarget)
        {
            super(eventTarget);

            this.x = new Axis();
            this.y = new Axis();
            this.dx = new AggregatedAxis();
            this.dy = new AggregatedAxis();
            this.Button0 = new Button();
            this.Button1 = new Button();
            this.Button2 = new Button();
            this.Button3 = new Button();
            this.Button4 = new Button();

            this.onMouseEvent = this.onMouseEvent.bind(this);

            Mouse.addInputEventListener(eventTarget, this.onMouseEvent);
        }

        get Left() { return this.Button0; }
        get Middle() { return this.Button1; }
        get Right() { return this.Button2; }

        destroy()
        {
            Mouse.removeInputEventListener(this.eventTarget, this.onMouseEvent);
            this.eventTarget = null;
        }

        poll()
        {
            this.x.poll();
            this.y.poll();
            this.dx.poll();
            this.dy.poll();
            this.Button0.poll();
            this.Button1.poll();
            this.Button2.poll();
            this.Button3.poll();
            this.Button4.poll();

            return this;
        }

        onMouseEvent(e)
        {
            let { key, event } = e;
            switch(key)
            {
                case 0:
                    this.Button0.update(event, e.value);
                    break;
                case 1:
                    this.Button1.update(event, e.value);
                    break;
                case 2:
                    this.Button2.update(event, e.value);
                    break;
                case 3:
                    this.Button3.update(event, e.value);
                    break;
                case 4:
                    this.Button4.update(event, e.value);
                    break;
                case 'pos':
                    this.x.update(event, e.x);
                    this.y.update(event, e.y);
                    this.dx.update(event, e.dx);
                    this.dy.update(event, e.dy);
                    
                    // Cannot consume a position event.
                    return;
            }

            return true;
        }
    }

    function onMouseDown(e)
    {
        this._down = true;

        let event = this._keyEvent;
        event.key = e.button;
        event.event = 'down';
        event.value = 1;

        let result = this.handler.call(undefined, event);

        if (result)
        {
            if (document.activeElement === this.target)
            {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }

    function onMouseUp(e)
    {
        if (this._down)
        {
            this._down = false;

            let event = this._keyEvent;
            event.key = e.button;
            event.event = 'up';
            event.value = 1;
            
            let result = this.handler.call(undefined, event);
        
            if (result)
            {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }

    function onMouseMove(e)
    {
        let element = this.target;
        let { clientWidth, clientHeight } = element;

        let rect = this.target.getBoundingClientRect();

        let dx = e.movementX / clientWidth;
        let dy = e.movementY / clientHeight;
        let x = (e.clientX - rect.left) / clientWidth;
        let y = (e.clientY - rect.top) / clientHeight;

        let event = this._posEvent;
        event.x = x;
        event.y = y;
        event.dx = dx;
        event.dy = dy;

        let result = this.handler.call(undefined, event);

        if (typeof result !== 'undefined')
        {
            throw new Error(`Return value must be 'undefined'. Mouse position and movement events cannot be consumed.`);
        }
    }

    function onContextMenu(e)
    {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    const INNER_HTML$1 = `
<kbd></kbd>`;
    const INNER_STYLE$1 = `
:host {
    display: inline-block;
}
kbd {
    background-color: #EEEEEE;
    border-radius: 3px;
    border: 1px solid #B4B4B4;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;
    color: #333333;
    font-size: 0.85em;
    font-weight: 700;
    line-height: 1;
    padding: 2px 4px;
    white-space: nowrap;
}
`;

    const TEMPLATE_KEY$1 = Symbol('template');
    const STYLE_KEY$1 = Symbol('style');

    class InputKey extends HTMLElement
    {
        static toInputMap(nodes)
        {
            let inputMap = {};
            
            for(let node of nodes)
            {
                if (node instanceof InputKey)
                {
                    let inputName = node.input;
        
                    let keys;
                    if (inputName in inputMap)
                    {
                        keys = inputMap[inputName];
                    }
                    else
                    {
                        inputMap[inputName] = keys = [];
                    }
        
                    let inputType = node.type;
                    switch(inputType)
                    {
                        case 'action':
                            keys.push({
                                key: node.key,
                                event: node.event,
                            });
                            break;
                        case 'range':
                            keys.push({
                                key: node.key,
                                scale: node.scale,
                            });
                            break;
                        default:
                            throw new Error('Unknown input type.');
                    }
                }
            }

            return inputMap;
        }

        static get [TEMPLATE_KEY$1]()
        {
            let template = document.createElement('template');
            template.innerHTML = INNER_HTML$1;
            Object.defineProperty(this, TEMPLATE_KEY$1, { value: template });
            return template;
        }

        static get [STYLE_KEY$1]()
        {
            let style = document.createElement('style');
            style.innerHTML = INNER_STYLE$1;
            Object.defineProperty(this, STYLE_KEY$1, { value: style });
            return style;
        }

        /** @override */
        static get observedAttributes()
        {
            return [
                'input',
                'key',
                'scale',
                'event'
            ];
        }

        constructor()
        {
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY$1].content.cloneNode(true));
            this.shadowRoot.appendChild(this.constructor[STYLE_KEY$1].cloneNode(true));

            this.keyElement = this.shadowRoot.querySelector('kbd');
        }

        /** @override */
        attributeChangedCallback(attribute, prev, value)
        {
            switch(attribute)
            {
                case 'key':
                    this.keyElement.textContent = value;
                    break;
            }
        }

        get type() { return this.hasAttribute('event') ? 'action' : 'range'; }

        get input() { return this.getAttribute('input'); }
        set input(value) { this.setAttribute('input', value); }

        get key() { return this.getAttribute('key'); }
        set key(value) { this.setAttribute('key', value); }

        get scale() { return Number(this.getAttribute('scale')); }
        set scale(value) { this.setAttribute('scale', value); }

        get event() { return this.getAttribute('event'); }
        set event(value) { this.setAttribute('event', value); }
    }
    window.customElements.define('input-key', InputKey);

    class Input
    {
        constructor(inputName, inputType)
        {
            this.inputName = inputName;
            this.inputType = inputType;
            
            this.value = 0;

            this._onchange = null;
            this._eventListeners = new Map();
        }

        update(value)
        {
            if (this.value !== value)
            {
                this.value = value;
                
                if (this._eventListeners.has('change'))
                {
                    for(let listener of this._eventListeners.get('change'))
                    {
                        listener.call(undefined, this);
                    }
                }

                return true;
            }
            return false;
        }

        get onchange()
        {
            return this._onchange;
        }

        set onchange(callback)
        {
            if (this._onchange)
            {
                this.removeEventListener('change', this._onchange);
            }

            this._onchange = callback;
            this.addEventListener('change', callback);
        }

        addEventListener(event, listener)
        {
            if (this._eventListeners.has(event))
            {
                let listeners = this._eventListeners.get(event);
                listeners.push(listener);
            }
            else
            {
                this._eventListeners.set(event, [ listener ]);
            }
        }

        removeEventListener(event, listener)
        {
            if (this._eventListeners.has(event))
            {
                let listeners = this._eventListeners.get(event);
                listeners.splice(listeners.indexOf(listener), 1);
            }
        }

        /** @override */
        toString()
        {
            return this.value;
        }
    }

    // TODO: Maybe this should be InputMap.getContext()?

    const INNER_HTML$2 = `
<table>
    <thead>
        <tr class="header">
            <th id="title" colspan=3>input-context</th>
            <th id="poll">&nbsp;</th>
        </tr>
        <tr class="hint">
            <th>input</th>
            <th>key</th>
            <th>mod</th>
            <th>value</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
<slot></slot>`;
    const INNER_STYLE$2 = `
:host {
    display: inline-block;
}
slot {
    display: none;
}
table {
    border-collapse: collapse;
}
table, th, td {
    border: 1px solid gray;
}
#poll {
    position: relative;
    font-size: 0.9em;
}
#poll:after {
    content: "(poll)";
    position: absolute;
    left: 0;
    right: 0;
    z-index: -1;
    opacity: 0.1;
    font-family: monospace;
    letter-spacing: 3px;
    overflow: hidden;
}
.hint > th {
    font-size: 0.5em;
    font-family: monospace;
    padding: 0 10px;
    letter-spacing: 3px;
    background-color: #AAA;
    color: #666666;
}
th, td {
    padding: 5px 10px;
}
td {
    text-align: center;
}
kbd {
    display: inline-block;
    background-color: #EEEEEE;
    border-radius: 3px;
    border: 1px solid #B4B4B4;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;
    color: #333333;
    font-size: 0.85em;
    font-weight: 700;
    line-height: 1;
    padding: 2px 4px;
    white-space: nowrap;
}
output {
    font-family: monospace;
    border-radius: 0.3em;
    padding: 3px;
}
.flash {
    animation: fadein 4s;
}
@keyframes fadein {
    0%, 10% { background-color: rgba(0, 0, 255, 0.3); }
    100% { background-color: rgba(0, 0, 255, 0); }
}
`;

    class InputKeyPair
    {
        constructor(keyName, keyEvent, scale)
        {
            this.keyName = keyName;
            this.keyEvent = keyEvent;
            this.scale = scale;

            this.value = 0;
        }

        consumeKey()
        {
            this.value = 0;
        }

        updateKey(e, keyName)
        {
            // NOTE: This condition is only really used for parameterized key events.
            if (keyName === this.keyName)
            {
                if (this.keyEvent)
                {
                    if (this.keyEvent === e.event)
                    {
                        this.value = e.value * this.scale;
                        return true;
                    }
                }
                else
                {
                    switch(e.event)
                    {
                        case 'down':
                            this.value = this.scale;
                            return true;
                        case 'up':
                            this.value = 0;
                            return true;
                        default:
                            this.value = e.value * this.scale;
                            return;
                    }
                }
            }
        }
    }

    const NONE_POLL_TEXT = '✗';
    const ACTIVE_POLL_TEXT = '✓';

    const TEMPLATE_KEY$2 = Symbol('template');
    const STYLE_KEY$2 = Symbol('style');

    const POLL_WARNING_TIME = 3000;

    class InputContext extends HTMLElement
    {
        static get [TEMPLATE_KEY$2]()
        {
            let template = document.createElement('template');
            template.innerHTML = INNER_HTML$2;
            Object.defineProperty(this, TEMPLATE_KEY$2, { value: template });
            return template;
        }

        static get [STYLE_KEY$2]()
        {
            let style = document.createElement('style');
            style.innerHTML = INNER_STYLE$2;
            Object.defineProperty(this, STYLE_KEY$2, { value: style });
            return style;
        }

        /** @override */
        static get observedAttributes()
        {
            return [
                'for',
                'strict',
                'onattach',
                'ondetach',
                // ...listening for built-in attribs...
                'id',
                'class',
            ];
        }

        constructor(inputMap = null)
        {
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY$2].content.cloneNode(true));
            this.shadowRoot.appendChild(this.constructor[STYLE_KEY$2].cloneNode(true));

            this._onattach = null;
            this._ondetach = null;

            this._titleElement = this.shadowRoot.querySelector('#title');
            this._pollElement = this.shadowRoot.querySelector('#poll');

            this._tableBody = this.shadowRoot.querySelector('tbody');
            this._children = this.shadowRoot.querySelector('slot');
            this._tableInputs = {};

            this._lastPollTime = 0;
            this._pollWarningTimeoutHandle = 0;
            this._animationFrameHandle = 0;

            this._inputTarget = null;
            this._inputMap = inputMap;
            this._inputs = {};
            this._inputKeys = {};
            this._keys = {};

            this.onInputEvent = this.onInputEvent.bind(this);
            this.onAnimationFrame = this.onAnimationFrame.bind(this);

            if (inputMap)
            {
                parseInputMapping(this, inputMap);
            }
        }

        /** @override */
        connectedCallback()
        {
            if (!this.hasAttribute('for')) this.setAttribute('for', '');

            // Setup keys and inputs from the input mapping
            if (!this._inputMap)
            {
                this._inputMap = {};

                const childInputMap = InputKey.toInputMap(this._children.assignedNodes());
                const inputMapSource = this.src;
        
                if (inputMapSource)
                {
                    fetch(inputMapSource)
                        .then(blob => blob.json())
                        .then(data => {
                            this._inputMap = { ...data, ...childInputMap };
                            parseInputMapping(this, this._inputMap);
                        });
                }
                else
                {
                    this._inputMap = { ...childInputMap };
                    parseInputMapping(this, this._inputMap);
                }
            }

            // Check to see if polling cause it is easy to forget it :P
            this._lastPollTime = 0;
            this._pollWarningTimeoutHandle = setTimeout(() => {
                if (this._lastPollTime <= 0)
                {
                    this._pollElement.textContent = NONE_POLL_TEXT;
                    console.warn('[INPUT] No input updated. Did you forget to poll() the input context?');
                }
                else
                {
                    this._pollElement.textContent = ACTIVE_POLL_TEXT;
                }
            }, POLL_WARNING_TIME);

            this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        }

        /** @override */
        disconnectedCallback()
        {
            cancelAnimationFrame(this._animationFrameHandle);
            clearTimeout(this._pollWarningTimeoutHandle);
        }

        /** @override */
        attributeChangedCallback(attribute, prev, value)
        {
            switch(attribute)
            {
                case 'for':
                    let target;
                    if (value)
                    {
                        target = document.getElementById(value);
                    }
                    else
                    {
                        target = document.querySelector('display-port') || document.querySelector('canvas');
                    }

                    if (this._inputTarget)
                    {
                        this.detach();
                    }

                    if (target)
                    {
                        this.attach(target);
                    }
                    break;
                // Event handlers...
                case 'onattach':
                    this.onattach = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                case 'ondetach':
                    this.ondetach = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                // NOTE: For debugging purposes...
                case 'id':
                case 'class':
                    this._titleElement.innerHTML = `input-context${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
                    break;
            }
        }

        get src() { return this.getAttribute('src'); }
        set src(value) { this.setAttribute('src', value); }

        get for() { return this.getAttribute('for'); }
        set for(value) { this.setAttribute('for', value); }

        get strict() { return this.hasAttribute('strict'); }
        set strict(value) { if (value) this.setAttribute('strict', ''); else this.removeAttribute('strict'); }

        get auto() { return this.hasAttribute('auto'); }
        set auto(value) { if (value) this.setAttribute('auto', ''); else this.removeAttribute('auto'); }

        get onattach() { return this._onattach; }
        set onattach(value)
        {
            if (this._onattach) this.removeEventListener('attach', this._onattach);
            this._onattach = value;
            if (this._onattach) this.addEventListener('attach', value);
        }

        get ondetach() { return this._ondetach; }
        set ondetach(value)
        {
            if (this._ondetach) this.removeEventListener('detach', this._ondetach);
            this._ondetach = value;
            if (this._ondetach) this.addEventListener('detach', value);
        }

        attach(targetElement)
        {
            if (!targetElement)
            {
                throw new Error('Cannot attach input context to null.');
            }

            if (this._inputTarget)
            {
                if (this._inputTarget !== targetElement)
                {
                    throw new Error('Input context already attached to another element.');
                }
                else
                {
                    // It's already attached.
                    return this;
                }
            }

            let target = targetElement;
            if (target)
            {
                if (target.canvas)
                {
                    Keyboard.addInputEventListener(target, this.onInputEvent);
                    Mouse.addInputEventListener(target.canvas, this.onInputEvent);
                }
                else
                {
                    Keyboard.addInputEventListener(target, this.onInputEvent);
                    Mouse.addInputEventListener(target, this.onInputEvent);
                }

                this.dispatchEvent(new CustomEvent('attach', {
                    composed: true, bubbles: false, detail: { eventTarget: target, inputCallback: this.onInputEvent }
                }));
            }

            this._inputTarget = target;
            return this;
        }

        detach()
        {
            if (!this._inputTarget) return this;

            let target = this._inputTarget;
            this._inputTarget = null;

            if (target.canvas)
            {
                Keyboard.removeInputEventListener(target, this.onInputEvent);
                Mouse.removeInputEventListener(target.canvas, this.onInputEvent);
            }
            else
            {
                Keyboard.removeInputEventListener(target, this.onInputEvent);
                Mouse.removeInputEventListener(target, this.onInputEvent);
            }

            this.dispatchEvent(new CustomEvent('detach', {
                composed: true, bubbles: false, detail: { eventTarget: target, inputCallback: this.onInputEvent }
            }));

            return this;
        }

        poll()
        {
            this._lastPollTime = performance.now();

            // Update all inputs to the current key's values.
            for(let inputName in this._inputs)
            {
                let input = this._inputs[inputName];
                let inputType = input.inputType;
                switch(inputType)
                {
                    case 'action':
                        // Action should be any key value.
                        let consumed = false;
                        for(let inputKey of this._inputKeys[inputName])
                        {
                            let value = inputKey.value;
                            if (value)
                            {
                                input.update(value, inputKey);
                                inputKey.consumeKey();
                                consumed = true;
                                break;
                            }
                        }
                        if (!consumed)
                        {
                            input.update(0, null);
                        }
                        break;
                    case 'range':
                        // Range should be sum of keys.
                        let value = 0;
                        for(let inputKey of this._inputKeys[inputName])
                        {
                            value += inputKey.value;
                        }
                        input.update(value, null);
                        break;
                    default:
                        throw new Error('Unknown input type.');
                }
            }
        }

        onInputEvent(e)
        {
            let eventType = e.type;
            switch(eventType)
            {
                case 'key':
                    {
                        const keyName = e.device + ':' + e.key;
                        if (keyName in this._keys)
                        {
                            let flag = false;
                            for(let key of this._keys[keyName])
                            {
                                if (key.updateKey(e, keyName))
                                {
                                    flag = true;
                                }
                            }
                            if (flag)
                            {
                                return true;
                            }
                        }
                    }
                    break;
                case 'pos':
                    {
                        const params = [
                            'x',
                            'y',
                            'dx',
                            'dy'
                        ];
                        for(let param of params)
                        {
                            e.value = e[param];
                            const keyName = e.device + ':' + e.key + '.' + param;
                            if (keyName in this._keys)
                            {
                                let flag = false;
                                for(let key of this._keys[keyName])
                                {
                                    if (key.updateKey(e, keyName))
                                    {
                                        flag = true;
                                    }
                                }
                                if (flag)
                                {
                                    return true;
                                }
                            }
                        }
                    }
                    break;
                default:
                    throw new Error(`Unknown input event type '${eventType}'.`);
            }
        }

        onAnimationFrame(now)
        {
            this._animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);

            // If enabled, do auto-polling
            if (this.auto) this.poll();

            // Update all inputs to the current key's values.
            for(let inputName in this._inputs)
            {
                let input = this._inputs[inputName];
                let result;
                if (input.value)
                {
                    result = Number(input.value).toFixed(2);
                }
                else
                {
                    result = 0;
                }
                let element = this._tableInputs[inputName];
                if (element.textContent != result)
                {
                    element.textContent = result;
                    let parent = element.parentNode;
                    element.parentNode.removeChild(element);
                    parent.appendChild(element);
                }
            }
        }

        getInput(inputName)
        {
            if (inputName in this._inputs)
            {
                return this._inputs[inputName];
            }
            else if (!this.strict)
            {
                let result = new Input(inputName, 'range');
                this._inputs[inputName] = result;
                return result;
            }
            else
            {
                throw new Error(`Cannot find input with name '${inputName}'.`);
            }
        }

        getInputValue(inputName)
        {
            if (inputName in this._inputs)
            {
                return this._inputs[inputName].value;
            }
            else if (!this.strict)
            {
                return 0;
            }
            else
            {
                throw new Error(`Cannot find input with name '${inputName}'.`);
            }
        }
    }
    window.customElements.define('input-context', InputContext);

    function parseInputMapping(inputContext, inputMapping)
    {
        for(let inputName in inputMapping)
        {
            let inputOptions = inputMapping[inputName];
            if (Array.isArray(inputOptions))
            {
                for(let inputOption of inputOptions)
                {
                    parseInputOption(inputContext, inputName, inputOption);
                    if (typeof inputOption === 'string')
                    {
                        inputOption = { key: inputOption, event: 'down' };
                    }
                    appendInputOption(inputContext, inputName, inputOption);
                }
            }
            else
            {
                parseInputOption(inputContext, inputName, inputOptions);
                if (typeof inputOptions === 'string')
                {
                    inputOptions = { key: inputOptions, event: 'down' };
                }
                appendInputOption(inputContext, inputName, inputOptions);
            }
        }
    }

    function evaluateInputOptionType(inputOption)
    {
        if (typeof inputOption === 'object')
        {
            if ('type' in inputOption)
            {
                return inputOption.type;
            }
            else if ('scale' in inputOption)
            {
                return 'range';
            }
            else if ('event' in inputOption)
            {
                return 'action';
            }
            else
            {
                throw new Error(`Missing 'scale' or 'event' for input option '${inputName}'.`);
            }
        }
        else if (typeof inputOption === 'string')
        {
            return 'action';
        }
        else
        {
            throw new Error('Invalid type for input mapping option.');
        }
    }

    function appendInputOption(inputContext, inputName, inputOption)
    {
        let row = document.createElement('tr');
        
        // Name
        {
            let inputCell = document.createElement('td');
            inputCell.textContent = inputName;
            inputCell.classList.add('name');
            row.appendChild(inputCell);
        }

        // Key
        {
            let keyCell = document.createElement('td');
            keyCell.classList.add('key');
            let keyLabel = document.createElement('kbd');
            keyLabel.textContent = inputOption.key;
            keyCell.appendChild(keyLabel);
            row.appendChild(keyCell);
        }

        // Mods
        {
            let modCell = document.createElement('td');
            let modSample = document.createElement('samp');
            let inputType = evaluateInputOptionType(inputOption);
            switch(inputType)
            {
                case 'action':
                    modSample.textContent = inputOption.event;
                    break;
                case 'range':
                    modSample.textContent = Number(inputOption.scale).toFixed(2);
                    break;
                default:
                    modSample.textContent = '<?>';
            }
            modCell.classList.add('mod');
            modCell.appendChild(modSample);
            row.appendChild(modCell);
        }

        // Value
        if (!(inputName in inputContext._tableInputs))
        {
            let outputCell = document.createElement('td');
            let outputValue = document.createElement('output');
            outputValue.textContent = 0;
            outputValue.classList.add('flash');
            outputCell.classList.add('value');
            outputCell.appendChild(outputValue);
            row.appendChild(outputCell);
            inputContext._tableInputs[inputName] = outputValue;
        }
        else
        {
            let outputCell = document.createElement('td');
            outputCell.classList.add('value');
            row.appendChild(outputCell);
        }

        inputContext._tableBody.appendChild(row);
    }

    function parseInputOption(inputContext, inputName, inputOption)
    {
        let inputType = evaluateInputOptionType(inputOption);
        switch(inputType)
        {
            case 'action':
                if (typeof inputOption === 'string')
                {
                    parseActionOption(inputContext, inputName, { key: inputOption, event: 'down' });
                }
                else
                {
                    parseActionOption(inputContext, inputName, inputOption);
                }
                break;
            case 'range':
                parseRangeOption(inputContext, inputName, inputOption);
                break;
            default:
                throw new Error(`Unknown input type '${inputType}'.`);
        }
    }

    function parseRangeOption(inputContext, inputName, inputOption)
    {
        const { key, scale } = inputOption;

        // Update _inputs, _inputKeys, _keys
        let input;
        let inputKeys;
        if (inputName in inputContext._inputs)
        {
            input = inputContext._inputs[inputName];
            inputKeys = inputContext._inputKeys[inputName];

            if (input.inputType !== 'range')
            {
                throw new Error(`Cannot register mismatched 'range' type input for '${input.inputType}' type input '${inputName}'.`);
            }
        }
        else
        {
            input = new Input(inputName, 'range');
            inputKeys = [];

            inputContext._inputs[inputName] = input;
            inputContext._inputKeys[inputName] = inputKeys;
        }

        let keys;
        if (key in inputContext._keys)
        {
            keys = inputContext._keys[key];
        }
        else
        {
            keys = [];
            inputContext._keys[key] = keys;
        }
        
        let inputKey = new InputKeyPair(key, null, scale);
        keys.push(inputKey);
        inputKeys.push(inputKey);
    }

    function parseActionOption(inputContext, inputName, inputOption)
    {
        const { key, event } = inputOption;

        // Update _inputs, _inputKeys, _keys
        let input;
        let inputKeys;
        if (inputName in inputContext._inputs)
        {
            input = inputContext._inputs[inputName];
            inputKeys = inputContext._inputKeys[inputName];

            if (input.inputType !== 'action')
            {
                throw new Error(`Cannot register mismatched 'action' type input for '${input.inputType}' type input '${inputName}'.`);
            }
        }
        else
        {
            input = new Input(inputName, 'action');
            inputKeys = [];

            inputContext._inputs[inputName] = input;
            inputContext._inputKeys[inputName] = inputKeys;
        }

        let keys;
        if (key in inputContext._keys)
        {
            keys = inputContext._keys[key];
        }
        else
        {
            keys = [];
            inputContext._keys[key] = keys;
        }
        
        let inputKey = new InputKeyPair(key, event, 1);
        keys.push(inputKey);
        inputKeys.push(inputKey);
    }

    class RandomGenerator
    {
        /** @abstract */
        next() { return Math.random(); }
    }

    let RAND;

    class Random
    {
        constructor(randomGenerator = new RandomGenerator())
        {
            this.generator = randomGenerator;
        }

        static next() { return RAND.next(); }
        next()
        {
            return this.generator.next();
        }

        static choose(list) { return RAND.choose(list); }
        choose(list)
        {
            return list[Math.floor(this.generator.next() * list.length)];
        }

        static range(min, max) { return RAND.range(min, max); }
        range(min, max)
        {
            return ((max - min) * this.generator.next()) + min;
        }
        
        static sign() { return RAND.sign(); }
        sign()
        {
            return this.generator.next() < 0.5 ? -1 : 1;
        }
    }

    RAND = new Random();

    // SOURCE: https://gist.github.com/blixt/f17b47c62508be59987b
    class SimpleRandomGenerator extends RandomGenerator
    {
        constructor(seed = 0)
        {
            super();

            this._seed = Math.abs(seed % 2147483647);
            this._next = this._seed;
        }

        /** @override */
        next()
        {
            this._next = Math.abs(this._next * 16807 % 2147483647 - 1);
            return this._next / 2147483646;
        }

        get seed()
        {
            return this._seed;
        }

        set seed(value)
        {
            this._seed = Math.abs(value % 2147483647);
            this._next = this._seed;
        }
    }

    /**
     * Common utilities
     * @module glMatrix
     */
    // Configuration Constants
    var EPSILON = 0.000001;
    var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
    var RANDOM = Math.random;
    /**
     * Sets the type of array used when creating new vectors and matrices
     *
     * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
     */

    function setMatrixArrayType(type) {
      ARRAY_TYPE = type;
    }
    var degree = Math.PI / 180;
    /**
     * Convert Degree To Radian
     *
     * @param {Number} a Angle in Degrees
     */

    function toRadian(a) {
      return a * degree;
    }
    /**
     * Tests whether or not the arguments have approximately the same value, within an absolute
     * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
     * than or equal to 1.0, and a relative tolerance is used for larger values)
     *
     * @param {Number} a The first number to test.
     * @param {Number} b The second number to test.
     * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
     */

    function equals(a, b) {
      return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
    }
    if (!Math.hypot) Math.hypot = function () {
      var y = 0,
          i = arguments.length;

      while (i--) {
        y += arguments[i] * arguments[i];
      }

      return Math.sqrt(y);
    };

    var common = /*#__PURE__*/Object.freeze({
        __proto__: null,
        EPSILON: EPSILON,
        get ARRAY_TYPE () { return ARRAY_TYPE; },
        RANDOM: RANDOM,
        setMatrixArrayType: setMatrixArrayType,
        toRadian: toRadian,
        equals: equals
    });

    /**
     * 2x2 Matrix
     * @module mat2
     */

    /**
     * Creates a new identity mat2
     *
     * @returns {mat2} a new 2x2 matrix
     */

    function create() {
      var out = new ARRAY_TYPE(4);

      if (ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
      }

      out[0] = 1;
      out[3] = 1;
      return out;
    }
    /**
     * Creates a new mat2 initialized with values from an existing matrix
     *
     * @param {ReadonlyMat2} a matrix to clone
     * @returns {mat2} a new 2x2 matrix
     */

    function clone(a) {
      var out = new ARRAY_TYPE(4);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      return out;
    }
    /**
     * Copy the values from one mat2 to another
     *
     * @param {mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the source matrix
     * @returns {mat2} out
     */

    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      return out;
    }
    /**
     * Set a mat2 to the identity matrix
     *
     * @param {mat2} out the receiving matrix
     * @returns {mat2} out
     */

    function identity(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    }
    /**
     * Create a new mat2 with the given values
     *
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m10 Component in column 1, row 0 position (index 2)
     * @param {Number} m11 Component in column 1, row 1 position (index 3)
     * @returns {mat2} out A new 2x2 matrix
     */

    function fromValues(m00, m01, m10, m11) {
      var out = new ARRAY_TYPE(4);
      out[0] = m00;
      out[1] = m01;
      out[2] = m10;
      out[3] = m11;
      return out;
    }
    /**
     * Set the components of a mat2 to the given values
     *
     * @param {mat2} out the receiving matrix
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m10 Component in column 1, row 0 position (index 2)
     * @param {Number} m11 Component in column 1, row 1 position (index 3)
     * @returns {mat2} out
     */

    function set(out, m00, m01, m10, m11) {
      out[0] = m00;
      out[1] = m01;
      out[2] = m10;
      out[3] = m11;
      return out;
    }
    /**
     * Transpose the values of a mat2
     *
     * @param {mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the source matrix
     * @returns {mat2} out
     */

    function transpose(out, a) {
      // If we are transposing ourselves we can skip a few steps but have to cache
      // some values
      if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
      } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
      }

      return out;
    }
    /**
     * Inverts a mat2
     *
     * @param {mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the source matrix
     * @returns {mat2} out
     */

    function invert(out, a) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3]; // Calculate the determinant

      var det = a0 * a3 - a2 * a1;

      if (!det) {
        return null;
      }

      det = 1.0 / det;
      out[0] = a3 * det;
      out[1] = -a1 * det;
      out[2] = -a2 * det;
      out[3] = a0 * det;
      return out;
    }
    /**
     * Calculates the adjugate of a mat2
     *
     * @param {mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the source matrix
     * @returns {mat2} out
     */

    function adjoint(out, a) {
      // Caching this value is nessecary if out == a
      var a0 = a[0];
      out[0] = a[3];
      out[1] = -a[1];
      out[2] = -a[2];
      out[3] = a0;
      return out;
    }
    /**
     * Calculates the determinant of a mat2
     *
     * @param {ReadonlyMat2} a the source matrix
     * @returns {Number} determinant of a
     */

    function determinant(a) {
      return a[0] * a[3] - a[2] * a[1];
    }
    /**
     * Multiplies two mat2's
     *
     * @param {mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the first operand
     * @param {ReadonlyMat2} b the second operand
     * @returns {mat2} out
     */

    function multiply(out, a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3];
      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];
      out[0] = a0 * b0 + a2 * b1;
      out[1] = a1 * b0 + a3 * b1;
      out[2] = a0 * b2 + a2 * b3;
      out[3] = a1 * b2 + a3 * b3;
      return out;
    }
    /**
     * Rotates a mat2 by the given angle
     *
     * @param {mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat2} out
     */

    function rotate(out, a, rad) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3];
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      out[0] = a0 * c + a2 * s;
      out[1] = a1 * c + a3 * s;
      out[2] = a0 * -s + a2 * c;
      out[3] = a1 * -s + a3 * c;
      return out;
    }
    /**
     * Scales the mat2 by the dimensions in the given vec2
     *
     * @param {mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the matrix to rotate
     * @param {ReadonlyVec2} v the vec2 to scale the matrix by
     * @returns {mat2} out
     **/

    function scale(out, a, v) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3];
      var v0 = v[0],
          v1 = v[1];
      out[0] = a0 * v0;
      out[1] = a1 * v0;
      out[2] = a2 * v1;
      out[3] = a3 * v1;
      return out;
    }
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     mat2.identity(dest);
     *     mat2.rotate(dest, dest, rad);
     *
     * @param {mat2} out mat2 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat2} out
     */

    function fromRotation(out, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      out[0] = c;
      out[1] = s;
      out[2] = -s;
      out[3] = c;
      return out;
    }
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat2.identity(dest);
     *     mat2.scale(dest, dest, vec);
     *
     * @param {mat2} out mat2 receiving operation result
     * @param {ReadonlyVec2} v Scaling vector
     * @returns {mat2} out
     */

    function fromScaling(out, v) {
      out[0] = v[0];
      out[1] = 0;
      out[2] = 0;
      out[3] = v[1];
      return out;
    }
    /**
     * Returns a string representation of a mat2
     *
     * @param {ReadonlyMat2} a matrix to represent as a string
     * @returns {String} string representation of the matrix
     */

    function str(a) {
      return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
    }
    /**
     * Returns Frobenius norm of a mat2
     *
     * @param {ReadonlyMat2} a the matrix to calculate Frobenius norm of
     * @returns {Number} Frobenius norm
     */

    function frob(a) {
      return Math.hypot(a[0], a[1], a[2], a[3]);
    }
    /**
     * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
     * @param {ReadonlyMat2} L the lower triangular matrix
     * @param {ReadonlyMat2} D the diagonal matrix
     * @param {ReadonlyMat2} U the upper triangular matrix
     * @param {ReadonlyMat2} a the input matrix to factorize
     */

    function LDU(L, D, U, a) {
      L[2] = a[2] / a[0];
      U[0] = a[0];
      U[1] = a[1];
      U[3] = a[3] - L[2] * U[1];
      return [L, D, U];
    }
    /**
     * Adds two mat2's
     *
     * @param {mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the first operand
     * @param {ReadonlyMat2} b the second operand
     * @returns {mat2} out
     */

    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      return out;
    }
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the first operand
     * @param {ReadonlyMat2} b the second operand
     * @returns {mat2} out
     */

    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      out[3] = a[3] - b[3];
      return out;
    }
    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyMat2} a The first matrix.
     * @param {ReadonlyMat2} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */

    function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     *
     * @param {ReadonlyMat2} a The first matrix.
     * @param {ReadonlyMat2} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */

    function equals$1(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3];
      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];
      return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
    }
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {mat2} out
     */

    function multiplyScalar(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      return out;
    }
    /**
     * Adds two mat2's after multiplying each element of the second operand by a scalar value.
     *
     * @param {mat2} out the receiving vector
     * @param {ReadonlyMat2} a the first operand
     * @param {ReadonlyMat2} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {mat2} out
     */

    function multiplyScalarAndAdd(out, a, b, scale) {
      out[0] = a[0] + b[0] * scale;
      out[1] = a[1] + b[1] * scale;
      out[2] = a[2] + b[2] * scale;
      out[3] = a[3] + b[3] * scale;
      return out;
    }
    /**
     * Alias for {@link mat2.multiply}
     * @function
     */

    var mul = multiply;
    /**
     * Alias for {@link mat2.subtract}
     * @function
     */

    var sub = subtract;

    var mat2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create,
        clone: clone,
        copy: copy,
        identity: identity,
        fromValues: fromValues,
        set: set,
        transpose: transpose,
        invert: invert,
        adjoint: adjoint,
        determinant: determinant,
        multiply: multiply,
        rotate: rotate,
        scale: scale,
        fromRotation: fromRotation,
        fromScaling: fromScaling,
        str: str,
        frob: frob,
        LDU: LDU,
        add: add,
        subtract: subtract,
        exactEquals: exactEquals,
        equals: equals$1,
        multiplyScalar: multiplyScalar,
        multiplyScalarAndAdd: multiplyScalarAndAdd,
        mul: mul,
        sub: sub
    });

    /**
     * 2x3 Matrix
     * @module mat2d
     * @description
     * A mat2d contains six elements defined as:
     * <pre>
     * [a, b,
     *  c, d,
     *  tx, ty]
     * </pre>
     * This is a short form for the 3x3 matrix:
     * <pre>
     * [a, b, 0,
     *  c, d, 0,
     *  tx, ty, 1]
     * </pre>
     * The last column is ignored so the array is shorter and operations are faster.
     */

    /**
     * Creates a new identity mat2d
     *
     * @returns {mat2d} a new 2x3 matrix
     */

    function create$1() {
      var out = new ARRAY_TYPE(6);

      if (ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[4] = 0;
        out[5] = 0;
      }

      out[0] = 1;
      out[3] = 1;
      return out;
    }
    /**
     * Creates a new mat2d initialized with values from an existing matrix
     *
     * @param {ReadonlyMat2d} a matrix to clone
     * @returns {mat2d} a new 2x3 matrix
     */

    function clone$1(a) {
      var out = new ARRAY_TYPE(6);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      return out;
    }
    /**
     * Copy the values from one mat2d to another
     *
     * @param {mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {mat2d} out
     */

    function copy$1(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      return out;
    }
    /**
     * Set a mat2d to the identity matrix
     *
     * @param {mat2d} out the receiving matrix
     * @returns {mat2d} out
     */

    function identity$1(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      out[4] = 0;
      out[5] = 0;
      return out;
    }
    /**
     * Create a new mat2d with the given values
     *
     * @param {Number} a Component A (index 0)
     * @param {Number} b Component B (index 1)
     * @param {Number} c Component C (index 2)
     * @param {Number} d Component D (index 3)
     * @param {Number} tx Component TX (index 4)
     * @param {Number} ty Component TY (index 5)
     * @returns {mat2d} A new mat2d
     */

    function fromValues$1(a, b, c, d, tx, ty) {
      var out = new ARRAY_TYPE(6);
      out[0] = a;
      out[1] = b;
      out[2] = c;
      out[3] = d;
      out[4] = tx;
      out[5] = ty;
      return out;
    }
    /**
     * Set the components of a mat2d to the given values
     *
     * @param {mat2d} out the receiving matrix
     * @param {Number} a Component A (index 0)
     * @param {Number} b Component B (index 1)
     * @param {Number} c Component C (index 2)
     * @param {Number} d Component D (index 3)
     * @param {Number} tx Component TX (index 4)
     * @param {Number} ty Component TY (index 5)
     * @returns {mat2d} out
     */

    function set$1(out, a, b, c, d, tx, ty) {
      out[0] = a;
      out[1] = b;
      out[2] = c;
      out[3] = d;
      out[4] = tx;
      out[5] = ty;
      return out;
    }
    /**
     * Inverts a mat2d
     *
     * @param {mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {mat2d} out
     */

    function invert$1(out, a) {
      var aa = a[0],
          ab = a[1],
          ac = a[2],
          ad = a[3];
      var atx = a[4],
          aty = a[5];
      var det = aa * ad - ab * ac;

      if (!det) {
        return null;
      }

      det = 1.0 / det;
      out[0] = ad * det;
      out[1] = -ab * det;
      out[2] = -ac * det;
      out[3] = aa * det;
      out[4] = (ac * aty - ad * atx) * det;
      out[5] = (ab * atx - aa * aty) * det;
      return out;
    }
    /**
     * Calculates the determinant of a mat2d
     *
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {Number} determinant of a
     */

    function determinant$1(a) {
      return a[0] * a[3] - a[1] * a[2];
    }
    /**
     * Multiplies two mat2d's
     *
     * @param {mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {mat2d} out
     */

    function multiply$1(out, a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5];
      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5];
      out[0] = a0 * b0 + a2 * b1;
      out[1] = a1 * b0 + a3 * b1;
      out[2] = a0 * b2 + a2 * b3;
      out[3] = a1 * b2 + a3 * b3;
      out[4] = a0 * b4 + a2 * b5 + a4;
      out[5] = a1 * b4 + a3 * b5 + a5;
      return out;
    }
    /**
     * Rotates a mat2d by the given angle
     *
     * @param {mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat2d} out
     */

    function rotate$1(out, a, rad) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5];
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      out[0] = a0 * c + a2 * s;
      out[1] = a1 * c + a3 * s;
      out[2] = a0 * -s + a2 * c;
      out[3] = a1 * -s + a3 * c;
      out[4] = a4;
      out[5] = a5;
      return out;
    }
    /**
     * Scales the mat2d by the dimensions in the given vec2
     *
     * @param {mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to translate
     * @param {ReadonlyVec2} v the vec2 to scale the matrix by
     * @returns {mat2d} out
     **/

    function scale$1(out, a, v) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5];
      var v0 = v[0],
          v1 = v[1];
      out[0] = a0 * v0;
      out[1] = a1 * v0;
      out[2] = a2 * v1;
      out[3] = a3 * v1;
      out[4] = a4;
      out[5] = a5;
      return out;
    }
    /**
     * Translates the mat2d by the dimensions in the given vec2
     *
     * @param {mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to translate
     * @param {ReadonlyVec2} v the vec2 to translate the matrix by
     * @returns {mat2d} out
     **/

    function translate(out, a, v) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5];
      var v0 = v[0],
          v1 = v[1];
      out[0] = a0;
      out[1] = a1;
      out[2] = a2;
      out[3] = a3;
      out[4] = a0 * v0 + a2 * v1 + a4;
      out[5] = a1 * v0 + a3 * v1 + a5;
      return out;
    }
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     mat2d.identity(dest);
     *     mat2d.rotate(dest, dest, rad);
     *
     * @param {mat2d} out mat2d receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat2d} out
     */

    function fromRotation$1(out, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad);
      out[0] = c;
      out[1] = s;
      out[2] = -s;
      out[3] = c;
      out[4] = 0;
      out[5] = 0;
      return out;
    }
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat2d.identity(dest);
     *     mat2d.scale(dest, dest, vec);
     *
     * @param {mat2d} out mat2d receiving operation result
     * @param {ReadonlyVec2} v Scaling vector
     * @returns {mat2d} out
     */

    function fromScaling$1(out, v) {
      out[0] = v[0];
      out[1] = 0;
      out[2] = 0;
      out[3] = v[1];
      out[4] = 0;
      out[5] = 0;
      return out;
    }
    /**
     * Creates a matrix from a vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat2d.identity(dest);
     *     mat2d.translate(dest, dest, vec);
     *
     * @param {mat2d} out mat2d receiving operation result
     * @param {ReadonlyVec2} v Translation vector
     * @returns {mat2d} out
     */

    function fromTranslation(out, v) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      out[4] = v[0];
      out[5] = v[1];
      return out;
    }
    /**
     * Returns a string representation of a mat2d
     *
     * @param {ReadonlyMat2d} a matrix to represent as a string
     * @returns {String} string representation of the matrix
     */

    function str$1(a) {
      return "mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")";
    }
    /**
     * Returns Frobenius norm of a mat2d
     *
     * @param {ReadonlyMat2d} a the matrix to calculate Frobenius norm of
     * @returns {Number} Frobenius norm
     */

    function frob$1(a) {
      return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], 1);
    }
    /**
     * Adds two mat2d's
     *
     * @param {mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {mat2d} out
     */

    function add$1(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      out[4] = a[4] + b[4];
      out[5] = a[5] + b[5];
      return out;
    }
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {mat2d} out
     */

    function subtract$1(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      out[3] = a[3] - b[3];
      out[4] = a[4] - b[4];
      out[5] = a[5] - b[5];
      return out;
    }
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {mat2d} out
     */

    function multiplyScalar$1(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      out[4] = a[4] * b;
      out[5] = a[5] * b;
      return out;
    }
    /**
     * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
     *
     * @param {mat2d} out the receiving vector
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {mat2d} out
     */

    function multiplyScalarAndAdd$1(out, a, b, scale) {
      out[0] = a[0] + b[0] * scale;
      out[1] = a[1] + b[1] * scale;
      out[2] = a[2] + b[2] * scale;
      out[3] = a[3] + b[3] * scale;
      out[4] = a[4] + b[4] * scale;
      out[5] = a[5] + b[5] * scale;
      return out;
    }
    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyMat2d} a The first matrix.
     * @param {ReadonlyMat2d} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */

    function exactEquals$1(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
    }
    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     *
     * @param {ReadonlyMat2d} a The first matrix.
     * @param {ReadonlyMat2d} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */

    function equals$2(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5];
      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5];
      return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5));
    }
    /**
     * Alias for {@link mat2d.multiply}
     * @function
     */

    var mul$1 = multiply$1;
    /**
     * Alias for {@link mat2d.subtract}
     * @function
     */

    var sub$1 = subtract$1;

    var mat2d = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$1,
        clone: clone$1,
        copy: copy$1,
        identity: identity$1,
        fromValues: fromValues$1,
        set: set$1,
        invert: invert$1,
        determinant: determinant$1,
        multiply: multiply$1,
        rotate: rotate$1,
        scale: scale$1,
        translate: translate,
        fromRotation: fromRotation$1,
        fromScaling: fromScaling$1,
        fromTranslation: fromTranslation,
        str: str$1,
        frob: frob$1,
        add: add$1,
        subtract: subtract$1,
        multiplyScalar: multiplyScalar$1,
        multiplyScalarAndAdd: multiplyScalarAndAdd$1,
        exactEquals: exactEquals$1,
        equals: equals$2,
        mul: mul$1,
        sub: sub$1
    });

    /**
     * 3x3 Matrix
     * @module mat3
     */

    /**
     * Creates a new identity mat3
     *
     * @returns {mat3} a new 3x3 matrix
     */

    function create$2() {
      var out = new ARRAY_TYPE(9);

      if (ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
      }

      out[0] = 1;
      out[4] = 1;
      out[8] = 1;
      return out;
    }
    /**
     * Copies the upper-left 3x3 values into the given mat3.
     *
     * @param {mat3} out the receiving 3x3 matrix
     * @param {ReadonlyMat4} a   the source 4x4 matrix
     * @returns {mat3} out
     */

    function fromMat4(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[4];
      out[4] = a[5];
      out[5] = a[6];
      out[6] = a[8];
      out[7] = a[9];
      out[8] = a[10];
      return out;
    }
    /**
     * Creates a new mat3 initialized with values from an existing matrix
     *
     * @param {ReadonlyMat3} a matrix to clone
     * @returns {mat3} a new 3x3 matrix
     */

    function clone$2(a) {
      var out = new ARRAY_TYPE(9);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[8] = a[8];
      return out;
    }
    /**
     * Copy the values from one mat3 to another
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the source matrix
     * @returns {mat3} out
     */

    function copy$2(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[8] = a[8];
      return out;
    }
    /**
     * Create a new mat3 with the given values
     *
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m10 Component in column 1, row 0 position (index 3)
     * @param {Number} m11 Component in column 1, row 1 position (index 4)
     * @param {Number} m12 Component in column 1, row 2 position (index 5)
     * @param {Number} m20 Component in column 2, row 0 position (index 6)
     * @param {Number} m21 Component in column 2, row 1 position (index 7)
     * @param {Number} m22 Component in column 2, row 2 position (index 8)
     * @returns {mat3} A new mat3
     */

    function fromValues$2(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      var out = new ARRAY_TYPE(9);
      out[0] = m00;
      out[1] = m01;
      out[2] = m02;
      out[3] = m10;
      out[4] = m11;
      out[5] = m12;
      out[6] = m20;
      out[7] = m21;
      out[8] = m22;
      return out;
    }
    /**
     * Set the components of a mat3 to the given values
     *
     * @param {mat3} out the receiving matrix
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m10 Component in column 1, row 0 position (index 3)
     * @param {Number} m11 Component in column 1, row 1 position (index 4)
     * @param {Number} m12 Component in column 1, row 2 position (index 5)
     * @param {Number} m20 Component in column 2, row 0 position (index 6)
     * @param {Number} m21 Component in column 2, row 1 position (index 7)
     * @param {Number} m22 Component in column 2, row 2 position (index 8)
     * @returns {mat3} out
     */

    function set$2(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      out[0] = m00;
      out[1] = m01;
      out[2] = m02;
      out[3] = m10;
      out[4] = m11;
      out[5] = m12;
      out[6] = m20;
      out[7] = m21;
      out[8] = m22;
      return out;
    }
    /**
     * Set a mat3 to the identity matrix
     *
     * @param {mat3} out the receiving matrix
     * @returns {mat3} out
     */

    function identity$2(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 1;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 1;
      return out;
    }
    /**
     * Transpose the values of a mat3
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the source matrix
     * @returns {mat3} out
     */

    function transpose$1(out, a) {
      // If we are transposing ourselves we can skip a few steps but have to cache some values
      if (out === a) {
        var a01 = a[1],
            a02 = a[2],
            a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
      } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
      }

      return out;
    }
    /**
     * Inverts a mat3
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the source matrix
     * @returns {mat3} out
     */

    function invert$2(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2];
      var a10 = a[3],
          a11 = a[4],
          a12 = a[5];
      var a20 = a[6],
          a21 = a[7],
          a22 = a[8];
      var b01 = a22 * a11 - a12 * a21;
      var b11 = -a22 * a10 + a12 * a20;
      var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

      var det = a00 * b01 + a01 * b11 + a02 * b21;

      if (!det) {
        return null;
      }

      det = 1.0 / det;
      out[0] = b01 * det;
      out[1] = (-a22 * a01 + a02 * a21) * det;
      out[2] = (a12 * a01 - a02 * a11) * det;
      out[3] = b11 * det;
      out[4] = (a22 * a00 - a02 * a20) * det;
      out[5] = (-a12 * a00 + a02 * a10) * det;
      out[6] = b21 * det;
      out[7] = (-a21 * a00 + a01 * a20) * det;
      out[8] = (a11 * a00 - a01 * a10) * det;
      return out;
    }
    /**
     * Calculates the adjugate of a mat3
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the source matrix
     * @returns {mat3} out
     */

    function adjoint$1(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2];
      var a10 = a[3],
          a11 = a[4],
          a12 = a[5];
      var a20 = a[6],
          a21 = a[7],
          a22 = a[8];
      out[0] = a11 * a22 - a12 * a21;
      out[1] = a02 * a21 - a01 * a22;
      out[2] = a01 * a12 - a02 * a11;
      out[3] = a12 * a20 - a10 * a22;
      out[4] = a00 * a22 - a02 * a20;
      out[5] = a02 * a10 - a00 * a12;
      out[6] = a10 * a21 - a11 * a20;
      out[7] = a01 * a20 - a00 * a21;
      out[8] = a00 * a11 - a01 * a10;
      return out;
    }
    /**
     * Calculates the determinant of a mat3
     *
     * @param {ReadonlyMat3} a the source matrix
     * @returns {Number} determinant of a
     */

    function determinant$2(a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2];
      var a10 = a[3],
          a11 = a[4],
          a12 = a[5];
      var a20 = a[6],
          a21 = a[7],
          a22 = a[8];
      return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
    }
    /**
     * Multiplies two mat3's
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the first operand
     * @param {ReadonlyMat3} b the second operand
     * @returns {mat3} out
     */

    function multiply$2(out, a, b) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2];
      var a10 = a[3],
          a11 = a[4],
          a12 = a[5];
      var a20 = a[6],
          a21 = a[7],
          a22 = a[8];
      var b00 = b[0],
          b01 = b[1],
          b02 = b[2];
      var b10 = b[3],
          b11 = b[4],
          b12 = b[5];
      var b20 = b[6],
          b21 = b[7],
          b22 = b[8];
      out[0] = b00 * a00 + b01 * a10 + b02 * a20;
      out[1] = b00 * a01 + b01 * a11 + b02 * a21;
      out[2] = b00 * a02 + b01 * a12 + b02 * a22;
      out[3] = b10 * a00 + b11 * a10 + b12 * a20;
      out[4] = b10 * a01 + b11 * a11 + b12 * a21;
      out[5] = b10 * a02 + b11 * a12 + b12 * a22;
      out[6] = b20 * a00 + b21 * a10 + b22 * a20;
      out[7] = b20 * a01 + b21 * a11 + b22 * a21;
      out[8] = b20 * a02 + b21 * a12 + b22 * a22;
      return out;
    }
    /**
     * Translate a mat3 by the given vector
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the matrix to translate
     * @param {ReadonlyVec2} v vector to translate by
     * @returns {mat3} out
     */

    function translate$1(out, a, v) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a10 = a[3],
          a11 = a[4],
          a12 = a[5],
          a20 = a[6],
          a21 = a[7],
          a22 = a[8],
          x = v[0],
          y = v[1];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a10;
      out[4] = a11;
      out[5] = a12;
      out[6] = x * a00 + y * a10 + a20;
      out[7] = x * a01 + y * a11 + a21;
      out[8] = x * a02 + y * a12 + a22;
      return out;
    }
    /**
     * Rotates a mat3 by the given angle
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat3} out
     */

    function rotate$2(out, a, rad) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a10 = a[3],
          a11 = a[4],
          a12 = a[5],
          a20 = a[6],
          a21 = a[7],
          a22 = a[8],
          s = Math.sin(rad),
          c = Math.cos(rad);
      out[0] = c * a00 + s * a10;
      out[1] = c * a01 + s * a11;
      out[2] = c * a02 + s * a12;
      out[3] = c * a10 - s * a00;
      out[4] = c * a11 - s * a01;
      out[5] = c * a12 - s * a02;
      out[6] = a20;
      out[7] = a21;
      out[8] = a22;
      return out;
    }
    /**
     * Scales the mat3 by the dimensions in the given vec2
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the matrix to rotate
     * @param {ReadonlyVec2} v the vec2 to scale the matrix by
     * @returns {mat3} out
     **/

    function scale$2(out, a, v) {
      var x = v[0],
          y = v[1];
      out[0] = x * a[0];
      out[1] = x * a[1];
      out[2] = x * a[2];
      out[3] = y * a[3];
      out[4] = y * a[4];
      out[5] = y * a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[8] = a[8];
      return out;
    }
    /**
     * Creates a matrix from a vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat3.identity(dest);
     *     mat3.translate(dest, dest, vec);
     *
     * @param {mat3} out mat3 receiving operation result
     * @param {ReadonlyVec2} v Translation vector
     * @returns {mat3} out
     */

    function fromTranslation$1(out, v) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 1;
      out[5] = 0;
      out[6] = v[0];
      out[7] = v[1];
      out[8] = 1;
      return out;
    }
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     mat3.identity(dest);
     *     mat3.rotate(dest, dest, rad);
     *
     * @param {mat3} out mat3 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat3} out
     */

    function fromRotation$2(out, rad) {
      var s = Math.sin(rad),
          c = Math.cos(rad);
      out[0] = c;
      out[1] = s;
      out[2] = 0;
      out[3] = -s;
      out[4] = c;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 1;
      return out;
    }
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat3.identity(dest);
     *     mat3.scale(dest, dest, vec);
     *
     * @param {mat3} out mat3 receiving operation result
     * @param {ReadonlyVec2} v Scaling vector
     * @returns {mat3} out
     */

    function fromScaling$2(out, v) {
      out[0] = v[0];
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = v[1];
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 1;
      return out;
    }
    /**
     * Copies the values from a mat2d into a mat3
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to copy
     * @returns {mat3} out
     **/

    function fromMat2d(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = 0;
      out[3] = a[2];
      out[4] = a[3];
      out[5] = 0;
      out[6] = a[4];
      out[7] = a[5];
      out[8] = 1;
      return out;
    }
    /**
     * Calculates a 3x3 matrix from the given quaternion
     *
     * @param {mat3} out mat3 receiving operation result
     * @param {ReadonlyQuat} q Quaternion to create matrix from
     *
     * @returns {mat3} out
     */

    function fromQuat(out, q) {
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3];
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var yx = y * x2;
      var yy = y * y2;
      var zx = z * x2;
      var zy = z * y2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      out[0] = 1 - yy - zz;
      out[3] = yx - wz;
      out[6] = zx + wy;
      out[1] = yx + wz;
      out[4] = 1 - xx - zz;
      out[7] = zy - wx;
      out[2] = zx - wy;
      out[5] = zy + wx;
      out[8] = 1 - xx - yy;
      return out;
    }
    /**
     * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
     *
     * @param {mat3} out mat3 receiving operation result
     * @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
     *
     * @returns {mat3} out
     */

    function normalFromMat4(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
      var a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
      var a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
      var a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15];
      var b00 = a00 * a11 - a01 * a10;
      var b01 = a00 * a12 - a02 * a10;
      var b02 = a00 * a13 - a03 * a10;
      var b03 = a01 * a12 - a02 * a11;
      var b04 = a01 * a13 - a03 * a11;
      var b05 = a02 * a13 - a03 * a12;
      var b06 = a20 * a31 - a21 * a30;
      var b07 = a20 * a32 - a22 * a30;
      var b08 = a20 * a33 - a23 * a30;
      var b09 = a21 * a32 - a22 * a31;
      var b10 = a21 * a33 - a23 * a31;
      var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

      var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

      if (!det) {
        return null;
      }

      det = 1.0 / det;
      out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
      out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
      out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
      out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
      out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
      out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
      out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
      out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
      out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
      return out;
    }
    /**
     * Generates a 2D projection matrix with the given bounds
     *
     * @param {mat3} out mat3 frustum matrix will be written into
     * @param {number} width Width of your gl context
     * @param {number} height Height of gl context
     * @returns {mat3} out
     */

    function projection(out, width, height) {
      out[0] = 2 / width;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = -2 / height;
      out[5] = 0;
      out[6] = -1;
      out[7] = 1;
      out[8] = 1;
      return out;
    }
    /**
     * Returns a string representation of a mat3
     *
     * @param {ReadonlyMat3} a matrix to represent as a string
     * @returns {String} string representation of the matrix
     */

    function str$2(a) {
      return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")";
    }
    /**
     * Returns Frobenius norm of a mat3
     *
     * @param {ReadonlyMat3} a the matrix to calculate Frobenius norm of
     * @returns {Number} Frobenius norm
     */

    function frob$2(a) {
      return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
    }
    /**
     * Adds two mat3's
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the first operand
     * @param {ReadonlyMat3} b the second operand
     * @returns {mat3} out
     */

    function add$2(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      out[4] = a[4] + b[4];
      out[5] = a[5] + b[5];
      out[6] = a[6] + b[6];
      out[7] = a[7] + b[7];
      out[8] = a[8] + b[8];
      return out;
    }
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the first operand
     * @param {ReadonlyMat3} b the second operand
     * @returns {mat3} out
     */

    function subtract$2(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      out[3] = a[3] - b[3];
      out[4] = a[4] - b[4];
      out[5] = a[5] - b[5];
      out[6] = a[6] - b[6];
      out[7] = a[7] - b[7];
      out[8] = a[8] - b[8];
      return out;
    }
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {mat3} out
     */

    function multiplyScalar$2(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      out[4] = a[4] * b;
      out[5] = a[5] * b;
      out[6] = a[6] * b;
      out[7] = a[7] * b;
      out[8] = a[8] * b;
      return out;
    }
    /**
     * Adds two mat3's after multiplying each element of the second operand by a scalar value.
     *
     * @param {mat3} out the receiving vector
     * @param {ReadonlyMat3} a the first operand
     * @param {ReadonlyMat3} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {mat3} out
     */

    function multiplyScalarAndAdd$2(out, a, b, scale) {
      out[0] = a[0] + b[0] * scale;
      out[1] = a[1] + b[1] * scale;
      out[2] = a[2] + b[2] * scale;
      out[3] = a[3] + b[3] * scale;
      out[4] = a[4] + b[4] * scale;
      out[5] = a[5] + b[5] * scale;
      out[6] = a[6] + b[6] * scale;
      out[7] = a[7] + b[7] * scale;
      out[8] = a[8] + b[8] * scale;
      return out;
    }
    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyMat3} a The first matrix.
     * @param {ReadonlyMat3} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */

    function exactEquals$2(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
    }
    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     *
     * @param {ReadonlyMat3} a The first matrix.
     * @param {ReadonlyMat3} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */

    function equals$3(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5],
          a6 = a[6],
          a7 = a[7],
          a8 = a[8];
      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5],
          b6 = b[6],
          b7 = b[7],
          b8 = b[8];
      return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
    }
    /**
     * Alias for {@link mat3.multiply}
     * @function
     */

    var mul$2 = multiply$2;
    /**
     * Alias for {@link mat3.subtract}
     * @function
     */

    var sub$2 = subtract$2;

    var mat3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$2,
        fromMat4: fromMat4,
        clone: clone$2,
        copy: copy$2,
        fromValues: fromValues$2,
        set: set$2,
        identity: identity$2,
        transpose: transpose$1,
        invert: invert$2,
        adjoint: adjoint$1,
        determinant: determinant$2,
        multiply: multiply$2,
        translate: translate$1,
        rotate: rotate$2,
        scale: scale$2,
        fromTranslation: fromTranslation$1,
        fromRotation: fromRotation$2,
        fromScaling: fromScaling$2,
        fromMat2d: fromMat2d,
        fromQuat: fromQuat,
        normalFromMat4: normalFromMat4,
        projection: projection,
        str: str$2,
        frob: frob$2,
        add: add$2,
        subtract: subtract$2,
        multiplyScalar: multiplyScalar$2,
        multiplyScalarAndAdd: multiplyScalarAndAdd$2,
        exactEquals: exactEquals$2,
        equals: equals$3,
        mul: mul$2,
        sub: sub$2
    });

    /**
     * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
     * @module mat4
     */

    /**
     * Creates a new identity mat4
     *
     * @returns {mat4} a new 4x4 matrix
     */

    function create$3() {
      var out = new ARRAY_TYPE(16);

      if (ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
      }

      out[0] = 1;
      out[5] = 1;
      out[10] = 1;
      out[15] = 1;
      return out;
    }
    /**
     * Creates a new mat4 initialized with values from an existing matrix
     *
     * @param {ReadonlyMat4} a matrix to clone
     * @returns {mat4} a new 4x4 matrix
     */

    function clone$3(a) {
      var out = new ARRAY_TYPE(16);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
      return out;
    }
    /**
     * Copy the values from one mat4 to another
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the source matrix
     * @returns {mat4} out
     */

    function copy$3(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
      return out;
    }
    /**
     * Create a new mat4 with the given values
     *
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m03 Component in column 0, row 3 position (index 3)
     * @param {Number} m10 Component in column 1, row 0 position (index 4)
     * @param {Number} m11 Component in column 1, row 1 position (index 5)
     * @param {Number} m12 Component in column 1, row 2 position (index 6)
     * @param {Number} m13 Component in column 1, row 3 position (index 7)
     * @param {Number} m20 Component in column 2, row 0 position (index 8)
     * @param {Number} m21 Component in column 2, row 1 position (index 9)
     * @param {Number} m22 Component in column 2, row 2 position (index 10)
     * @param {Number} m23 Component in column 2, row 3 position (index 11)
     * @param {Number} m30 Component in column 3, row 0 position (index 12)
     * @param {Number} m31 Component in column 3, row 1 position (index 13)
     * @param {Number} m32 Component in column 3, row 2 position (index 14)
     * @param {Number} m33 Component in column 3, row 3 position (index 15)
     * @returns {mat4} A new mat4
     */

    function fromValues$3(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      var out = new ARRAY_TYPE(16);
      out[0] = m00;
      out[1] = m01;
      out[2] = m02;
      out[3] = m03;
      out[4] = m10;
      out[5] = m11;
      out[6] = m12;
      out[7] = m13;
      out[8] = m20;
      out[9] = m21;
      out[10] = m22;
      out[11] = m23;
      out[12] = m30;
      out[13] = m31;
      out[14] = m32;
      out[15] = m33;
      return out;
    }
    /**
     * Set the components of a mat4 to the given values
     *
     * @param {mat4} out the receiving matrix
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m03 Component in column 0, row 3 position (index 3)
     * @param {Number} m10 Component in column 1, row 0 position (index 4)
     * @param {Number} m11 Component in column 1, row 1 position (index 5)
     * @param {Number} m12 Component in column 1, row 2 position (index 6)
     * @param {Number} m13 Component in column 1, row 3 position (index 7)
     * @param {Number} m20 Component in column 2, row 0 position (index 8)
     * @param {Number} m21 Component in column 2, row 1 position (index 9)
     * @param {Number} m22 Component in column 2, row 2 position (index 10)
     * @param {Number} m23 Component in column 2, row 3 position (index 11)
     * @param {Number} m30 Component in column 3, row 0 position (index 12)
     * @param {Number} m31 Component in column 3, row 1 position (index 13)
     * @param {Number} m32 Component in column 3, row 2 position (index 14)
     * @param {Number} m33 Component in column 3, row 3 position (index 15)
     * @returns {mat4} out
     */

    function set$3(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      out[0] = m00;
      out[1] = m01;
      out[2] = m02;
      out[3] = m03;
      out[4] = m10;
      out[5] = m11;
      out[6] = m12;
      out[7] = m13;
      out[8] = m20;
      out[9] = m21;
      out[10] = m22;
      out[11] = m23;
      out[12] = m30;
      out[13] = m31;
      out[14] = m32;
      out[15] = m33;
      return out;
    }
    /**
     * Set a mat4 to the identity matrix
     *
     * @param {mat4} out the receiving matrix
     * @returns {mat4} out
     */

    function identity$3(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    /**
     * Transpose the values of a mat4
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the source matrix
     * @returns {mat4} out
     */

    function transpose$2(out, a) {
      // If we are transposing ourselves we can skip a few steps but have to cache some values
      if (out === a) {
        var a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        var a12 = a[6],
            a13 = a[7];
        var a23 = a[11];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
      } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
      }

      return out;
    }
    /**
     * Inverts a mat4
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the source matrix
     * @returns {mat4} out
     */

    function invert$3(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
      var a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
      var a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
      var a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15];
      var b00 = a00 * a11 - a01 * a10;
      var b01 = a00 * a12 - a02 * a10;
      var b02 = a00 * a13 - a03 * a10;
      var b03 = a01 * a12 - a02 * a11;
      var b04 = a01 * a13 - a03 * a11;
      var b05 = a02 * a13 - a03 * a12;
      var b06 = a20 * a31 - a21 * a30;
      var b07 = a20 * a32 - a22 * a30;
      var b08 = a20 * a33 - a23 * a30;
      var b09 = a21 * a32 - a22 * a31;
      var b10 = a21 * a33 - a23 * a31;
      var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

      var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

      if (!det) {
        return null;
      }

      det = 1.0 / det;
      out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
      out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
      out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
      out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
      out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
      out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
      out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
      out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
      out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
      out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
      out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
      out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
      out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
      out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
      out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
      out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
      return out;
    }
    /**
     * Calculates the adjugate of a mat4
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the source matrix
     * @returns {mat4} out
     */

    function adjoint$2(out, a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
      var a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
      var a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
      var a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15];
      out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
      out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
      out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
      out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
      out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
      out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
      out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
      out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
      out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
      out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
      out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
      out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
      out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
      out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
      out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
      out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
      return out;
    }
    /**
     * Calculates the determinant of a mat4
     *
     * @param {ReadonlyMat4} a the source matrix
     * @returns {Number} determinant of a
     */

    function determinant$3(a) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
      var a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
      var a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
      var a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15];
      var b00 = a00 * a11 - a01 * a10;
      var b01 = a00 * a12 - a02 * a10;
      var b02 = a00 * a13 - a03 * a10;
      var b03 = a01 * a12 - a02 * a11;
      var b04 = a01 * a13 - a03 * a11;
      var b05 = a02 * a13 - a03 * a12;
      var b06 = a20 * a31 - a21 * a30;
      var b07 = a20 * a32 - a22 * a30;
      var b08 = a20 * a33 - a23 * a30;
      var b09 = a21 * a32 - a22 * a31;
      var b10 = a21 * a33 - a23 * a31;
      var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

      return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }
    /**
     * Multiplies two mat4s
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {mat4} out
     */

    function multiply$3(out, a, b) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
      var a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
      var a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
      var a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15]; // Cache only the current line of the second matrix

      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];
      out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[4];
      b1 = b[5];
      b2 = b[6];
      b3 = b[7];
      out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[8];
      b1 = b[9];
      b2 = b[10];
      b3 = b[11];
      out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[12];
      b1 = b[13];
      b2 = b[14];
      b3 = b[15];
      out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      return out;
    }
    /**
     * Translate a mat4 by the given vector
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to translate
     * @param {ReadonlyVec3} v vector to translate by
     * @returns {mat4} out
     */

    function translate$2(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2];
      var a00, a01, a02, a03;
      var a10, a11, a12, a13;
      var a20, a21, a22, a23;

      if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
      } else {
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a03;
        out[4] = a10;
        out[5] = a11;
        out[6] = a12;
        out[7] = a13;
        out[8] = a20;
        out[9] = a21;
        out[10] = a22;
        out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
      }

      return out;
    }
    /**
     * Scales the mat4 by the dimensions in the given vec3 not using vectorization
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to scale
     * @param {ReadonlyVec3} v the vec3 to scale the matrix by
     * @returns {mat4} out
     **/

    function scale$3(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2];
      out[0] = a[0] * x;
      out[1] = a[1] * x;
      out[2] = a[2] * x;
      out[3] = a[3] * x;
      out[4] = a[4] * y;
      out[5] = a[5] * y;
      out[6] = a[6] * y;
      out[7] = a[7] * y;
      out[8] = a[8] * z;
      out[9] = a[9] * z;
      out[10] = a[10] * z;
      out[11] = a[11] * z;
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
      return out;
    }
    /**
     * Rotates a mat4 by the given angle around the given axis
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @param {ReadonlyVec3} axis the axis to rotate around
     * @returns {mat4} out
     */

    function rotate$3(out, a, rad, axis) {
      var x = axis[0],
          y = axis[1],
          z = axis[2];
      var len = Math.hypot(x, y, z);
      var s, c, t;
      var a00, a01, a02, a03;
      var a10, a11, a12, a13;
      var a20, a21, a22, a23;
      var b00, b01, b02;
      var b10, b11, b12;
      var b20, b21, b22;

      if (len < EPSILON) {
        return null;
      }

      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;
      s = Math.sin(rad);
      c = Math.cos(rad);
      t = 1 - c;
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11]; // Construct the elements of the rotation matrix

      b00 = x * x * t + c;
      b01 = y * x * t + z * s;
      b02 = z * x * t - y * s;
      b10 = x * y * t - z * s;
      b11 = y * y * t + c;
      b12 = z * y * t + x * s;
      b20 = x * z * t + y * s;
      b21 = y * z * t - x * s;
      b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

      out[0] = a00 * b00 + a10 * b01 + a20 * b02;
      out[1] = a01 * b00 + a11 * b01 + a21 * b02;
      out[2] = a02 * b00 + a12 * b01 + a22 * b02;
      out[3] = a03 * b00 + a13 * b01 + a23 * b02;
      out[4] = a00 * b10 + a10 * b11 + a20 * b12;
      out[5] = a01 * b10 + a11 * b11 + a21 * b12;
      out[6] = a02 * b10 + a12 * b11 + a22 * b12;
      out[7] = a03 * b10 + a13 * b11 + a23 * b12;
      out[8] = a00 * b20 + a10 * b21 + a20 * b22;
      out[9] = a01 * b20 + a11 * b21 + a21 * b22;
      out[10] = a02 * b20 + a12 * b21 + a22 * b22;
      out[11] = a03 * b20 + a13 * b21 + a23 * b22;

      if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      }

      return out;
    }
    /**
     * Rotates a matrix by the given angle around the X axis
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */

    function rotateX(out, a, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      var a10 = a[4];
      var a11 = a[5];
      var a12 = a[6];
      var a13 = a[7];
      var a20 = a[8];
      var a21 = a[9];
      var a22 = a[10];
      var a23 = a[11];

      if (a !== out) {
        // If the source and destination differ, copy the unchanged rows
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      } // Perform axis-specific matrix multiplication


      out[4] = a10 * c + a20 * s;
      out[5] = a11 * c + a21 * s;
      out[6] = a12 * c + a22 * s;
      out[7] = a13 * c + a23 * s;
      out[8] = a20 * c - a10 * s;
      out[9] = a21 * c - a11 * s;
      out[10] = a22 * c - a12 * s;
      out[11] = a23 * c - a13 * s;
      return out;
    }
    /**
     * Rotates a matrix by the given angle around the Y axis
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */

    function rotateY(out, a, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      var a00 = a[0];
      var a01 = a[1];
      var a02 = a[2];
      var a03 = a[3];
      var a20 = a[8];
      var a21 = a[9];
      var a22 = a[10];
      var a23 = a[11];

      if (a !== out) {
        // If the source and destination differ, copy the unchanged rows
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      } // Perform axis-specific matrix multiplication


      out[0] = a00 * c - a20 * s;
      out[1] = a01 * c - a21 * s;
      out[2] = a02 * c - a22 * s;
      out[3] = a03 * c - a23 * s;
      out[8] = a00 * s + a20 * c;
      out[9] = a01 * s + a21 * c;
      out[10] = a02 * s + a22 * c;
      out[11] = a03 * s + a23 * c;
      return out;
    }
    /**
     * Rotates a matrix by the given angle around the Z axis
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */

    function rotateZ(out, a, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      var a00 = a[0];
      var a01 = a[1];
      var a02 = a[2];
      var a03 = a[3];
      var a10 = a[4];
      var a11 = a[5];
      var a12 = a[6];
      var a13 = a[7];

      if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      } // Perform axis-specific matrix multiplication


      out[0] = a00 * c + a10 * s;
      out[1] = a01 * c + a11 * s;
      out[2] = a02 * c + a12 * s;
      out[3] = a03 * c + a13 * s;
      out[4] = a10 * c - a00 * s;
      out[5] = a11 * c - a01 * s;
      out[6] = a12 * c - a02 * s;
      out[7] = a13 * c - a03 * s;
      return out;
    }
    /**
     * Creates a matrix from a vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, dest, vec);
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {ReadonlyVec3} v Translation vector
     * @returns {mat4} out
     */

    function fromTranslation$2(out, v) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = v[0];
      out[13] = v[1];
      out[14] = v[2];
      out[15] = 1;
      return out;
    }
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.scale(dest, dest, vec);
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {ReadonlyVec3} v Scaling vector
     * @returns {mat4} out
     */

    function fromScaling$3(out, v) {
      out[0] = v[0];
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = v[1];
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = v[2];
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    /**
     * Creates a matrix from a given angle around a given axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.rotate(dest, dest, rad, axis);
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @param {ReadonlyVec3} axis the axis to rotate around
     * @returns {mat4} out
     */

    function fromRotation$3(out, rad, axis) {
      var x = axis[0],
          y = axis[1],
          z = axis[2];
      var len = Math.hypot(x, y, z);
      var s, c, t;

      if (len < EPSILON) {
        return null;
      }

      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;
      s = Math.sin(rad);
      c = Math.cos(rad);
      t = 1 - c; // Perform rotation-specific matrix multiplication

      out[0] = x * x * t + c;
      out[1] = y * x * t + z * s;
      out[2] = z * x * t - y * s;
      out[3] = 0;
      out[4] = x * y * t - z * s;
      out[5] = y * y * t + c;
      out[6] = z * y * t + x * s;
      out[7] = 0;
      out[8] = x * z * t + y * s;
      out[9] = y * z * t - x * s;
      out[10] = z * z * t + c;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    /**
     * Creates a matrix from the given angle around the X axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.rotateX(dest, dest, rad);
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */

    function fromXRotation(out, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad); // Perform axis-specific matrix multiplication

      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = c;
      out[6] = s;
      out[7] = 0;
      out[8] = 0;
      out[9] = -s;
      out[10] = c;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    /**
     * Creates a matrix from the given angle around the Y axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.rotateY(dest, dest, rad);
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */

    function fromYRotation(out, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad); // Perform axis-specific matrix multiplication

      out[0] = c;
      out[1] = 0;
      out[2] = -s;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = s;
      out[9] = 0;
      out[10] = c;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    /**
     * Creates a matrix from the given angle around the Z axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.rotateZ(dest, dest, rad);
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */

    function fromZRotation(out, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad); // Perform axis-specific matrix multiplication

      out[0] = c;
      out[1] = s;
      out[2] = 0;
      out[3] = 0;
      out[4] = -s;
      out[5] = c;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    /**
     * Creates a matrix from a quaternion rotation and vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     let quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {quat4} q Rotation quaternion
     * @param {ReadonlyVec3} v Translation vector
     * @returns {mat4} out
     */

    function fromRotationTranslation(out, q, v) {
      // Quaternion math
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3];
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var xy = x * y2;
      var xz = x * z2;
      var yy = y * y2;
      var yz = y * z2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      out[0] = 1 - (yy + zz);
      out[1] = xy + wz;
      out[2] = xz - wy;
      out[3] = 0;
      out[4] = xy - wz;
      out[5] = 1 - (xx + zz);
      out[6] = yz + wx;
      out[7] = 0;
      out[8] = xz + wy;
      out[9] = yz - wx;
      out[10] = 1 - (xx + yy);
      out[11] = 0;
      out[12] = v[0];
      out[13] = v[1];
      out[14] = v[2];
      out[15] = 1;
      return out;
    }
    /**
     * Creates a new mat4 from a dual quat.
     *
     * @param {mat4} out Matrix
     * @param {ReadonlyQuat2} a Dual Quaternion
     * @returns {mat4} mat4 receiving operation result
     */

    function fromQuat2(out, a) {
      var translation = new ARRAY_TYPE(3);
      var bx = -a[0],
          by = -a[1],
          bz = -a[2],
          bw = a[3],
          ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7];
      var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

      if (magnitude > 0) {
        translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
        translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
        translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
      } else {
        translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
        translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
        translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
      }

      fromRotationTranslation(out, a, translation);
      return out;
    }
    /**
     * Returns the translation vector component of a transformation
     *  matrix. If a matrix is built with fromRotationTranslation,
     *  the returned vector will be the same as the translation vector
     *  originally supplied.
     * @param  {vec3} out Vector to receive translation component
     * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
     * @return {vec3} out
     */

    function getTranslation(out, mat) {
      out[0] = mat[12];
      out[1] = mat[13];
      out[2] = mat[14];
      return out;
    }
    /**
     * Returns the scaling factor component of a transformation
     *  matrix. If a matrix is built with fromRotationTranslationScale
     *  with a normalized Quaternion paramter, the returned vector will be
     *  the same as the scaling vector
     *  originally supplied.
     * @param  {vec3} out Vector to receive scaling factor component
     * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
     * @return {vec3} out
     */

    function getScaling(out, mat) {
      var m11 = mat[0];
      var m12 = mat[1];
      var m13 = mat[2];
      var m21 = mat[4];
      var m22 = mat[5];
      var m23 = mat[6];
      var m31 = mat[8];
      var m32 = mat[9];
      var m33 = mat[10];
      out[0] = Math.hypot(m11, m12, m13);
      out[1] = Math.hypot(m21, m22, m23);
      out[2] = Math.hypot(m31, m32, m33);
      return out;
    }
    /**
     * Returns a quaternion representing the rotational component
     *  of a transformation matrix. If a matrix is built with
     *  fromRotationTranslation, the returned quaternion will be the
     *  same as the quaternion originally supplied.
     * @param {quat} out Quaternion to receive the rotation component
     * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
     * @return {quat} out
     */

    function getRotation(out, mat) {
      var scaling = new ARRAY_TYPE(3);
      getScaling(scaling, mat);
      var is1 = 1 / scaling[0];
      var is2 = 1 / scaling[1];
      var is3 = 1 / scaling[2];
      var sm11 = mat[0] * is1;
      var sm12 = mat[1] * is2;
      var sm13 = mat[2] * is3;
      var sm21 = mat[4] * is1;
      var sm22 = mat[5] * is2;
      var sm23 = mat[6] * is3;
      var sm31 = mat[8] * is1;
      var sm32 = mat[9] * is2;
      var sm33 = mat[10] * is3;
      var trace = sm11 + sm22 + sm33;
      var S = 0;

      if (trace > 0) {
        S = Math.sqrt(trace + 1.0) * 2;
        out[3] = 0.25 * S;
        out[0] = (sm23 - sm32) / S;
        out[1] = (sm31 - sm13) / S;
        out[2] = (sm12 - sm21) / S;
      } else if (sm11 > sm22 && sm11 > sm33) {
        S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
        out[3] = (sm23 - sm32) / S;
        out[0] = 0.25 * S;
        out[1] = (sm12 + sm21) / S;
        out[2] = (sm31 + sm13) / S;
      } else if (sm22 > sm33) {
        S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
        out[3] = (sm31 - sm13) / S;
        out[0] = (sm12 + sm21) / S;
        out[1] = 0.25 * S;
        out[2] = (sm23 + sm32) / S;
      } else {
        S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
        out[3] = (sm12 - sm21) / S;
        out[0] = (sm31 + sm13) / S;
        out[1] = (sm23 + sm32) / S;
        out[2] = 0.25 * S;
      }

      return out;
    }
    /**
     * Creates a matrix from a quaternion rotation, vector translation and vector scale
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     let quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *     mat4.scale(dest, scale)
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {quat4} q Rotation quaternion
     * @param {ReadonlyVec3} v Translation vector
     * @param {ReadonlyVec3} s Scaling vector
     * @returns {mat4} out
     */

    function fromRotationTranslationScale(out, q, v, s) {
      // Quaternion math
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3];
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var xy = x * y2;
      var xz = x * z2;
      var yy = y * y2;
      var yz = y * z2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      var sx = s[0];
      var sy = s[1];
      var sz = s[2];
      out[0] = (1 - (yy + zz)) * sx;
      out[1] = (xy + wz) * sx;
      out[2] = (xz - wy) * sx;
      out[3] = 0;
      out[4] = (xy - wz) * sy;
      out[5] = (1 - (xx + zz)) * sy;
      out[6] = (yz + wx) * sy;
      out[7] = 0;
      out[8] = (xz + wy) * sz;
      out[9] = (yz - wx) * sz;
      out[10] = (1 - (xx + yy)) * sz;
      out[11] = 0;
      out[12] = v[0];
      out[13] = v[1];
      out[14] = v[2];
      out[15] = 1;
      return out;
    }
    /**
     * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     mat4.translate(dest, origin);
     *     let quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *     mat4.scale(dest, scale)
     *     mat4.translate(dest, negativeOrigin);
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {quat4} q Rotation quaternion
     * @param {ReadonlyVec3} v Translation vector
     * @param {ReadonlyVec3} s Scaling vector
     * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
     * @returns {mat4} out
     */

    function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
      // Quaternion math
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3];
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var xy = x * y2;
      var xz = x * z2;
      var yy = y * y2;
      var yz = y * z2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      var sx = s[0];
      var sy = s[1];
      var sz = s[2];
      var ox = o[0];
      var oy = o[1];
      var oz = o[2];
      var out0 = (1 - (yy + zz)) * sx;
      var out1 = (xy + wz) * sx;
      var out2 = (xz - wy) * sx;
      var out4 = (xy - wz) * sy;
      var out5 = (1 - (xx + zz)) * sy;
      var out6 = (yz + wx) * sy;
      var out8 = (xz + wy) * sz;
      var out9 = (yz - wx) * sz;
      var out10 = (1 - (xx + yy)) * sz;
      out[0] = out0;
      out[1] = out1;
      out[2] = out2;
      out[3] = 0;
      out[4] = out4;
      out[5] = out5;
      out[6] = out6;
      out[7] = 0;
      out[8] = out8;
      out[9] = out9;
      out[10] = out10;
      out[11] = 0;
      out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
      out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
      out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
      out[15] = 1;
      return out;
    }
    /**
     * Calculates a 4x4 matrix from the given quaternion
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {ReadonlyQuat} q Quaternion to create matrix from
     *
     * @returns {mat4} out
     */

    function fromQuat$1(out, q) {
      var x = q[0],
          y = q[1],
          z = q[2],
          w = q[3];
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var yx = y * x2;
      var yy = y * y2;
      var zx = z * x2;
      var zy = z * y2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      out[0] = 1 - yy - zz;
      out[1] = yx + wz;
      out[2] = zx - wy;
      out[3] = 0;
      out[4] = yx - wz;
      out[5] = 1 - xx - zz;
      out[6] = zy + wx;
      out[7] = 0;
      out[8] = zx + wy;
      out[9] = zy - wx;
      out[10] = 1 - xx - yy;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    /**
     * Generates a frustum matrix with the given bounds
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {Number} left Left bound of the frustum
     * @param {Number} right Right bound of the frustum
     * @param {Number} bottom Bottom bound of the frustum
     * @param {Number} top Top bound of the frustum
     * @param {Number} near Near bound of the frustum
     * @param {Number} far Far bound of the frustum
     * @returns {mat4} out
     */

    function frustum(out, left, right, bottom, top, near, far) {
      var rl = 1 / (right - left);
      var tb = 1 / (top - bottom);
      var nf = 1 / (near - far);
      out[0] = near * 2 * rl;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = near * 2 * tb;
      out[6] = 0;
      out[7] = 0;
      out[8] = (right + left) * rl;
      out[9] = (top + bottom) * tb;
      out[10] = (far + near) * nf;
      out[11] = -1;
      out[12] = 0;
      out[13] = 0;
      out[14] = far * near * 2 * nf;
      out[15] = 0;
      return out;
    }
    /**
     * Generates a perspective projection matrix with the given bounds.
     * Passing null/undefined/no value for far will generate infinite projection matrix.
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {number} fovy Vertical field of view in radians
     * @param {number} aspect Aspect ratio. typically viewport width/height
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum, can be null or Infinity
     * @returns {mat4} out
     */

    function perspective(out, fovy, aspect, near, far) {
      var f = 1.0 / Math.tan(fovy / 2),
          nf;
      out[0] = f / aspect;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = f;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = -1;
      out[12] = 0;
      out[13] = 0;
      out[15] = 0;

      if (far != null && far !== Infinity) {
        nf = 1 / (near - far);
        out[10] = (far + near) * nf;
        out[14] = 2 * far * near * nf;
      } else {
        out[10] = -1;
        out[14] = -2 * near;
      }

      return out;
    }
    /**
     * Generates a perspective projection matrix with the given field of view.
     * This is primarily useful for generating projection matrices to be used
     * with the still experiemental WebVR API.
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {mat4} out
     */

    function perspectiveFromFieldOfView(out, fov, near, far) {
      var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
      var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
      var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
      var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
      var xScale = 2.0 / (leftTan + rightTan);
      var yScale = 2.0 / (upTan + downTan);
      out[0] = xScale;
      out[1] = 0.0;
      out[2] = 0.0;
      out[3] = 0.0;
      out[4] = 0.0;
      out[5] = yScale;
      out[6] = 0.0;
      out[7] = 0.0;
      out[8] = -((leftTan - rightTan) * xScale * 0.5);
      out[9] = (upTan - downTan) * yScale * 0.5;
      out[10] = far / (near - far);
      out[11] = -1.0;
      out[12] = 0.0;
      out[13] = 0.0;
      out[14] = far * near / (near - far);
      out[15] = 0.0;
      return out;
    }
    /**
     * Generates a orthogonal projection matrix with the given bounds
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {number} left Left bound of the frustum
     * @param {number} right Right bound of the frustum
     * @param {number} bottom Bottom bound of the frustum
     * @param {number} top Top bound of the frustum
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {mat4} out
     */

    function ortho(out, left, right, bottom, top, near, far) {
      var lr = 1 / (left - right);
      var bt = 1 / (bottom - top);
      var nf = 1 / (near - far);
      out[0] = -2 * lr;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = -2 * bt;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 2 * nf;
      out[11] = 0;
      out[12] = (left + right) * lr;
      out[13] = (top + bottom) * bt;
      out[14] = (far + near) * nf;
      out[15] = 1;
      return out;
    }
    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis.
     * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {ReadonlyVec3} eye Position of the viewer
     * @param {ReadonlyVec3} center Point the viewer is looking at
     * @param {ReadonlyVec3} up vec3 pointing up
     * @returns {mat4} out
     */

    function lookAt(out, eye, center, up) {
      var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
      var eyex = eye[0];
      var eyey = eye[1];
      var eyez = eye[2];
      var upx = up[0];
      var upy = up[1];
      var upz = up[2];
      var centerx = center[0];
      var centery = center[1];
      var centerz = center[2];

      if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
        return identity$3(out);
      }

      z0 = eyex - centerx;
      z1 = eyey - centery;
      z2 = eyez - centerz;
      len = 1 / Math.hypot(z0, z1, z2);
      z0 *= len;
      z1 *= len;
      z2 *= len;
      x0 = upy * z2 - upz * z1;
      x1 = upz * z0 - upx * z2;
      x2 = upx * z1 - upy * z0;
      len = Math.hypot(x0, x1, x2);

      if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
      } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
      }

      y0 = z1 * x2 - z2 * x1;
      y1 = z2 * x0 - z0 * x2;
      y2 = z0 * x1 - z1 * x0;
      len = Math.hypot(y0, y1, y2);

      if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
      } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
      }

      out[0] = x0;
      out[1] = y0;
      out[2] = z0;
      out[3] = 0;
      out[4] = x1;
      out[5] = y1;
      out[6] = z1;
      out[7] = 0;
      out[8] = x2;
      out[9] = y2;
      out[10] = z2;
      out[11] = 0;
      out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
      out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
      out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
      out[15] = 1;
      return out;
    }
    /**
     * Generates a matrix that makes something look at something else.
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {ReadonlyVec3} eye Position of the viewer
     * @param {ReadonlyVec3} center Point the viewer is looking at
     * @param {ReadonlyVec3} up vec3 pointing up
     * @returns {mat4} out
     */

    function targetTo(out, eye, target, up) {
      var eyex = eye[0],
          eyey = eye[1],
          eyez = eye[2],
          upx = up[0],
          upy = up[1],
          upz = up[2];
      var z0 = eyex - target[0],
          z1 = eyey - target[1],
          z2 = eyez - target[2];
      var len = z0 * z0 + z1 * z1 + z2 * z2;

      if (len > 0) {
        len = 1 / Math.sqrt(len);
        z0 *= len;
        z1 *= len;
        z2 *= len;
      }

      var x0 = upy * z2 - upz * z1,
          x1 = upz * z0 - upx * z2,
          x2 = upx * z1 - upy * z0;
      len = x0 * x0 + x1 * x1 + x2 * x2;

      if (len > 0) {
        len = 1 / Math.sqrt(len);
        x0 *= len;
        x1 *= len;
        x2 *= len;
      }

      out[0] = x0;
      out[1] = x1;
      out[2] = x2;
      out[3] = 0;
      out[4] = z1 * x2 - z2 * x1;
      out[5] = z2 * x0 - z0 * x2;
      out[6] = z0 * x1 - z1 * x0;
      out[7] = 0;
      out[8] = z0;
      out[9] = z1;
      out[10] = z2;
      out[11] = 0;
      out[12] = eyex;
      out[13] = eyey;
      out[14] = eyez;
      out[15] = 1;
      return out;
    }
    /**
     * Returns a string representation of a mat4
     *
     * @param {ReadonlyMat4} a matrix to represent as a string
     * @returns {String} string representation of the matrix
     */

    function str$3(a) {
      return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
    }
    /**
     * Returns Frobenius norm of a mat4
     *
     * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
     * @returns {Number} Frobenius norm
     */

    function frob$3(a) {
      return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
    }
    /**
     * Adds two mat4's
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {mat4} out
     */

    function add$3(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      out[4] = a[4] + b[4];
      out[5] = a[5] + b[5];
      out[6] = a[6] + b[6];
      out[7] = a[7] + b[7];
      out[8] = a[8] + b[8];
      out[9] = a[9] + b[9];
      out[10] = a[10] + b[10];
      out[11] = a[11] + b[11];
      out[12] = a[12] + b[12];
      out[13] = a[13] + b[13];
      out[14] = a[14] + b[14];
      out[15] = a[15] + b[15];
      return out;
    }
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {mat4} out
     */

    function subtract$3(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      out[3] = a[3] - b[3];
      out[4] = a[4] - b[4];
      out[5] = a[5] - b[5];
      out[6] = a[6] - b[6];
      out[7] = a[7] - b[7];
      out[8] = a[8] - b[8];
      out[9] = a[9] - b[9];
      out[10] = a[10] - b[10];
      out[11] = a[11] - b[11];
      out[12] = a[12] - b[12];
      out[13] = a[13] - b[13];
      out[14] = a[14] - b[14];
      out[15] = a[15] - b[15];
      return out;
    }
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {mat4} out
     */

    function multiplyScalar$3(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      out[4] = a[4] * b;
      out[5] = a[5] * b;
      out[6] = a[6] * b;
      out[7] = a[7] * b;
      out[8] = a[8] * b;
      out[9] = a[9] * b;
      out[10] = a[10] * b;
      out[11] = a[11] * b;
      out[12] = a[12] * b;
      out[13] = a[13] * b;
      out[14] = a[14] * b;
      out[15] = a[15] * b;
      return out;
    }
    /**
     * Adds two mat4's after multiplying each element of the second operand by a scalar value.
     *
     * @param {mat4} out the receiving vector
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {mat4} out
     */

    function multiplyScalarAndAdd$3(out, a, b, scale) {
      out[0] = a[0] + b[0] * scale;
      out[1] = a[1] + b[1] * scale;
      out[2] = a[2] + b[2] * scale;
      out[3] = a[3] + b[3] * scale;
      out[4] = a[4] + b[4] * scale;
      out[5] = a[5] + b[5] * scale;
      out[6] = a[6] + b[6] * scale;
      out[7] = a[7] + b[7] * scale;
      out[8] = a[8] + b[8] * scale;
      out[9] = a[9] + b[9] * scale;
      out[10] = a[10] + b[10] * scale;
      out[11] = a[11] + b[11] * scale;
      out[12] = a[12] + b[12] * scale;
      out[13] = a[13] + b[13] * scale;
      out[14] = a[14] + b[14] * scale;
      out[15] = a[15] + b[15] * scale;
      return out;
    }
    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyMat4} a The first matrix.
     * @param {ReadonlyMat4} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */

    function exactEquals$3(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
    }
    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     *
     * @param {ReadonlyMat4} a The first matrix.
     * @param {ReadonlyMat4} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */

    function equals$4(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3];
      var a4 = a[4],
          a5 = a[5],
          a6 = a[6],
          a7 = a[7];
      var a8 = a[8],
          a9 = a[9],
          a10 = a[10],
          a11 = a[11];
      var a12 = a[12],
          a13 = a[13],
          a14 = a[14],
          a15 = a[15];
      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];
      var b4 = b[4],
          b5 = b[5],
          b6 = b[6],
          b7 = b[7];
      var b8 = b[8],
          b9 = b[9],
          b10 = b[10],
          b11 = b[11];
      var b12 = b[12],
          b13 = b[13],
          b14 = b[14],
          b15 = b[15];
      return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
    }
    /**
     * Alias for {@link mat4.multiply}
     * @function
     */

    var mul$3 = multiply$3;
    /**
     * Alias for {@link mat4.subtract}
     * @function
     */

    var sub$3 = subtract$3;

    var mat4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$3,
        clone: clone$3,
        copy: copy$3,
        fromValues: fromValues$3,
        set: set$3,
        identity: identity$3,
        transpose: transpose$2,
        invert: invert$3,
        adjoint: adjoint$2,
        determinant: determinant$3,
        multiply: multiply$3,
        translate: translate$2,
        scale: scale$3,
        rotate: rotate$3,
        rotateX: rotateX,
        rotateY: rotateY,
        rotateZ: rotateZ,
        fromTranslation: fromTranslation$2,
        fromScaling: fromScaling$3,
        fromRotation: fromRotation$3,
        fromXRotation: fromXRotation,
        fromYRotation: fromYRotation,
        fromZRotation: fromZRotation,
        fromRotationTranslation: fromRotationTranslation,
        fromQuat2: fromQuat2,
        getTranslation: getTranslation,
        getScaling: getScaling,
        getRotation: getRotation,
        fromRotationTranslationScale: fromRotationTranslationScale,
        fromRotationTranslationScaleOrigin: fromRotationTranslationScaleOrigin,
        fromQuat: fromQuat$1,
        frustum: frustum,
        perspective: perspective,
        perspectiveFromFieldOfView: perspectiveFromFieldOfView,
        ortho: ortho,
        lookAt: lookAt,
        targetTo: targetTo,
        str: str$3,
        frob: frob$3,
        add: add$3,
        subtract: subtract$3,
        multiplyScalar: multiplyScalar$3,
        multiplyScalarAndAdd: multiplyScalarAndAdd$3,
        exactEquals: exactEquals$3,
        equals: equals$4,
        mul: mul$3,
        sub: sub$3
    });

    /**
     * 3 Dimensional Vector
     * @module vec3
     */

    /**
     * Creates a new, empty vec3
     *
     * @returns {vec3} a new 3D vector
     */

    function create$4() {
      var out = new ARRAY_TYPE(3);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }

      return out;
    }
    /**
     * Creates a new vec3 initialized with values from an existing vector
     *
     * @param {ReadonlyVec3} a vector to clone
     * @returns {vec3} a new 3D vector
     */

    function clone$4(a) {
      var out = new ARRAY_TYPE(3);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      return out;
    }
    /**
     * Calculates the length of a vec3
     *
     * @param {ReadonlyVec3} a vector to calculate length of
     * @returns {Number} length of a
     */

    function length(a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      return Math.hypot(x, y, z);
    }
    /**
     * Creates a new vec3 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {vec3} a new 3D vector
     */

    function fromValues$4(x, y, z) {
      var out = new ARRAY_TYPE(3);
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return out;
    }
    /**
     * Copy the values from one vec3 to another
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the source vector
     * @returns {vec3} out
     */

    function copy$4(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      return out;
    }
    /**
     * Set the components of a vec3 to the given values
     *
     * @param {vec3} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {vec3} out
     */

    function set$4(out, x, y, z) {
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return out;
    }
    /**
     * Adds two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function add$4(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      return out;
    }
    /**
     * Subtracts vector b from vector a
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function subtract$4(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      return out;
    }
    /**
     * Multiplies two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function multiply$4(out, a, b) {
      out[0] = a[0] * b[0];
      out[1] = a[1] * b[1];
      out[2] = a[2] * b[2];
      return out;
    }
    /**
     * Divides two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function divide(out, a, b) {
      out[0] = a[0] / b[0];
      out[1] = a[1] / b[1];
      out[2] = a[2] / b[2];
      return out;
    }
    /**
     * Math.ceil the components of a vec3
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to ceil
     * @returns {vec3} out
     */

    function ceil(out, a) {
      out[0] = Math.ceil(a[0]);
      out[1] = Math.ceil(a[1]);
      out[2] = Math.ceil(a[2]);
      return out;
    }
    /**
     * Math.floor the components of a vec3
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to floor
     * @returns {vec3} out
     */

    function floor(out, a) {
      out[0] = Math.floor(a[0]);
      out[1] = Math.floor(a[1]);
      out[2] = Math.floor(a[2]);
      return out;
    }
    /**
     * Returns the minimum of two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function min(out, a, b) {
      out[0] = Math.min(a[0], b[0]);
      out[1] = Math.min(a[1], b[1]);
      out[2] = Math.min(a[2], b[2]);
      return out;
    }
    /**
     * Returns the maximum of two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function max(out, a, b) {
      out[0] = Math.max(a[0], b[0]);
      out[1] = Math.max(a[1], b[1]);
      out[2] = Math.max(a[2], b[2]);
      return out;
    }
    /**
     * Math.round the components of a vec3
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to round
     * @returns {vec3} out
     */

    function round(out, a) {
      out[0] = Math.round(a[0]);
      out[1] = Math.round(a[1]);
      out[2] = Math.round(a[2]);
      return out;
    }
    /**
     * Scales a vec3 by a scalar number
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {vec3} out
     */

    function scale$4(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      return out;
    }
    /**
     * Adds two vec3's after scaling the second operand by a scalar value
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @returns {vec3} out
     */

    function scaleAndAdd(out, a, b, scale) {
      out[0] = a[0] + b[0] * scale;
      out[1] = a[1] + b[1] * scale;
      out[2] = a[2] + b[2] * scale;
      return out;
    }
    /**
     * Calculates the euclidian distance between two vec3's
     *
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Number} distance between a and b
     */

    function distance(a, b) {
      var x = b[0] - a[0];
      var y = b[1] - a[1];
      var z = b[2] - a[2];
      return Math.hypot(x, y, z);
    }
    /**
     * Calculates the squared euclidian distance between two vec3's
     *
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Number} squared distance between a and b
     */

    function squaredDistance(a, b) {
      var x = b[0] - a[0];
      var y = b[1] - a[1];
      var z = b[2] - a[2];
      return x * x + y * y + z * z;
    }
    /**
     * Calculates the squared length of a vec3
     *
     * @param {ReadonlyVec3} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */

    function squaredLength(a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      return x * x + y * y + z * z;
    }
    /**
     * Negates the components of a vec3
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to negate
     * @returns {vec3} out
     */

    function negate(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      out[2] = -a[2];
      return out;
    }
    /**
     * Returns the inverse of the components of a vec3
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to invert
     * @returns {vec3} out
     */

    function inverse(out, a) {
      out[0] = 1.0 / a[0];
      out[1] = 1.0 / a[1];
      out[2] = 1.0 / a[2];
      return out;
    }
    /**
     * Normalize a vec3
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to normalize
     * @returns {vec3} out
     */

    function normalize(out, a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var len = x * x + y * y + z * z;

      if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
      }

      out[0] = a[0] * len;
      out[1] = a[1] * len;
      out[2] = a[2] * len;
      return out;
    }
    /**
     * Calculates the dot product of two vec3's
     *
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Number} dot product of a and b
     */

    function dot$1(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    /**
     * Computes the cross product of two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function cross(out, a, b) {
      var ax = a[0],
          ay = a[1],
          az = a[2];
      var bx = b[0],
          by = b[1],
          bz = b[2];
      out[0] = ay * bz - az * by;
      out[1] = az * bx - ax * bz;
      out[2] = ax * by - ay * bx;
      return out;
    }
    /**
     * Performs a linear interpolation between two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {vec3} out
     */

    function lerp(out, a, b, t) {
      var ax = a[0];
      var ay = a[1];
      var az = a[2];
      out[0] = ax + t * (b[0] - ax);
      out[1] = ay + t * (b[1] - ay);
      out[2] = az + t * (b[2] - az);
      return out;
    }
    /**
     * Performs a hermite interpolation with two control points
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @param {ReadonlyVec3} c the third operand
     * @param {ReadonlyVec3} d the fourth operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {vec3} out
     */

    function hermite(out, a, b, c, d, t) {
      var factorTimes2 = t * t;
      var factor1 = factorTimes2 * (2 * t - 3) + 1;
      var factor2 = factorTimes2 * (t - 2) + t;
      var factor3 = factorTimes2 * (t - 1);
      var factor4 = factorTimes2 * (3 - 2 * t);
      out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
      out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
      out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
      return out;
    }
    /**
     * Performs a bezier interpolation with two control points
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @param {ReadonlyVec3} c the third operand
     * @param {ReadonlyVec3} d the fourth operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {vec3} out
     */

    function bezier(out, a, b, c, d, t) {
      var inverseFactor = 1 - t;
      var inverseFactorTimesTwo = inverseFactor * inverseFactor;
      var factorTimes2 = t * t;
      var factor1 = inverseFactorTimesTwo * inverseFactor;
      var factor2 = 3 * t * inverseFactorTimesTwo;
      var factor3 = 3 * factorTimes2 * inverseFactor;
      var factor4 = factorTimes2 * t;
      out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
      out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
      out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
      return out;
    }
    /**
     * Generates a random vector with the given scale
     *
     * @param {vec3} out the receiving vector
     * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
     * @returns {vec3} out
     */

    function random(out, scale) {
      scale = scale || 1.0;
      var r = RANDOM() * 2.0 * Math.PI;
      var z = RANDOM() * 2.0 - 1.0;
      var zScale = Math.sqrt(1.0 - z * z) * scale;
      out[0] = Math.cos(r) * zScale;
      out[1] = Math.sin(r) * zScale;
      out[2] = z * scale;
      return out;
    }
    /**
     * Transforms the vec3 with a mat4.
     * 4th vector component is implicitly '1'
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the vector to transform
     * @param {ReadonlyMat4} m matrix to transform with
     * @returns {vec3} out
     */

    function transformMat4(out, a, m) {
      var x = a[0],
          y = a[1],
          z = a[2];
      var w = m[3] * x + m[7] * y + m[11] * z + m[15];
      w = w || 1.0;
      out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
      out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
      out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
      return out;
    }
    /**
     * Transforms the vec3 with a mat3.
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the vector to transform
     * @param {ReadonlyMat3} m the 3x3 matrix to transform with
     * @returns {vec3} out
     */

    function transformMat3(out, a, m) {
      var x = a[0],
          y = a[1],
          z = a[2];
      out[0] = x * m[0] + y * m[3] + z * m[6];
      out[1] = x * m[1] + y * m[4] + z * m[7];
      out[2] = x * m[2] + y * m[5] + z * m[8];
      return out;
    }
    /**
     * Transforms the vec3 with a quat
     * Can also be used for dual quaternions. (Multiply it with the real part)
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the vector to transform
     * @param {ReadonlyQuat} q quaternion to transform with
     * @returns {vec3} out
     */

    function transformQuat(out, a, q) {
      // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
      var qx = q[0],
          qy = q[1],
          qz = q[2],
          qw = q[3];
      var x = a[0],
          y = a[1],
          z = a[2]; // var qvec = [qx, qy, qz];
      // var uv = vec3.cross([], qvec, a);

      var uvx = qy * z - qz * y,
          uvy = qz * x - qx * z,
          uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

      var uuvx = qy * uvz - qz * uvy,
          uuvy = qz * uvx - qx * uvz,
          uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

      var w2 = qw * 2;
      uvx *= w2;
      uvy *= w2;
      uvz *= w2; // vec3.scale(uuv, uuv, 2);

      uuvx *= 2;
      uuvy *= 2;
      uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

      out[0] = x + uvx + uuvx;
      out[1] = y + uvy + uuvy;
      out[2] = z + uvz + uuvz;
      return out;
    }
    /**
     * Rotate a 3D vector around the x-axis
     * @param {vec3} out The receiving vec3
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @returns {vec3} out
     */

    function rotateX$1(out, a, b, rad) {
      var p = [],
          r = []; //Translate point to the origin

      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2]; //perform rotation

      r[0] = p[0];
      r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
      r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

      out[0] = r[0] + b[0];
      out[1] = r[1] + b[1];
      out[2] = r[2] + b[2];
      return out;
    }
    /**
     * Rotate a 3D vector around the y-axis
     * @param {vec3} out The receiving vec3
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @returns {vec3} out
     */

    function rotateY$1(out, a, b, rad) {
      var p = [],
          r = []; //Translate point to the origin

      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2]; //perform rotation

      r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
      r[1] = p[1];
      r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

      out[0] = r[0] + b[0];
      out[1] = r[1] + b[1];
      out[2] = r[2] + b[2];
      return out;
    }
    /**
     * Rotate a 3D vector around the z-axis
     * @param {vec3} out The receiving vec3
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @returns {vec3} out
     */

    function rotateZ$1(out, a, b, rad) {
      var p = [],
          r = []; //Translate point to the origin

      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2]; //perform rotation

      r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
      r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
      r[2] = p[2]; //translate to correct position

      out[0] = r[0] + b[0];
      out[1] = r[1] + b[1];
      out[2] = r[2] + b[2];
      return out;
    }
    /**
     * Get the angle between two 3D vectors
     * @param {ReadonlyVec3} a The first operand
     * @param {ReadonlyVec3} b The second operand
     * @returns {Number} The angle in radians
     */

    function angle(a, b) {
      var ax = a[0],
          ay = a[1],
          az = a[2],
          bx = b[0],
          by = b[1],
          bz = b[2],
          mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
          mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
          mag = mag1 * mag2,
          cosine = mag && dot$1(a, b) / mag;
      return Math.acos(Math.min(Math.max(cosine, -1), 1));
    }
    /**
     * Set the components of a vec3 to zero
     *
     * @param {vec3} out the receiving vector
     * @returns {vec3} out
     */

    function zero(out) {
      out[0] = 0.0;
      out[1] = 0.0;
      out[2] = 0.0;
      return out;
    }
    /**
     * Returns a string representation of a vector
     *
     * @param {ReadonlyVec3} a vector to represent as a string
     * @returns {String} string representation of the vector
     */

    function str$4(a) {
      return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
    }
    /**
     * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyVec3} a The first vector.
     * @param {ReadonlyVec3} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */

    function exactEquals$4(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
    }
    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     *
     * @param {ReadonlyVec3} a The first vector.
     * @param {ReadonlyVec3} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */

    function equals$5(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2];
      var b0 = b[0],
          b1 = b[1],
          b2 = b[2];
      return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
    }
    /**
     * Alias for {@link vec3.subtract}
     * @function
     */

    var sub$4 = subtract$4;
    /**
     * Alias for {@link vec3.multiply}
     * @function
     */

    var mul$4 = multiply$4;
    /**
     * Alias for {@link vec3.divide}
     * @function
     */

    var div = divide;
    /**
     * Alias for {@link vec3.distance}
     * @function
     */

    var dist = distance;
    /**
     * Alias for {@link vec3.squaredDistance}
     * @function
     */

    var sqrDist = squaredDistance;
    /**
     * Alias for {@link vec3.length}
     * @function
     */

    var len = length;
    /**
     * Alias for {@link vec3.squaredLength}
     * @function
     */

    var sqrLen = squaredLength;
    /**
     * Perform some operation over an array of vec3s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */

    var forEach = function () {
      var vec = create$4();
      return function (a, stride, offset, count, fn, arg) {
        var i, l;

        if (!stride) {
          stride = 3;
        }

        if (!offset) {
          offset = 0;
        }

        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }

        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          vec[2] = a[i + 2];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
          a[i + 2] = vec[2];
        }

        return a;
      };
    }();

    var vec3$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$4,
        clone: clone$4,
        length: length,
        fromValues: fromValues$4,
        copy: copy$4,
        set: set$4,
        add: add$4,
        subtract: subtract$4,
        multiply: multiply$4,
        divide: divide,
        ceil: ceil,
        floor: floor,
        min: min,
        max: max,
        round: round,
        scale: scale$4,
        scaleAndAdd: scaleAndAdd,
        distance: distance,
        squaredDistance: squaredDistance,
        squaredLength: squaredLength,
        negate: negate,
        inverse: inverse,
        normalize: normalize,
        dot: dot$1,
        cross: cross,
        lerp: lerp,
        hermite: hermite,
        bezier: bezier,
        random: random,
        transformMat4: transformMat4,
        transformMat3: transformMat3,
        transformQuat: transformQuat,
        rotateX: rotateX$1,
        rotateY: rotateY$1,
        rotateZ: rotateZ$1,
        angle: angle,
        zero: zero,
        str: str$4,
        exactEquals: exactEquals$4,
        equals: equals$5,
        sub: sub$4,
        mul: mul$4,
        div: div,
        dist: dist,
        sqrDist: sqrDist,
        len: len,
        sqrLen: sqrLen,
        forEach: forEach
    });

    /**
     * 4 Dimensional Vector
     * @module vec4
     */

    /**
     * Creates a new, empty vec4
     *
     * @returns {vec4} a new 4D vector
     */

    function create$5() {
      var out = new ARRAY_TYPE(4);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
      }

      return out;
    }
    /**
     * Creates a new vec4 initialized with values from an existing vector
     *
     * @param {ReadonlyVec4} a vector to clone
     * @returns {vec4} a new 4D vector
     */

    function clone$5(a) {
      var out = new ARRAY_TYPE(4);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      return out;
    }
    /**
     * Creates a new vec4 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @param {Number} w W component
     * @returns {vec4} a new 4D vector
     */

    function fromValues$5(x, y, z, w) {
      var out = new ARRAY_TYPE(4);
      out[0] = x;
      out[1] = y;
      out[2] = z;
      out[3] = w;
      return out;
    }
    /**
     * Copy the values from one vec4 to another
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the source vector
     * @returns {vec4} out
     */

    function copy$5(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      return out;
    }
    /**
     * Set the components of a vec4 to the given values
     *
     * @param {vec4} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @param {Number} w W component
     * @returns {vec4} out
     */

    function set$5(out, x, y, z, w) {
      out[0] = x;
      out[1] = y;
      out[2] = z;
      out[3] = w;
      return out;
    }
    /**
     * Adds two vec4's
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {vec4} out
     */

    function add$5(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      return out;
    }
    /**
     * Subtracts vector b from vector a
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {vec4} out
     */

    function subtract$5(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      out[3] = a[3] - b[3];
      return out;
    }
    /**
     * Multiplies two vec4's
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {vec4} out
     */

    function multiply$5(out, a, b) {
      out[0] = a[0] * b[0];
      out[1] = a[1] * b[1];
      out[2] = a[2] * b[2];
      out[3] = a[3] * b[3];
      return out;
    }
    /**
     * Divides two vec4's
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {vec4} out
     */

    function divide$1(out, a, b) {
      out[0] = a[0] / b[0];
      out[1] = a[1] / b[1];
      out[2] = a[2] / b[2];
      out[3] = a[3] / b[3];
      return out;
    }
    /**
     * Math.ceil the components of a vec4
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to ceil
     * @returns {vec4} out
     */

    function ceil$1(out, a) {
      out[0] = Math.ceil(a[0]);
      out[1] = Math.ceil(a[1]);
      out[2] = Math.ceil(a[2]);
      out[3] = Math.ceil(a[3]);
      return out;
    }
    /**
     * Math.floor the components of a vec4
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to floor
     * @returns {vec4} out
     */

    function floor$1(out, a) {
      out[0] = Math.floor(a[0]);
      out[1] = Math.floor(a[1]);
      out[2] = Math.floor(a[2]);
      out[3] = Math.floor(a[3]);
      return out;
    }
    /**
     * Returns the minimum of two vec4's
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {vec4} out
     */

    function min$1(out, a, b) {
      out[0] = Math.min(a[0], b[0]);
      out[1] = Math.min(a[1], b[1]);
      out[2] = Math.min(a[2], b[2]);
      out[3] = Math.min(a[3], b[3]);
      return out;
    }
    /**
     * Returns the maximum of two vec4's
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {vec4} out
     */

    function max$1(out, a, b) {
      out[0] = Math.max(a[0], b[0]);
      out[1] = Math.max(a[1], b[1]);
      out[2] = Math.max(a[2], b[2]);
      out[3] = Math.max(a[3], b[3]);
      return out;
    }
    /**
     * Math.round the components of a vec4
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to round
     * @returns {vec4} out
     */

    function round$1(out, a) {
      out[0] = Math.round(a[0]);
      out[1] = Math.round(a[1]);
      out[2] = Math.round(a[2]);
      out[3] = Math.round(a[3]);
      return out;
    }
    /**
     * Scales a vec4 by a scalar number
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {vec4} out
     */

    function scale$5(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      return out;
    }
    /**
     * Adds two vec4's after scaling the second operand by a scalar value
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @returns {vec4} out
     */

    function scaleAndAdd$1(out, a, b, scale) {
      out[0] = a[0] + b[0] * scale;
      out[1] = a[1] + b[1] * scale;
      out[2] = a[2] + b[2] * scale;
      out[3] = a[3] + b[3] * scale;
      return out;
    }
    /**
     * Calculates the euclidian distance between two vec4's
     *
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Number} distance between a and b
     */

    function distance$1(a, b) {
      var x = b[0] - a[0];
      var y = b[1] - a[1];
      var z = b[2] - a[2];
      var w = b[3] - a[3];
      return Math.hypot(x, y, z, w);
    }
    /**
     * Calculates the squared euclidian distance between two vec4's
     *
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Number} squared distance between a and b
     */

    function squaredDistance$1(a, b) {
      var x = b[0] - a[0];
      var y = b[1] - a[1];
      var z = b[2] - a[2];
      var w = b[3] - a[3];
      return x * x + y * y + z * z + w * w;
    }
    /**
     * Calculates the length of a vec4
     *
     * @param {ReadonlyVec4} a vector to calculate length of
     * @returns {Number} length of a
     */

    function length$1(a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var w = a[3];
      return Math.hypot(x, y, z, w);
    }
    /**
     * Calculates the squared length of a vec4
     *
     * @param {ReadonlyVec4} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */

    function squaredLength$1(a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var w = a[3];
      return x * x + y * y + z * z + w * w;
    }
    /**
     * Negates the components of a vec4
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to negate
     * @returns {vec4} out
     */

    function negate$1(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      out[2] = -a[2];
      out[3] = -a[3];
      return out;
    }
    /**
     * Returns the inverse of the components of a vec4
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to invert
     * @returns {vec4} out
     */

    function inverse$1(out, a) {
      out[0] = 1.0 / a[0];
      out[1] = 1.0 / a[1];
      out[2] = 1.0 / a[2];
      out[3] = 1.0 / a[3];
      return out;
    }
    /**
     * Normalize a vec4
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to normalize
     * @returns {vec4} out
     */

    function normalize$1(out, a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var w = a[3];
      var len = x * x + y * y + z * z + w * w;

      if (len > 0) {
        len = 1 / Math.sqrt(len);
      }

      out[0] = x * len;
      out[1] = y * len;
      out[2] = z * len;
      out[3] = w * len;
      return out;
    }
    /**
     * Calculates the dot product of two vec4's
     *
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Number} dot product of a and b
     */

    function dot$2(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }
    /**
     * Returns the cross-product of three vectors in a 4-dimensional space
     *
     * @param {ReadonlyVec4} result the receiving vector
     * @param {ReadonlyVec4} U the first vector
     * @param {ReadonlyVec4} V the second vector
     * @param {ReadonlyVec4} W the third vector
     * @returns {vec4} result
     */

    function cross$1(out, u, v, w) {
      var A = v[0] * w[1] - v[1] * w[0],
          B = v[0] * w[2] - v[2] * w[0],
          C = v[0] * w[3] - v[3] * w[0],
          D = v[1] * w[2] - v[2] * w[1],
          E = v[1] * w[3] - v[3] * w[1],
          F = v[2] * w[3] - v[3] * w[2];
      var G = u[0];
      var H = u[1];
      var I = u[2];
      var J = u[3];
      out[0] = H * F - I * E + J * D;
      out[1] = -(G * F) + I * C - J * B;
      out[2] = G * E - H * C + J * A;
      out[3] = -(G * D) + H * B - I * A;
      return out;
    }
    /**
     * Performs a linear interpolation between two vec4's
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {vec4} out
     */

    function lerp$1(out, a, b, t) {
      var ax = a[0];
      var ay = a[1];
      var az = a[2];
      var aw = a[3];
      out[0] = ax + t * (b[0] - ax);
      out[1] = ay + t * (b[1] - ay);
      out[2] = az + t * (b[2] - az);
      out[3] = aw + t * (b[3] - aw);
      return out;
    }
    /**
     * Generates a random vector with the given scale
     *
     * @param {vec4} out the receiving vector
     * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
     * @returns {vec4} out
     */

    function random$1(out, scale) {
      scale = scale || 1.0; // Marsaglia, George. Choosing a Point from the Surface of a
      // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
      // http://projecteuclid.org/euclid.aoms/1177692644;

      var v1, v2, v3, v4;
      var s1, s2;

      do {
        v1 = RANDOM() * 2 - 1;
        v2 = RANDOM() * 2 - 1;
        s1 = v1 * v1 + v2 * v2;
      } while (s1 >= 1);

      do {
        v3 = RANDOM() * 2 - 1;
        v4 = RANDOM() * 2 - 1;
        s2 = v3 * v3 + v4 * v4;
      } while (s2 >= 1);

      var d = Math.sqrt((1 - s1) / s2);
      out[0] = scale * v1;
      out[1] = scale * v2;
      out[2] = scale * v3 * d;
      out[3] = scale * v4 * d;
      return out;
    }
    /**
     * Transforms the vec4 with a mat4.
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the vector to transform
     * @param {ReadonlyMat4} m matrix to transform with
     * @returns {vec4} out
     */

    function transformMat4$1(out, a, m) {
      var x = a[0],
          y = a[1],
          z = a[2],
          w = a[3];
      out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
      out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
      out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
      out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
      return out;
    }
    /**
     * Transforms the vec4 with a quat
     *
     * @param {vec4} out the receiving vector
     * @param {ReadonlyVec4} a the vector to transform
     * @param {ReadonlyQuat} q quaternion to transform with
     * @returns {vec4} out
     */

    function transformQuat$1(out, a, q) {
      var x = a[0],
          y = a[1],
          z = a[2];
      var qx = q[0],
          qy = q[1],
          qz = q[2],
          qw = q[3]; // calculate quat * vec

      var ix = qw * x + qy * z - qz * y;
      var iy = qw * y + qz * x - qx * z;
      var iz = qw * z + qx * y - qy * x;
      var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

      out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
      out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
      out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
      out[3] = a[3];
      return out;
    }
    /**
     * Set the components of a vec4 to zero
     *
     * @param {vec4} out the receiving vector
     * @returns {vec4} out
     */

    function zero$1(out) {
      out[0] = 0.0;
      out[1] = 0.0;
      out[2] = 0.0;
      out[3] = 0.0;
      return out;
    }
    /**
     * Returns a string representation of a vector
     *
     * @param {ReadonlyVec4} a vector to represent as a string
     * @returns {String} string representation of the vector
     */

    function str$5(a) {
      return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
    }
    /**
     * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyVec4} a The first vector.
     * @param {ReadonlyVec4} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */

    function exactEquals$5(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     *
     * @param {ReadonlyVec4} a The first vector.
     * @param {ReadonlyVec4} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */

    function equals$6(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3];
      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];
      return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
    }
    /**
     * Alias for {@link vec4.subtract}
     * @function
     */

    var sub$5 = subtract$5;
    /**
     * Alias for {@link vec4.multiply}
     * @function
     */

    var mul$5 = multiply$5;
    /**
     * Alias for {@link vec4.divide}
     * @function
     */

    var div$1 = divide$1;
    /**
     * Alias for {@link vec4.distance}
     * @function
     */

    var dist$1 = distance$1;
    /**
     * Alias for {@link vec4.squaredDistance}
     * @function
     */

    var sqrDist$1 = squaredDistance$1;
    /**
     * Alias for {@link vec4.length}
     * @function
     */

    var len$1 = length$1;
    /**
     * Alias for {@link vec4.squaredLength}
     * @function
     */

    var sqrLen$1 = squaredLength$1;
    /**
     * Perform some operation over an array of vec4s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */

    var forEach$1 = function () {
      var vec = create$5();
      return function (a, stride, offset, count, fn, arg) {
        var i, l;

        if (!stride) {
          stride = 4;
        }

        if (!offset) {
          offset = 0;
        }

        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }

        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          vec[2] = a[i + 2];
          vec[3] = a[i + 3];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
          a[i + 2] = vec[2];
          a[i + 3] = vec[3];
        }

        return a;
      };
    }();

    var vec4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$5,
        clone: clone$5,
        fromValues: fromValues$5,
        copy: copy$5,
        set: set$5,
        add: add$5,
        subtract: subtract$5,
        multiply: multiply$5,
        divide: divide$1,
        ceil: ceil$1,
        floor: floor$1,
        min: min$1,
        max: max$1,
        round: round$1,
        scale: scale$5,
        scaleAndAdd: scaleAndAdd$1,
        distance: distance$1,
        squaredDistance: squaredDistance$1,
        length: length$1,
        squaredLength: squaredLength$1,
        negate: negate$1,
        inverse: inverse$1,
        normalize: normalize$1,
        dot: dot$2,
        cross: cross$1,
        lerp: lerp$1,
        random: random$1,
        transformMat4: transformMat4$1,
        transformQuat: transformQuat$1,
        zero: zero$1,
        str: str$5,
        exactEquals: exactEquals$5,
        equals: equals$6,
        sub: sub$5,
        mul: mul$5,
        div: div$1,
        dist: dist$1,
        sqrDist: sqrDist$1,
        len: len$1,
        sqrLen: sqrLen$1,
        forEach: forEach$1
    });

    /**
     * Quaternion
     * @module quat
     */

    /**
     * Creates a new identity quat
     *
     * @returns {quat} a new quaternion
     */

    function create$6() {
      var out = new ARRAY_TYPE(4);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }

      out[3] = 1;
      return out;
    }
    /**
     * Set a quat to the identity quaternion
     *
     * @param {quat} out the receiving quaternion
     * @returns {quat} out
     */

    function identity$4(out) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    }
    /**
     * Sets a quat from the given angle and rotation axis,
     * then returns it.
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyVec3} axis the axis around which to rotate
     * @param {Number} rad the angle in radians
     * @returns {quat} out
     **/

    function setAxisAngle(out, axis, rad) {
      rad = rad * 0.5;
      var s = Math.sin(rad);
      out[0] = s * axis[0];
      out[1] = s * axis[1];
      out[2] = s * axis[2];
      out[3] = Math.cos(rad);
      return out;
    }
    /**
     * Gets the rotation axis and angle for a given
     *  quaternion. If a quaternion is created with
     *  setAxisAngle, this method will return the same
     *  values as providied in the original parameter list
     *  OR functionally equivalent values.
     * Example: The quaternion formed by axis [0, 0, 1] and
     *  angle -90 is the same as the quaternion formed by
     *  [0, 0, 1] and 270. This method favors the latter.
     * @param  {vec3} out_axis  Vector receiving the axis of rotation
     * @param  {ReadonlyQuat} q     Quaternion to be decomposed
     * @return {Number}     Angle, in radians, of the rotation
     */

    function getAxisAngle(out_axis, q) {
      var rad = Math.acos(q[3]) * 2.0;
      var s = Math.sin(rad / 2.0);

      if (s > EPSILON) {
        out_axis[0] = q[0] / s;
        out_axis[1] = q[1] / s;
        out_axis[2] = q[2] / s;
      } else {
        // If s is zero, return any axis (no rotation - axis does not matter)
        out_axis[0] = 1;
        out_axis[1] = 0;
        out_axis[2] = 0;
      }

      return rad;
    }
    /**
     * Gets the angular distance between two unit quaternions
     *
     * @param  {ReadonlyQuat} a     Origin unit quaternion
     * @param  {ReadonlyQuat} b     Destination unit quaternion
     * @return {Number}     Angle, in radians, between the two quaternions
     */

    function getAngle(a, b) {
      var dotproduct = dot$3(a, b);
      return Math.acos(2 * dotproduct * dotproduct - 1);
    }
    /**
     * Multiplies two quat's
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @returns {quat} out
     */

    function multiply$6(out, a, b) {
      var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3];
      var bx = b[0],
          by = b[1],
          bz = b[2],
          bw = b[3];
      out[0] = ax * bw + aw * bx + ay * bz - az * by;
      out[1] = ay * bw + aw * by + az * bx - ax * bz;
      out[2] = az * bw + aw * bz + ax * by - ay * bx;
      out[3] = aw * bw - ax * bx - ay * by - az * bz;
      return out;
    }
    /**
     * Rotates a quaternion by the given angle about the X axis
     *
     * @param {quat} out quat receiving operation result
     * @param {ReadonlyQuat} a quat to rotate
     * @param {number} rad angle (in radians) to rotate
     * @returns {quat} out
     */

    function rotateX$2(out, a, rad) {
      rad *= 0.5;
      var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3];
      var bx = Math.sin(rad),
          bw = Math.cos(rad);
      out[0] = ax * bw + aw * bx;
      out[1] = ay * bw + az * bx;
      out[2] = az * bw - ay * bx;
      out[3] = aw * bw - ax * bx;
      return out;
    }
    /**
     * Rotates a quaternion by the given angle about the Y axis
     *
     * @param {quat} out quat receiving operation result
     * @param {ReadonlyQuat} a quat to rotate
     * @param {number} rad angle (in radians) to rotate
     * @returns {quat} out
     */

    function rotateY$2(out, a, rad) {
      rad *= 0.5;
      var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3];
      var by = Math.sin(rad),
          bw = Math.cos(rad);
      out[0] = ax * bw - az * by;
      out[1] = ay * bw + aw * by;
      out[2] = az * bw + ax * by;
      out[3] = aw * bw - ay * by;
      return out;
    }
    /**
     * Rotates a quaternion by the given angle about the Z axis
     *
     * @param {quat} out quat receiving operation result
     * @param {ReadonlyQuat} a quat to rotate
     * @param {number} rad angle (in radians) to rotate
     * @returns {quat} out
     */

    function rotateZ$2(out, a, rad) {
      rad *= 0.5;
      var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3];
      var bz = Math.sin(rad),
          bw = Math.cos(rad);
      out[0] = ax * bw + ay * bz;
      out[1] = ay * bw - ax * bz;
      out[2] = az * bw + aw * bz;
      out[3] = aw * bw - az * bz;
      return out;
    }
    /**
     * Calculates the W component of a quat from the X, Y, and Z components.
     * Assumes that quaternion is 1 unit in length.
     * Any existing W component will be ignored.
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate W component of
     * @returns {quat} out
     */

    function calculateW(out, a) {
      var x = a[0],
          y = a[1],
          z = a[2];
      out[0] = x;
      out[1] = y;
      out[2] = z;
      out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
      return out;
    }
    /**
     * Calculate the exponential of a unit quaternion.
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate the exponential of
     * @returns {quat} out
     */

    function exp(out, a) {
      var x = a[0],
          y = a[1],
          z = a[2],
          w = a[3];
      var r = Math.sqrt(x * x + y * y + z * z);
      var et = Math.exp(w);
      var s = r > 0 ? et * Math.sin(r) / r : 0;
      out[0] = x * s;
      out[1] = y * s;
      out[2] = z * s;
      out[3] = et * Math.cos(r);
      return out;
    }
    /**
     * Calculate the natural logarithm of a unit quaternion.
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate the exponential of
     * @returns {quat} out
     */

    function ln(out, a) {
      var x = a[0],
          y = a[1],
          z = a[2],
          w = a[3];
      var r = Math.sqrt(x * x + y * y + z * z);
      var t = r > 0 ? Math.atan2(r, w) / r : 0;
      out[0] = x * t;
      out[1] = y * t;
      out[2] = z * t;
      out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
      return out;
    }
    /**
     * Calculate the scalar power of a unit quaternion.
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate the exponential of
     * @param {Number} b amount to scale the quaternion by
     * @returns {quat} out
     */

    function pow(out, a, b) {
      ln(out, a);
      scale$6(out, out, b);
      exp(out, out);
      return out;
    }
    /**
     * Performs a spherical linear interpolation between two quat
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {quat} out
     */

    function slerp(out, a, b, t) {
      // benchmarks:
      //    http://jsperf.com/quaternion-slerp-implementations
      var ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3];
      var bx = b[0],
          by = b[1],
          bz = b[2],
          bw = b[3];
      var omega, cosom, sinom, scale0, scale1; // calc cosine

      cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

      if (cosom < 0.0) {
        cosom = -cosom;
        bx = -bx;
        by = -by;
        bz = -bz;
        bw = -bw;
      } // calculate coefficients


      if (1.0 - cosom > EPSILON) {
        // standard case (slerp)
        omega = Math.acos(cosom);
        sinom = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
      } else {
        // "from" and "to" quaternions are very close
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
      } // calculate final values


      out[0] = scale0 * ax + scale1 * bx;
      out[1] = scale0 * ay + scale1 * by;
      out[2] = scale0 * az + scale1 * bz;
      out[3] = scale0 * aw + scale1 * bw;
      return out;
    }
    /**
     * Generates a random unit quaternion
     *
     * @param {quat} out the receiving quaternion
     * @returns {quat} out
     */

    function random$2(out) {
      // Implementation of http://planning.cs.uiuc.edu/node198.html
      // TODO: Calling random 3 times is probably not the fastest solution
      var u1 = RANDOM();
      var u2 = RANDOM();
      var u3 = RANDOM();
      var sqrt1MinusU1 = Math.sqrt(1 - u1);
      var sqrtU1 = Math.sqrt(u1);
      out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
      out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
      out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
      out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
      return out;
    }
    /**
     * Calculates the inverse of a quat
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate inverse of
     * @returns {quat} out
     */

    function invert$4(out, a) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3];
      var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
      var invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

      out[0] = -a0 * invDot;
      out[1] = -a1 * invDot;
      out[2] = -a2 * invDot;
      out[3] = a3 * invDot;
      return out;
    }
    /**
     * Calculates the conjugate of a quat
     * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate conjugate of
     * @returns {quat} out
     */

    function conjugate(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      out[2] = -a[2];
      out[3] = a[3];
      return out;
    }
    /**
     * Creates a quaternion from the given 3x3 rotation matrix.
     *
     * NOTE: The resultant quaternion is not normalized, so you should be sure
     * to renormalize the quaternion yourself where necessary.
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyMat3} m rotation matrix
     * @returns {quat} out
     * @function
     */

    function fromMat3(out, m) {
      // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
      // article "Quaternion Calculus and Fast Animation".
      var fTrace = m[0] + m[4] + m[8];
      var fRoot;

      if (fTrace > 0.0) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0); // 2w

        out[3] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot; // 1/(4w)

        out[0] = (m[5] - m[7]) * fRoot;
        out[1] = (m[6] - m[2]) * fRoot;
        out[2] = (m[1] - m[3]) * fRoot;
      } else {
        // |w| <= 1/2
        var i = 0;
        if (m[4] > m[0]) i = 1;
        if (m[8] > m[i * 3 + i]) i = 2;
        var j = (i + 1) % 3;
        var k = (i + 2) % 3;
        fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
        out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
        out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
      }

      return out;
    }
    /**
     * Creates a quaternion from the given euler angle x, y, z.
     *
     * @param {quat} out the receiving quaternion
     * @param {x} Angle to rotate around X axis in degrees.
     * @param {y} Angle to rotate around Y axis in degrees.
     * @param {z} Angle to rotate around Z axis in degrees.
     * @returns {quat} out
     * @function
     */

    function fromEuler(out, x, y, z) {
      var halfToRad = 0.5 * Math.PI / 180.0;
      x *= halfToRad;
      y *= halfToRad;
      z *= halfToRad;
      var sx = Math.sin(x);
      var cx = Math.cos(x);
      var sy = Math.sin(y);
      var cy = Math.cos(y);
      var sz = Math.sin(z);
      var cz = Math.cos(z);
      out[0] = sx * cy * cz - cx * sy * sz;
      out[1] = cx * sy * cz + sx * cy * sz;
      out[2] = cx * cy * sz - sx * sy * cz;
      out[3] = cx * cy * cz + sx * sy * sz;
      return out;
    }
    /**
     * Returns a string representation of a quatenion
     *
     * @param {ReadonlyQuat} a vector to represent as a string
     * @returns {String} string representation of the vector
     */

    function str$6(a) {
      return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
    }
    /**
     * Creates a new quat initialized with values from an existing quaternion
     *
     * @param {ReadonlyQuat} a quaternion to clone
     * @returns {quat} a new quaternion
     * @function
     */

    var clone$6 = clone$5;
    /**
     * Creates a new quat initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @param {Number} w W component
     * @returns {quat} a new quaternion
     * @function
     */

    var fromValues$6 = fromValues$5;
    /**
     * Copy the values from one quat to another
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the source quaternion
     * @returns {quat} out
     * @function
     */

    var copy$6 = copy$5;
    /**
     * Set the components of a quat to the given values
     *
     * @param {quat} out the receiving quaternion
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @param {Number} w W component
     * @returns {quat} out
     * @function
     */

    var set$6 = set$5;
    /**
     * Adds two quat's
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @returns {quat} out
     * @function
     */

    var add$6 = add$5;
    /**
     * Alias for {@link quat.multiply}
     * @function
     */

    var mul$6 = multiply$6;
    /**
     * Scales a quat by a scalar number
     *
     * @param {quat} out the receiving vector
     * @param {ReadonlyQuat} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {quat} out
     * @function
     */

    var scale$6 = scale$5;
    /**
     * Calculates the dot product of two quat's
     *
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @returns {Number} dot product of a and b
     * @function
     */

    var dot$3 = dot$2;
    /**
     * Performs a linear interpolation between two quat's
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {quat} out
     * @function
     */

    var lerp$2 = lerp$1;
    /**
     * Calculates the length of a quat
     *
     * @param {ReadonlyQuat} a vector to calculate length of
     * @returns {Number} length of a
     */

    var length$2 = length$1;
    /**
     * Alias for {@link quat.length}
     * @function
     */

    var len$2 = length$2;
    /**
     * Calculates the squared length of a quat
     *
     * @param {ReadonlyQuat} a vector to calculate squared length of
     * @returns {Number} squared length of a
     * @function
     */

    var squaredLength$2 = squaredLength$1;
    /**
     * Alias for {@link quat.squaredLength}
     * @function
     */

    var sqrLen$2 = squaredLength$2;
    /**
     * Normalize a quat
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quaternion to normalize
     * @returns {quat} out
     * @function
     */

    var normalize$2 = normalize$1;
    /**
     * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyQuat} a The first quaternion.
     * @param {ReadonlyQuat} b The second quaternion.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */

    var exactEquals$6 = exactEquals$5;
    /**
     * Returns whether or not the quaternions have approximately the same elements in the same position.
     *
     * @param {ReadonlyQuat} a The first vector.
     * @param {ReadonlyQuat} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */

    var equals$7 = equals$6;
    /**
     * Sets a quaternion to represent the shortest rotation from one
     * vector to another.
     *
     * Both vectors are assumed to be unit length.
     *
     * @param {quat} out the receiving quaternion.
     * @param {ReadonlyVec3} a the initial vector
     * @param {ReadonlyVec3} b the destination vector
     * @returns {quat} out
     */

    var rotationTo = function () {
      var tmpvec3 = create$4();
      var xUnitVec3 = fromValues$4(1, 0, 0);
      var yUnitVec3 = fromValues$4(0, 1, 0);
      return function (out, a, b) {
        var dot = dot$1(a, b);

        if (dot < -0.999999) {
          cross(tmpvec3, xUnitVec3, a);
          if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
          normalize(tmpvec3, tmpvec3);
          setAxisAngle(out, tmpvec3, Math.PI);
          return out;
        } else if (dot > 0.999999) {
          out[0] = 0;
          out[1] = 0;
          out[2] = 0;
          out[3] = 1;
          return out;
        } else {
          cross(tmpvec3, a, b);
          out[0] = tmpvec3[0];
          out[1] = tmpvec3[1];
          out[2] = tmpvec3[2];
          out[3] = 1 + dot;
          return normalize$2(out, out);
        }
      };
    }();
    /**
     * Performs a spherical linear interpolation with two control points
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @param {ReadonlyQuat} c the third operand
     * @param {ReadonlyQuat} d the fourth operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {quat} out
     */

    var sqlerp = function () {
      var temp1 = create$6();
      var temp2 = create$6();
      return function (out, a, b, c, d, t) {
        slerp(temp1, a, d, t);
        slerp(temp2, b, c, t);
        slerp(out, temp1, temp2, 2 * t * (1 - t));
        return out;
      };
    }();
    /**
     * Sets the specified quaternion with values corresponding to the given
     * axes. Each axis is a vec3 and is expected to be unit length and
     * perpendicular to all other specified axes.
     *
     * @param {ReadonlyVec3} view  the vector representing the viewing direction
     * @param {ReadonlyVec3} right the vector representing the local "right" direction
     * @param {ReadonlyVec3} up    the vector representing the local "up" direction
     * @returns {quat} out
     */

    var setAxes = function () {
      var matr = create$2();
      return function (out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];
        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];
        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];
        return normalize$2(out, fromMat3(out, matr));
      };
    }();

    var quat = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$6,
        identity: identity$4,
        setAxisAngle: setAxisAngle,
        getAxisAngle: getAxisAngle,
        getAngle: getAngle,
        multiply: multiply$6,
        rotateX: rotateX$2,
        rotateY: rotateY$2,
        rotateZ: rotateZ$2,
        calculateW: calculateW,
        exp: exp,
        ln: ln,
        pow: pow,
        slerp: slerp,
        random: random$2,
        invert: invert$4,
        conjugate: conjugate,
        fromMat3: fromMat3,
        fromEuler: fromEuler,
        str: str$6,
        clone: clone$6,
        fromValues: fromValues$6,
        copy: copy$6,
        set: set$6,
        add: add$6,
        mul: mul$6,
        scale: scale$6,
        dot: dot$3,
        lerp: lerp$2,
        length: length$2,
        len: len$2,
        squaredLength: squaredLength$2,
        sqrLen: sqrLen$2,
        normalize: normalize$2,
        exactEquals: exactEquals$6,
        equals: equals$7,
        rotationTo: rotationTo,
        sqlerp: sqlerp,
        setAxes: setAxes
    });

    /**
     * Dual Quaternion<br>
     * Format: [real, dual]<br>
     * Quaternion format: XYZW<br>
     * Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>
     * @module quat2
     */

    /**
     * Creates a new identity dual quat
     *
     * @returns {quat2} a new dual quaternion [real -> rotation, dual -> translation]
     */

    function create$7() {
      var dq = new ARRAY_TYPE(8);

      if (ARRAY_TYPE != Float32Array) {
        dq[0] = 0;
        dq[1] = 0;
        dq[2] = 0;
        dq[4] = 0;
        dq[5] = 0;
        dq[6] = 0;
        dq[7] = 0;
      }

      dq[3] = 1;
      return dq;
    }
    /**
     * Creates a new quat initialized with values from an existing quaternion
     *
     * @param {ReadonlyQuat2} a dual quaternion to clone
     * @returns {quat2} new dual quaternion
     * @function
     */

    function clone$7(a) {
      var dq = new ARRAY_TYPE(8);
      dq[0] = a[0];
      dq[1] = a[1];
      dq[2] = a[2];
      dq[3] = a[3];
      dq[4] = a[4];
      dq[5] = a[5];
      dq[6] = a[6];
      dq[7] = a[7];
      return dq;
    }
    /**
     * Creates a new dual quat initialized with the given values
     *
     * @param {Number} x1 X component
     * @param {Number} y1 Y component
     * @param {Number} z1 Z component
     * @param {Number} w1 W component
     * @param {Number} x2 X component
     * @param {Number} y2 Y component
     * @param {Number} z2 Z component
     * @param {Number} w2 W component
     * @returns {quat2} new dual quaternion
     * @function
     */

    function fromValues$7(x1, y1, z1, w1, x2, y2, z2, w2) {
      var dq = new ARRAY_TYPE(8);
      dq[0] = x1;
      dq[1] = y1;
      dq[2] = z1;
      dq[3] = w1;
      dq[4] = x2;
      dq[5] = y2;
      dq[6] = z2;
      dq[7] = w2;
      return dq;
    }
    /**
     * Creates a new dual quat from the given values (quat and translation)
     *
     * @param {Number} x1 X component
     * @param {Number} y1 Y component
     * @param {Number} z1 Z component
     * @param {Number} w1 W component
     * @param {Number} x2 X component (translation)
     * @param {Number} y2 Y component (translation)
     * @param {Number} z2 Z component (translation)
     * @returns {quat2} new dual quaternion
     * @function
     */

    function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
      var dq = new ARRAY_TYPE(8);
      dq[0] = x1;
      dq[1] = y1;
      dq[2] = z1;
      dq[3] = w1;
      var ax = x2 * 0.5,
          ay = y2 * 0.5,
          az = z2 * 0.5;
      dq[4] = ax * w1 + ay * z1 - az * y1;
      dq[5] = ay * w1 + az * x1 - ax * z1;
      dq[6] = az * w1 + ax * y1 - ay * x1;
      dq[7] = -ax * x1 - ay * y1 - az * z1;
      return dq;
    }
    /**
     * Creates a dual quat from a quaternion and a translation
     *
     * @param {ReadonlyQuat2} dual quaternion receiving operation result
     * @param {ReadonlyQuat} q a normalized quaternion
     * @param {ReadonlyVec3} t tranlation vector
     * @returns {quat2} dual quaternion receiving operation result
     * @function
     */

    function fromRotationTranslation$1(out, q, t) {
      var ax = t[0] * 0.5,
          ay = t[1] * 0.5,
          az = t[2] * 0.5,
          bx = q[0],
          by = q[1],
          bz = q[2],
          bw = q[3];
      out[0] = bx;
      out[1] = by;
      out[2] = bz;
      out[3] = bw;
      out[4] = ax * bw + ay * bz - az * by;
      out[5] = ay * bw + az * bx - ax * bz;
      out[6] = az * bw + ax * by - ay * bx;
      out[7] = -ax * bx - ay * by - az * bz;
      return out;
    }
    /**
     * Creates a dual quat from a translation
     *
     * @param {ReadonlyQuat2} dual quaternion receiving operation result
     * @param {ReadonlyVec3} t translation vector
     * @returns {quat2} dual quaternion receiving operation result
     * @function
     */

    function fromTranslation$3(out, t) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      out[4] = t[0] * 0.5;
      out[5] = t[1] * 0.5;
      out[6] = t[2] * 0.5;
      out[7] = 0;
      return out;
    }
    /**
     * Creates a dual quat from a quaternion
     *
     * @param {ReadonlyQuat2} dual quaternion receiving operation result
     * @param {ReadonlyQuat} q the quaternion
     * @returns {quat2} dual quaternion receiving operation result
     * @function
     */

    function fromRotation$4(out, q) {
      out[0] = q[0];
      out[1] = q[1];
      out[2] = q[2];
      out[3] = q[3];
      out[4] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      return out;
    }
    /**
     * Creates a new dual quat from a matrix (4x4)
     *
     * @param {quat2} out the dual quaternion
     * @param {ReadonlyMat4} a the matrix
     * @returns {quat2} dual quat receiving operation result
     * @function
     */

    function fromMat4$1(out, a) {
      //TODO Optimize this
      var outer = create$6();
      getRotation(outer, a);
      var t = new ARRAY_TYPE(3);
      getTranslation(t, a);
      fromRotationTranslation$1(out, outer, t);
      return out;
    }
    /**
     * Copy the values from one dual quat to another
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the source dual quaternion
     * @returns {quat2} out
     * @function
     */

    function copy$7(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      return out;
    }
    /**
     * Set a dual quat to the identity dual quaternion
     *
     * @param {quat2} out the receiving quaternion
     * @returns {quat2} out
     */

    function identity$5(out) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      out[4] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      return out;
    }
    /**
     * Set the components of a dual quat to the given values
     *
     * @param {quat2} out the receiving quaternion
     * @param {Number} x1 X component
     * @param {Number} y1 Y component
     * @param {Number} z1 Z component
     * @param {Number} w1 W component
     * @param {Number} x2 X component
     * @param {Number} y2 Y component
     * @param {Number} z2 Z component
     * @param {Number} w2 W component
     * @returns {quat2} out
     * @function
     */

    function set$7(out, x1, y1, z1, w1, x2, y2, z2, w2) {
      out[0] = x1;
      out[1] = y1;
      out[2] = z1;
      out[3] = w1;
      out[4] = x2;
      out[5] = y2;
      out[6] = z2;
      out[7] = w2;
      return out;
    }
    /**
     * Gets the real part of a dual quat
     * @param  {quat} out real part
     * @param  {ReadonlyQuat2} a Dual Quaternion
     * @return {quat} real part
     */

    var getReal = copy$6;
    /**
     * Gets the dual part of a dual quat
     * @param  {quat} out dual part
     * @param  {ReadonlyQuat2} a Dual Quaternion
     * @return {quat} dual part
     */

    function getDual(out, a) {
      out[0] = a[4];
      out[1] = a[5];
      out[2] = a[6];
      out[3] = a[7];
      return out;
    }
    /**
     * Set the real component of a dual quat to the given quaternion
     *
     * @param {quat2} out the receiving quaternion
     * @param {ReadonlyQuat} q a quaternion representing the real part
     * @returns {quat2} out
     * @function
     */

    var setReal = copy$6;
    /**
     * Set the dual component of a dual quat to the given quaternion
     *
     * @param {quat2} out the receiving quaternion
     * @param {ReadonlyQuat} q a quaternion representing the dual part
     * @returns {quat2} out
     * @function
     */

    function setDual(out, q) {
      out[4] = q[0];
      out[5] = q[1];
      out[6] = q[2];
      out[7] = q[3];
      return out;
    }
    /**
     * Gets the translation of a normalized dual quat
     * @param  {vec3} out translation
     * @param  {ReadonlyQuat2} a Dual Quaternion to be decomposed
     * @return {vec3} translation
     */

    function getTranslation$1(out, a) {
      var ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7],
          bx = -a[0],
          by = -a[1],
          bz = -a[2],
          bw = a[3];
      out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
      return out;
    }
    /**
     * Translates a dual quat by the given vector
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to translate
     * @param {ReadonlyVec3} v vector to translate by
     * @returns {quat2} out
     */

    function translate$3(out, a, v) {
      var ax1 = a[0],
          ay1 = a[1],
          az1 = a[2],
          aw1 = a[3],
          bx1 = v[0] * 0.5,
          by1 = v[1] * 0.5,
          bz1 = v[2] * 0.5,
          ax2 = a[4],
          ay2 = a[5],
          az2 = a[6],
          aw2 = a[7];
      out[0] = ax1;
      out[1] = ay1;
      out[2] = az1;
      out[3] = aw1;
      out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
      out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
      out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
      out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
      return out;
    }
    /**
     * Rotates a dual quat around the X axis
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @param {number} rad how far should the rotation be
     * @returns {quat2} out
     */

    function rotateX$3(out, a, rad) {
      var bx = -a[0],
          by = -a[1],
          bz = -a[2],
          bw = a[3],
          ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7],
          ax1 = ax * bw + aw * bx + ay * bz - az * by,
          ay1 = ay * bw + aw * by + az * bx - ax * bz,
          az1 = az * bw + aw * bz + ax * by - ay * bx,
          aw1 = aw * bw - ax * bx - ay * by - az * bz;
      rotateX$2(out, a, rad);
      bx = out[0];
      by = out[1];
      bz = out[2];
      bw = out[3];
      out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
      out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
      out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
      out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
      return out;
    }
    /**
     * Rotates a dual quat around the Y axis
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @param {number} rad how far should the rotation be
     * @returns {quat2} out
     */

    function rotateY$3(out, a, rad) {
      var bx = -a[0],
          by = -a[1],
          bz = -a[2],
          bw = a[3],
          ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7],
          ax1 = ax * bw + aw * bx + ay * bz - az * by,
          ay1 = ay * bw + aw * by + az * bx - ax * bz,
          az1 = az * bw + aw * bz + ax * by - ay * bx,
          aw1 = aw * bw - ax * bx - ay * by - az * bz;
      rotateY$2(out, a, rad);
      bx = out[0];
      by = out[1];
      bz = out[2];
      bw = out[3];
      out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
      out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
      out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
      out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
      return out;
    }
    /**
     * Rotates a dual quat around the Z axis
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @param {number} rad how far should the rotation be
     * @returns {quat2} out
     */

    function rotateZ$3(out, a, rad) {
      var bx = -a[0],
          by = -a[1],
          bz = -a[2],
          bw = a[3],
          ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7],
          ax1 = ax * bw + aw * bx + ay * bz - az * by,
          ay1 = ay * bw + aw * by + az * bx - ax * bz,
          az1 = az * bw + aw * bz + ax * by - ay * bx,
          aw1 = aw * bw - ax * bx - ay * by - az * bz;
      rotateZ$2(out, a, rad);
      bx = out[0];
      by = out[1];
      bz = out[2];
      bw = out[3];
      out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
      out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
      out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
      out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
      return out;
    }
    /**
     * Rotates a dual quat by a given quaternion (a * q)
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @param {ReadonlyQuat} q quaternion to rotate by
     * @returns {quat2} out
     */

    function rotateByQuatAppend(out, a, q) {
      var qx = q[0],
          qy = q[1],
          qz = q[2],
          qw = q[3],
          ax = a[0],
          ay = a[1],
          az = a[2],
          aw = a[3];
      out[0] = ax * qw + aw * qx + ay * qz - az * qy;
      out[1] = ay * qw + aw * qy + az * qx - ax * qz;
      out[2] = az * qw + aw * qz + ax * qy - ay * qx;
      out[3] = aw * qw - ax * qx - ay * qy - az * qz;
      ax = a[4];
      ay = a[5];
      az = a[6];
      aw = a[7];
      out[4] = ax * qw + aw * qx + ay * qz - az * qy;
      out[5] = ay * qw + aw * qy + az * qx - ax * qz;
      out[6] = az * qw + aw * qz + ax * qy - ay * qx;
      out[7] = aw * qw - ax * qx - ay * qy - az * qz;
      return out;
    }
    /**
     * Rotates a dual quat by a given quaternion (q * a)
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat} q quaternion to rotate by
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @returns {quat2} out
     */

    function rotateByQuatPrepend(out, q, a) {
      var qx = q[0],
          qy = q[1],
          qz = q[2],
          qw = q[3],
          bx = a[0],
          by = a[1],
          bz = a[2],
          bw = a[3];
      out[0] = qx * bw + qw * bx + qy * bz - qz * by;
      out[1] = qy * bw + qw * by + qz * bx - qx * bz;
      out[2] = qz * bw + qw * bz + qx * by - qy * bx;
      out[3] = qw * bw - qx * bx - qy * by - qz * bz;
      bx = a[4];
      by = a[5];
      bz = a[6];
      bw = a[7];
      out[4] = qx * bw + qw * bx + qy * bz - qz * by;
      out[5] = qy * bw + qw * by + qz * bx - qx * bz;
      out[6] = qz * bw + qw * bz + qx * by - qy * bx;
      out[7] = qw * bw - qx * bx - qy * by - qz * bz;
      return out;
    }
    /**
     * Rotates a dual quat around a given axis. Does the normalisation automatically
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @param {ReadonlyVec3} axis the axis to rotate around
     * @param {Number} rad how far the rotation should be
     * @returns {quat2} out
     */

    function rotateAroundAxis(out, a, axis, rad) {
      //Special case for rad = 0
      if (Math.abs(rad) < EPSILON) {
        return copy$7(out, a);
      }

      var axisLength = Math.hypot(axis[0], axis[1], axis[2]);
      rad = rad * 0.5;
      var s = Math.sin(rad);
      var bx = s * axis[0] / axisLength;
      var by = s * axis[1] / axisLength;
      var bz = s * axis[2] / axisLength;
      var bw = Math.cos(rad);
      var ax1 = a[0],
          ay1 = a[1],
          az1 = a[2],
          aw1 = a[3];
      out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
      out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
      out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
      out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
      var ax = a[4],
          ay = a[5],
          az = a[6],
          aw = a[7];
      out[4] = ax * bw + aw * bx + ay * bz - az * by;
      out[5] = ay * bw + aw * by + az * bx - ax * bz;
      out[6] = az * bw + aw * bz + ax * by - ay * bx;
      out[7] = aw * bw - ax * bx - ay * by - az * bz;
      return out;
    }
    /**
     * Adds two dual quat's
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the first operand
     * @param {ReadonlyQuat2} b the second operand
     * @returns {quat2} out
     * @function
     */

    function add$7(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      out[4] = a[4] + b[4];
      out[5] = a[5] + b[5];
      out[6] = a[6] + b[6];
      out[7] = a[7] + b[7];
      return out;
    }
    /**
     * Multiplies two dual quat's
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the first operand
     * @param {ReadonlyQuat2} b the second operand
     * @returns {quat2} out
     */

    function multiply$7(out, a, b) {
      var ax0 = a[0],
          ay0 = a[1],
          az0 = a[2],
          aw0 = a[3],
          bx1 = b[4],
          by1 = b[5],
          bz1 = b[6],
          bw1 = b[7],
          ax1 = a[4],
          ay1 = a[5],
          az1 = a[6],
          aw1 = a[7],
          bx0 = b[0],
          by0 = b[1],
          bz0 = b[2],
          bw0 = b[3];
      out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
      out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
      out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
      out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
      out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
      out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
      out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
      out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
      return out;
    }
    /**
     * Alias for {@link quat2.multiply}
     * @function
     */

    var mul$7 = multiply$7;
    /**
     * Scales a dual quat by a scalar number
     *
     * @param {quat2} out the receiving dual quat
     * @param {ReadonlyQuat2} a the dual quat to scale
     * @param {Number} b amount to scale the dual quat by
     * @returns {quat2} out
     * @function
     */

    function scale$7(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      out[4] = a[4] * b;
      out[5] = a[5] * b;
      out[6] = a[6] * b;
      out[7] = a[7] * b;
      return out;
    }
    /**
     * Calculates the dot product of two dual quat's (The dot product of the real parts)
     *
     * @param {ReadonlyQuat2} a the first operand
     * @param {ReadonlyQuat2} b the second operand
     * @returns {Number} dot product of a and b
     * @function
     */

    var dot$4 = dot$3;
    /**
     * Performs a linear interpolation between two dual quats's
     * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)
     *
     * @param {quat2} out the receiving dual quat
     * @param {ReadonlyQuat2} a the first operand
     * @param {ReadonlyQuat2} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {quat2} out
     */

    function lerp$3(out, a, b, t) {
      var mt = 1 - t;
      if (dot$4(a, b) < 0) t = -t;
      out[0] = a[0] * mt + b[0] * t;
      out[1] = a[1] * mt + b[1] * t;
      out[2] = a[2] * mt + b[2] * t;
      out[3] = a[3] * mt + b[3] * t;
      out[4] = a[4] * mt + b[4] * t;
      out[5] = a[5] * mt + b[5] * t;
      out[6] = a[6] * mt + b[6] * t;
      out[7] = a[7] * mt + b[7] * t;
      return out;
    }
    /**
     * Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a dual quat to calculate inverse of
     * @returns {quat2} out
     */

    function invert$5(out, a) {
      var sqlen = squaredLength$3(a);
      out[0] = -a[0] / sqlen;
      out[1] = -a[1] / sqlen;
      out[2] = -a[2] / sqlen;
      out[3] = a[3] / sqlen;
      out[4] = -a[4] / sqlen;
      out[5] = -a[5] / sqlen;
      out[6] = -a[6] / sqlen;
      out[7] = a[7] / sqlen;
      return out;
    }
    /**
     * Calculates the conjugate of a dual quat
     * If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.
     *
     * @param {quat2} out the receiving quaternion
     * @param {ReadonlyQuat2} a quat to calculate conjugate of
     * @returns {quat2} out
     */

    function conjugate$1(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      out[2] = -a[2];
      out[3] = a[3];
      out[4] = -a[4];
      out[5] = -a[5];
      out[6] = -a[6];
      out[7] = a[7];
      return out;
    }
    /**
     * Calculates the length of a dual quat
     *
     * @param {ReadonlyQuat2} a dual quat to calculate length of
     * @returns {Number} length of a
     * @function
     */

    var length$3 = length$2;
    /**
     * Alias for {@link quat2.length}
     * @function
     */

    var len$3 = length$3;
    /**
     * Calculates the squared length of a dual quat
     *
     * @param {ReadonlyQuat2} a dual quat to calculate squared length of
     * @returns {Number} squared length of a
     * @function
     */

    var squaredLength$3 = squaredLength$2;
    /**
     * Alias for {@link quat2.squaredLength}
     * @function
     */

    var sqrLen$3 = squaredLength$3;
    /**
     * Normalize a dual quat
     *
     * @param {quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a dual quaternion to normalize
     * @returns {quat2} out
     * @function
     */

    function normalize$3(out, a) {
      var magnitude = squaredLength$3(a);

      if (magnitude > 0) {
        magnitude = Math.sqrt(magnitude);
        var a0 = a[0] / magnitude;
        var a1 = a[1] / magnitude;
        var a2 = a[2] / magnitude;
        var a3 = a[3] / magnitude;
        var b0 = a[4];
        var b1 = a[5];
        var b2 = a[6];
        var b3 = a[7];
        var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
        out[0] = a0;
        out[1] = a1;
        out[2] = a2;
        out[3] = a3;
        out[4] = (b0 - a0 * a_dot_b) / magnitude;
        out[5] = (b1 - a1 * a_dot_b) / magnitude;
        out[6] = (b2 - a2 * a_dot_b) / magnitude;
        out[7] = (b3 - a3 * a_dot_b) / magnitude;
      }

      return out;
    }
    /**
     * Returns a string representation of a dual quatenion
     *
     * @param {ReadonlyQuat2} a dual quaternion to represent as a string
     * @returns {String} string representation of the dual quat
     */

    function str$7(a) {
      return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
    }
    /**
     * Returns whether or not the dual quaternions have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyQuat2} a the first dual quaternion.
     * @param {ReadonlyQuat2} b the second dual quaternion.
     * @returns {Boolean} true if the dual quaternions are equal, false otherwise.
     */

    function exactEquals$7(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
    }
    /**
     * Returns whether or not the dual quaternions have approximately the same elements in the same position.
     *
     * @param {ReadonlyQuat2} a the first dual quat.
     * @param {ReadonlyQuat2} b the second dual quat.
     * @returns {Boolean} true if the dual quats are equal, false otherwise.
     */

    function equals$8(a, b) {
      var a0 = a[0],
          a1 = a[1],
          a2 = a[2],
          a3 = a[3],
          a4 = a[4],
          a5 = a[5],
          a6 = a[6],
          a7 = a[7];
      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5],
          b6 = b[6],
          b7 = b[7];
      return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7));
    }

    var quat2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$7,
        clone: clone$7,
        fromValues: fromValues$7,
        fromRotationTranslationValues: fromRotationTranslationValues,
        fromRotationTranslation: fromRotationTranslation$1,
        fromTranslation: fromTranslation$3,
        fromRotation: fromRotation$4,
        fromMat4: fromMat4$1,
        copy: copy$7,
        identity: identity$5,
        set: set$7,
        getReal: getReal,
        getDual: getDual,
        setReal: setReal,
        setDual: setDual,
        getTranslation: getTranslation$1,
        translate: translate$3,
        rotateX: rotateX$3,
        rotateY: rotateY$3,
        rotateZ: rotateZ$3,
        rotateByQuatAppend: rotateByQuatAppend,
        rotateByQuatPrepend: rotateByQuatPrepend,
        rotateAroundAxis: rotateAroundAxis,
        add: add$7,
        multiply: multiply$7,
        mul: mul$7,
        scale: scale$7,
        dot: dot$4,
        lerp: lerp$3,
        invert: invert$5,
        conjugate: conjugate$1,
        length: length$3,
        len: len$3,
        squaredLength: squaredLength$3,
        sqrLen: sqrLen$3,
        normalize: normalize$3,
        str: str$7,
        exactEquals: exactEquals$7,
        equals: equals$8
    });

    /**
     * 2 Dimensional Vector
     * @module vec2
     */

    /**
     * Creates a new, empty vec2
     *
     * @returns {vec2} a new 2D vector
     */

    function create$8() {
      var out = new ARRAY_TYPE(2);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
      }

      return out;
    }
    /**
     * Creates a new vec2 initialized with values from an existing vector
     *
     * @param {ReadonlyVec2} a vector to clone
     * @returns {vec2} a new 2D vector
     */

    function clone$8(a) {
      var out = new ARRAY_TYPE(2);
      out[0] = a[0];
      out[1] = a[1];
      return out;
    }
    /**
     * Creates a new vec2 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @returns {vec2} a new 2D vector
     */

    function fromValues$8(x, y) {
      var out = new ARRAY_TYPE(2);
      out[0] = x;
      out[1] = y;
      return out;
    }
    /**
     * Copy the values from one vec2 to another
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the source vector
     * @returns {vec2} out
     */

    function copy$8(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      return out;
    }
    /**
     * Set the components of a vec2 to the given values
     *
     * @param {vec2} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @returns {vec2} out
     */

    function set$8(out, x, y) {
      out[0] = x;
      out[1] = y;
      return out;
    }
    /**
     * Adds two vec2's
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {vec2} out
     */

    function add$8(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      return out;
    }
    /**
     * Subtracts vector b from vector a
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {vec2} out
     */

    function subtract$6(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      return out;
    }
    /**
     * Multiplies two vec2's
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {vec2} out
     */

    function multiply$8(out, a, b) {
      out[0] = a[0] * b[0];
      out[1] = a[1] * b[1];
      return out;
    }
    /**
     * Divides two vec2's
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {vec2} out
     */

    function divide$2(out, a, b) {
      out[0] = a[0] / b[0];
      out[1] = a[1] / b[1];
      return out;
    }
    /**
     * Math.ceil the components of a vec2
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to ceil
     * @returns {vec2} out
     */

    function ceil$2(out, a) {
      out[0] = Math.ceil(a[0]);
      out[1] = Math.ceil(a[1]);
      return out;
    }
    /**
     * Math.floor the components of a vec2
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to floor
     * @returns {vec2} out
     */

    function floor$2(out, a) {
      out[0] = Math.floor(a[0]);
      out[1] = Math.floor(a[1]);
      return out;
    }
    /**
     * Returns the minimum of two vec2's
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {vec2} out
     */

    function min$2(out, a, b) {
      out[0] = Math.min(a[0], b[0]);
      out[1] = Math.min(a[1], b[1]);
      return out;
    }
    /**
     * Returns the maximum of two vec2's
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {vec2} out
     */

    function max$2(out, a, b) {
      out[0] = Math.max(a[0], b[0]);
      out[1] = Math.max(a[1], b[1]);
      return out;
    }
    /**
     * Math.round the components of a vec2
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to round
     * @returns {vec2} out
     */

    function round$2(out, a) {
      out[0] = Math.round(a[0]);
      out[1] = Math.round(a[1]);
      return out;
    }
    /**
     * Scales a vec2 by a scalar number
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {vec2} out
     */

    function scale$8(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      return out;
    }
    /**
     * Adds two vec2's after scaling the second operand by a scalar value
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @returns {vec2} out
     */

    function scaleAndAdd$2(out, a, b, scale) {
      out[0] = a[0] + b[0] * scale;
      out[1] = a[1] + b[1] * scale;
      return out;
    }
    /**
     * Calculates the euclidian distance between two vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} distance between a and b
     */

    function distance$2(a, b) {
      var x = b[0] - a[0],
          y = b[1] - a[1];
      return Math.hypot(x, y);
    }
    /**
     * Calculates the squared euclidian distance between two vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} squared distance between a and b
     */

    function squaredDistance$2(a, b) {
      var x = b[0] - a[0],
          y = b[1] - a[1];
      return x * x + y * y;
    }
    /**
     * Calculates the length of a vec2
     *
     * @param {ReadonlyVec2} a vector to calculate length of
     * @returns {Number} length of a
     */

    function length$4(a) {
      var x = a[0],
          y = a[1];
      return Math.hypot(x, y);
    }
    /**
     * Calculates the squared length of a vec2
     *
     * @param {ReadonlyVec2} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */

    function squaredLength$4(a) {
      var x = a[0],
          y = a[1];
      return x * x + y * y;
    }
    /**
     * Negates the components of a vec2
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to negate
     * @returns {vec2} out
     */

    function negate$2(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      return out;
    }
    /**
     * Returns the inverse of the components of a vec2
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to invert
     * @returns {vec2} out
     */

    function inverse$2(out, a) {
      out[0] = 1.0 / a[0];
      out[1] = 1.0 / a[1];
      return out;
    }
    /**
     * Normalize a vec2
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to normalize
     * @returns {vec2} out
     */

    function normalize$4(out, a) {
      var x = a[0],
          y = a[1];
      var len = x * x + y * y;

      if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
      }

      out[0] = a[0] * len;
      out[1] = a[1] * len;
      return out;
    }
    /**
     * Calculates the dot product of two vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} dot product of a and b
     */

    function dot$5(a, b) {
      return a[0] * b[0] + a[1] * b[1];
    }
    /**
     * Computes the cross product of two vec2's
     * Note that the cross product must by definition produce a 3D vector
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {vec3} out
     */

    function cross$2(out, a, b) {
      var z = a[0] * b[1] - a[1] * b[0];
      out[0] = out[1] = 0;
      out[2] = z;
      return out;
    }
    /**
     * Performs a linear interpolation between two vec2's
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {vec2} out
     */

    function lerp$4(out, a, b, t) {
      var ax = a[0],
          ay = a[1];
      out[0] = ax + t * (b[0] - ax);
      out[1] = ay + t * (b[1] - ay);
      return out;
    }
    /**
     * Generates a random vector with the given scale
     *
     * @param {vec2} out the receiving vector
     * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
     * @returns {vec2} out
     */

    function random$3(out, scale) {
      scale = scale || 1.0;
      var r = RANDOM() * 2.0 * Math.PI;
      out[0] = Math.cos(r) * scale;
      out[1] = Math.sin(r) * scale;
      return out;
    }
    /**
     * Transforms the vec2 with a mat2
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat2} m matrix to transform with
     * @returns {vec2} out
     */

    function transformMat2(out, a, m) {
      var x = a[0],
          y = a[1];
      out[0] = m[0] * x + m[2] * y;
      out[1] = m[1] * x + m[3] * y;
      return out;
    }
    /**
     * Transforms the vec2 with a mat2d
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat2d} m matrix to transform with
     * @returns {vec2} out
     */

    function transformMat2d(out, a, m) {
      var x = a[0],
          y = a[1];
      out[0] = m[0] * x + m[2] * y + m[4];
      out[1] = m[1] * x + m[3] * y + m[5];
      return out;
    }
    /**
     * Transforms the vec2 with a mat3
     * 3rd vector component is implicitly '1'
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat3} m matrix to transform with
     * @returns {vec2} out
     */

    function transformMat3$1(out, a, m) {
      var x = a[0],
          y = a[1];
      out[0] = m[0] * x + m[3] * y + m[6];
      out[1] = m[1] * x + m[4] * y + m[7];
      return out;
    }
    /**
     * Transforms the vec2 with a mat4
     * 3rd vector component is implicitly '0'
     * 4th vector component is implicitly '1'
     *
     * @param {vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat4} m matrix to transform with
     * @returns {vec2} out
     */

    function transformMat4$2(out, a, m) {
      var x = a[0];
      var y = a[1];
      out[0] = m[0] * x + m[4] * y + m[12];
      out[1] = m[1] * x + m[5] * y + m[13];
      return out;
    }
    /**
     * Rotate a 2D vector
     * @param {vec2} out The receiving vec2
     * @param {ReadonlyVec2} a The vec2 point to rotate
     * @param {ReadonlyVec2} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @returns {vec2} out
     */

    function rotate$4(out, a, b, rad) {
      //Translate point to the origin
      var p0 = a[0] - b[0],
          p1 = a[1] - b[1],
          sinC = Math.sin(rad),
          cosC = Math.cos(rad); //perform rotation and translate to correct position

      out[0] = p0 * cosC - p1 * sinC + b[0];
      out[1] = p0 * sinC + p1 * cosC + b[1];
      return out;
    }
    /**
     * Get the angle between two 2D vectors
     * @param {ReadonlyVec2} a The first operand
     * @param {ReadonlyVec2} b The second operand
     * @returns {Number} The angle in radians
     */

    function angle$1(a, b) {
      var x1 = a[0],
          y1 = a[1],
          x2 = b[0],
          y2 = b[1],
          // mag is the product of the magnitudes of a and b
      mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2),
          // mag &&.. short circuits if mag == 0
      cosine = mag && (x1 * x2 + y1 * y2) / mag; // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1

      return Math.acos(Math.min(Math.max(cosine, -1), 1));
    }
    /**
     * Set the components of a vec2 to zero
     *
     * @param {vec2} out the receiving vector
     * @returns {vec2} out
     */

    function zero$2(out) {
      out[0] = 0.0;
      out[1] = 0.0;
      return out;
    }
    /**
     * Returns a string representation of a vector
     *
     * @param {ReadonlyVec2} a vector to represent as a string
     * @returns {String} string representation of the vector
     */

    function str$8(a) {
      return "vec2(" + a[0] + ", " + a[1] + ")";
    }
    /**
     * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyVec2} a The first vector.
     * @param {ReadonlyVec2} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */

    function exactEquals$8(a, b) {
      return a[0] === b[0] && a[1] === b[1];
    }
    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     *
     * @param {ReadonlyVec2} a The first vector.
     * @param {ReadonlyVec2} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */

    function equals$9(a, b) {
      var a0 = a[0],
          a1 = a[1];
      var b0 = b[0],
          b1 = b[1];
      return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
    }
    /**
     * Alias for {@link vec2.length}
     * @function
     */

    var len$4 = length$4;
    /**
     * Alias for {@link vec2.subtract}
     * @function
     */

    var sub$6 = subtract$6;
    /**
     * Alias for {@link vec2.multiply}
     * @function
     */

    var mul$8 = multiply$8;
    /**
     * Alias for {@link vec2.divide}
     * @function
     */

    var div$2 = divide$2;
    /**
     * Alias for {@link vec2.distance}
     * @function
     */

    var dist$2 = distance$2;
    /**
     * Alias for {@link vec2.squaredDistance}
     * @function
     */

    var sqrDist$2 = squaredDistance$2;
    /**
     * Alias for {@link vec2.squaredLength}
     * @function
     */

    var sqrLen$4 = squaredLength$4;
    /**
     * Perform some operation over an array of vec2s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */

    var forEach$2 = function () {
      var vec = create$8();
      return function (a, stride, offset, count, fn, arg) {
        var i, l;

        if (!stride) {
          stride = 2;
        }

        if (!offset) {
          offset = 0;
        }

        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }

        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
        }

        return a;
      };
    }();

    var vec2$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$8,
        clone: clone$8,
        fromValues: fromValues$8,
        copy: copy$8,
        set: set$8,
        add: add$8,
        subtract: subtract$6,
        multiply: multiply$8,
        divide: divide$2,
        ceil: ceil$2,
        floor: floor$2,
        min: min$2,
        max: max$2,
        round: round$2,
        scale: scale$8,
        scaleAndAdd: scaleAndAdd$2,
        distance: distance$2,
        squaredDistance: squaredDistance$2,
        length: length$4,
        squaredLength: squaredLength$4,
        negate: negate$2,
        inverse: inverse$2,
        normalize: normalize$4,
        dot: dot$5,
        cross: cross$2,
        lerp: lerp$4,
        random: random$3,
        transformMat2: transformMat2,
        transformMat2d: transformMat2d,
        transformMat3: transformMat3$1,
        transformMat4: transformMat4$2,
        rotate: rotate$4,
        angle: angle$1,
        zero: zero$2,
        str: str$8,
        exactEquals: exactEquals$8,
        equals: equals$9,
        len: len$4,
        sub: sub$6,
        mul: mul$8,
        div: div$2,
        dist: dist$2,
        sqrDist: sqrDist$2,
        sqrLen: sqrLen$4,
        forEach: forEach$2
    });

    const ORIGIN = fromValues$4(0, 0, 0);
    const XAXIS = fromValues$4(1, 0, 0);
    const YAXIS = fromValues$4(0, 1, 0);
    const ZAXIS = fromValues$4(0, 0, 1);

    function create$9()
    {
        return {
            translation: create$4(),
            rotation: create$6(),
            scale: fromValues$4(1, 1, 1)
        };
    }

    /** This is the INVERSE of gluLookAt(). */
    function lookAt$1(transform, target = ORIGIN)
    {
        const result = create$4();
        subtract$4(result, target, transform.position);
        normalize(result, result);
        
        const dotProduct = dot$1(ZAXIS, result);
        if (Math.abs(dotProduct - (-1)) < Number.EPSILON)
        {
            set$6(transform.rotation, 0, 0, 1, Math.PI);
            return transform;
        }
        if (Math.abs(dot - 1) < Number.EPSILON)
        {
            set$6(transform.rotation, 0, 0, 0, 1);
            return transform;
        }

        cross(result, ZAXIS, result);
        normalize(result, result);
        const halfAngle = Math.acos(dotProduct) / 2;
        const sineAngle = Math.sin(halfAngle);
        transform.rotation[0] = result[0] * sineAngle;
        transform.rotation[1] = result[1] * sineAngle;
        transform.rotation[2] = result[2] * sineAngle;
        transform.rotation[3] = Math.cos(halfAngle);
        return transform;
    }

    function getTransformationMatrix(transform, dst = create$3())
    {
        return fromRotationTranslationScale(dst, transform.rotation, transform.translation, transform.scale);
    }

    function getForwardVector(transform, dst = create$4())
    {
        transformQuat(dst, ZAXIS, transform.rotation);
        return dst;
    }

    function getUpVector(transform, dst = create$4())
    {
        transformQuat(dst, YAXIS, transform.rotation);
        return dst;
    }

    function getRightVector(transform, dst = create$4())
    {
        transformQuat(dst, XAXIS, transform.rotation);
        return dst;
    }

    var Transform = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ORIGIN: ORIGIN,
        XAXIS: XAXIS,
        YAXIS: YAXIS,
        ZAXIS: ZAXIS,
        create: create$9,
        lookAt: lookAt$1,
        getTransformationMatrix: getTransformationMatrix,
        getForwardVector: getForwardVector,
        getUpVector: getUpVector,
        getRightVector: getRightVector
    });

    class SceneGraph
    {
        constructor()
        {
            this.root = this.createSceneNode(create$9(), null);
        }
        
        update()
        {
            this.root.updateWorldMatrix();
        }

        createSceneNode(transform = create$9(), parent = this.root)
        {
            const result = {
                sceneGraph: this,
                transform,
                localMatrix: create$3(),
                worldMatrix: create$3(),
                parent: null,
                children: [],
                setParent(sceneNode)
                {
                    if (this.parent)
                    {
                        const index = this.parent.children.indexOf(this);
                        this.parent.children.splice(index, 1);
                    }

                    if (sceneNode)
                    {
                        sceneNode.children.push(this);
                    }

                    this.parent = parent;
                    return this;
                },
                updateWorldMatrix(parentWorldMatrix)
                {
                    // NOTE: The reason we don't just use local matrix is because of accumulating errors on matrix updates.
                    // Consider when you scale from 0 to 1 over time. It would get stuck at 0. Using a "source" of data where we
                    // recompute the matrix prevents this.
                    getTransformationMatrix(this.transform, this.localMatrix);

                    if (parentWorldMatrix)
                    {
                        multiply$3(this.worldMatrix, parentWorldMatrix, this.localMatrix);
                    }
                    else
                    {
                        copy$3(this.worldMatrix, this.localMatrix);
                    }

                    for(const child of this.children)
                    {
                        child.updateWorldMatrix(this.worldMatrix);
                    }
                }
            };

            if (parent)
            {
                result.setParent(parent);
            }
            return result;
        }
    }

    function create$1$1(position, texcoord, normal, indices, color = undefined)
    {
        if (!color)
        {
            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            color = [];
            for(let i = 0; i < position.length; i += 3)
            {
                color.push(r, g, b);
            }
        }

        return {
            position,
            texcoord,
            normal,
            indices,
            color,
            elementSize: 3,
            elementCount: indices.length,
        };
    }

    function applyColor(r, g, b, geometry)
    {
        for(let i = 0; i < geometry.color.length; i += 3)
        {
            geometry.color[i + 0] = r;
            geometry.color[i + 1] = g;
            geometry.color[i + 2] = b;
        }
        return geometry;
    }

    function applyTransformation(transformationMatrix, geometry)
    {
        const position = geometry.position;
        const normal = geometry.normal;

        const inverseTransposeMatrix = create$2();
        normalFromMat4(inverseTransposeMatrix, transformationMatrix);

        const result = create$4();
        for(let i = 0; i < position.length; i += 3)
        {
            result[0] = position[i + 0];
            result[1] = position[i + 1];
            result[2] = position[i + 2];
            transformMat4(result, result, transformationMatrix);
            position[i + 0] = result[0];
            position[i + 1] = result[1];
            position[i + 2] = result[2];

            result[0] = normal[i + 0];
            result[1] = normal[i + 1];
            result[2] = normal[i + 2];
            transformMat3(result, result, inverseTransposeMatrix);
            normal[i + 0] = result[0];
            normal[i + 1] = result[1];
            normal[i + 2] = result[2];
        }

        return geometry;
    }

    function joinGeometry(...geometries)
    {
        const position = [];
        const texcoord = [];
        const normal = [];
        const indices = [];
        const color = [];

        let indexCount = 0;
        for(const geometry of geometries)
        {
            position.push(...geometry.position);
            texcoord.push(...geometry.texcoord);
            normal.push(...geometry.normal);
            color.push(...geometry.color);
            indices.push(...geometry.indices.map((value) => value + indexCount));

            indexCount += geometry.position.length / 3;
        }

        return create$1$1(position, texcoord, normal, indices, color);
    }

    function create$2$1(centered = false)
    {
        const x = 0;
        const y = 0;
        const z = 0;
        const width = 1;
        const height = 1;
        
        let position;
        if (centered)
        {
            const halfWidth = width * 0.5;
            const halfHeight = height * 0.5;
            position = [
                x - halfWidth, y - halfHeight, z,
                x + halfWidth, y - halfHeight, z,
                x - halfWidth, y + halfHeight, z,
                x + halfWidth, y + halfHeight, z,
            ];
        }
        else
        {
            position = [
                x, y, z,
                x + width, y, z,
                x, y + height, z,
                x + width, y + height, z,
            ];
        }

        const texcoord = [
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        const normal = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];
        const indices = [
            0, 1, 2,
            2, 1, 3,
        ];
        
        return create$1$1(position, texcoord, normal, indices);
    }

    var QuadGeometry = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$2$1
    });

    function create$3$1(doubleSided = true)
    {
        const frontPlane = create$2$1(true);
        if (doubleSided)
        {
            const backPlane = create$2$1(true);
            const transformationMatrix = fromYRotation(create$3(), Math.PI);
            applyTransformation(transformationMatrix, backPlane);
            applyColor(frontPlane.color[0], frontPlane.color[1], frontPlane.color[2], backPlane);
            return joinGeometry(frontPlane, backPlane);
        }
        else
        {
            return frontPlane;
        }
    }

    var PlaneGeometry = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$3$1
    });

    function create$4$1(front = true, back = true, top = true, bottom = true, left = true, right = true)
    {
        const HALF_PI = Math.PI / 2;
        const halfWidth = 0.5;
        const halfHeight = 0.5;
        const halfDepth = 0.5;

        const transformationMatrix = create$3();
        const faces = [];
        
        // Front
        if (front)
        {
            const frontPlane = create$3$1(false);
            fromTranslation$2(transformationMatrix, [0, 0, halfDepth]);
            applyTransformation(transformationMatrix, frontPlane);
            faces.push(frontPlane);
        }
        // Top
        if (top)
        {
            const topPlane = create$3$1(false);
            fromXRotation(transformationMatrix, -HALF_PI);
            translate$2(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
            applyTransformation(transformationMatrix, topPlane);
            faces.push(topPlane);
        }
        // Back
        if (back)
        {
            const backPlane = create$3$1(false);
            fromYRotation(transformationMatrix, Math.PI);
            translate$2(transformationMatrix, transformationMatrix, [0, 0, halfDepth]);
            applyTransformation(transformationMatrix, backPlane);
            faces.push(backPlane);
        }
        // Bottom
        if (bottom)
        {
            const bottomPlane = create$3$1(false);
            fromXRotation(transformationMatrix, HALF_PI);
            translate$2(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
            applyTransformation(transformationMatrix, bottomPlane);
            faces.push(bottomPlane);
        }
        // Left
        if (left)
        {
            const leftPlane = create$3$1(false);
            fromYRotation(transformationMatrix, -HALF_PI);
            translate$2(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
            applyTransformation(transformationMatrix, leftPlane);
            faces.push(leftPlane);
        }
        // Right
        if (right)
        {
            const rightPlane = create$3$1(false);
            fromYRotation(transformationMatrix, HALF_PI);
            translate$2(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
            applyTransformation(transformationMatrix, rightPlane);
            faces.push(rightPlane);
        }

        return joinGeometry(...faces);
    }

    var CubeGeometry = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$4$1
    });

    function create$5$1()
    {
        const size = 1;
        const fifthSize = size * 0.2;

        const transformationMatrix = create$3();

        const topRung = create$4$1(true, true, true, true, false, true);
        fromTranslation$2(transformationMatrix, [fifthSize / 2, fifthSize * 2, 0]);
        scale$3(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize, fifthSize]);
        applyTransformation(transformationMatrix, topRung);
        applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
        
        const bottomRung = create$4$1(true, true, true, true, false, true);
        fromScaling$3(transformationMatrix, [fifthSize, fifthSize, fifthSize]);
        applyTransformation(transformationMatrix, bottomRung);
        applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);

        const leftBase = create$4$1(true, true, true, true, true, true);
        fromTranslation$2(transformationMatrix, [-fifthSize, 0, 0]);
        scale$3(transformationMatrix, transformationMatrix, [fifthSize, size, fifthSize]);
        applyTransformation(transformationMatrix, leftBase);
        applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);

        return joinGeometry(leftBase, topRung, bottomRung);
    }

    var GlyphFGeometry = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$5$1
    });

    var Geometry3D = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Quad: QuadGeometry,
        Plane: PlaneGeometry,
        Cube: CubeGeometry,
        GlyphF: GlyphFGeometry,
        create: create$1$1,
        applyColor: applyColor,
        applyTransformation: applyTransformation,
        joinGeometry: joinGeometry
    });

    function create$6$1(position, texcoord, indices, color = undefined)
    {
        if (!color)
        {
            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            color = [];
            for(let i = 0; i < position.length; i += 3)
            {
                color.push(r, g, b);
            }
        }

        return {
            position,
            texcoord,
            indices,
            color,
            elementSize: 2,
            elementCount: indices.length,
        };
    }

    function applyTransformation2D(transformationMatrix, geometry)
    {
        const position = geometry.position;

        const result = vec2.create();
        for(let i = 0; i < position.length; i += 2)
        {
            result[0] = position[i + 0];
            result[1] = position[i + 1];
            vec3.transformMat3(result, result, transformationMatrix);
            position[i + 0] = result[0];
            position[i + 1] = result[1];
        }

        return geometry;
    }

    function joinGeometry2D(...geometries)
    {
        const position = [];
        const texcoord = [];
        const indices = [];
        const color = [];

        let indexCount = 0;
        for(const geometry of geometries)
        {
            position.push(...geometry.position);
            texcoord.push(...geometry.texcoord);
            color.push(...geometry.color);

            for(let i = 0; i < geometry.indices.length; ++i)
            {
                const index = geometry.indices[i];
                indices.push(index + indexCount);
            }

            indexCount += geometry.position.length / 2;
        }

        return create$6$1(position, texcoord, indices, color);
    }

    function create$7$1(centered = false)
    {
        const x = 0;
        const y = 0;
        const width = 1;
        const height = 1;
        
        let position;
        if (centered)
        {
            const halfWidth = width * 0.5;
            const halfHeight = height * 0.5;
            position = [
                x - halfWidth, y - halfHeight,
                x + halfWidth, y - halfHeight,
                x - halfWidth, y + halfHeight,
                x + halfWidth, y + halfHeight,
            ];
        }
        else
        {
            position = [
                x, y,
                x + width, y,
                x, y + height,
                x + width, y + height,
            ];
        }

        const texcoord = [
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        const indices = [
            0, 1, 2,
            2, 1, 3,
        ];
        
        return create$6$1(position, texcoord, indices);
    }

    var Quad2DGeometry = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$7$1
    });

    function create$8$1()
    {
        const size = 1;
        const fifthSize = size * 0.2;

        const transformationMatrix = create$2();

        const topRung = create$7$1();
        fromTranslation$1(transformationMatrix, [fifthSize / 2, fifthSize * 2]);
        scale$2(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize]);
        applyTransformation2D(transformationMatrix, topRung);
        applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
        
        const bottomRung = create$7$1();
        fromScaling$2(transformationMatrix, [fifthSize, fifthSize]);
        applyTransformation2D(transformationMatrix, bottomRung);
        applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);

        const leftBase = create$7$1();
        fromTranslation$1(transformationMatrix, [-fifthSize, 0]);
        scale$2(transformationMatrix, transformationMatrix, [fifthSize, size]);
        applyTransformation2D(transformationMatrix, leftBase);
        applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);

        return joinGeometry2D(leftBase, topRung, bottomRung);
    }

    var GlyphF2DGeometry = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$8$1
    });

    var Geometry2D = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Quad2D: Quad2DGeometry,
        GlyphF2D: GlyphF2DGeometry,
        applyColor2D: applyColor,
        create: create$6$1,
        applyTransformation2D: applyTransformation2D,
        joinGeometry2D: joinGeometry2D
    });

    function createShaderProgramInfo(gl, vertexShaderSource, fragmentShaderSource, sharedAttributeLayout = [])
    {
        const vertexShaderHandle = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShaderHandle = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const programHandle = createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributeLayout);

        // Don't forget to clean up the shaders! It's no longer needed...
        gl.detachShader(programHandle, vertexShaderHandle);
        gl.detachShader(programHandle, fragmentShaderHandle);
        gl.deleteShader(vertexShaderHandle);
        gl.deleteShader(fragmentShaderHandle);

        // But do keep around the program :P
        return {
            handle: programHandle,
            _gl: gl,
            uniforms: createShaderProgramUniformSetters(gl, programHandle),
            attributes: createShaderProgramAttributeSetters(gl, programHandle),
            uniform(name, value)
            {
                // If the uniform exists, since it may have been optimized away by the compiler :(
                if (name in this.uniforms)
                {
                    this.uniforms[name](this._gl, value);
                }
                return this;
            },
            attribute(name, bufferInfo)
            {
                // If the attribute exists, since it may have been optimized away by the compiler :(
                if (name in this.attributes)
                {
                    this.attributes[name](this._gl, bufferInfo);
                }
                return this;
            },
            elementAttribute(bufferInfo)
            {
                this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo);
                return this;
            }
        };
    }

    function createShader(gl, type, source)
    {
        const shaderHandle = gl.createShader(type);
        gl.shaderSource(shaderHandle, source);
        gl.compileShader(shaderHandle);
        if (!gl.getShaderParameter(shaderHandle, gl.COMPILE_STATUS))
        {
            const result = gl.getShaderInfoLog(shaderHandle);
            gl.deleteShader(shaderHandle);
            throw new Error(result);
        }
        return shaderHandle;
    }

    function createShaderProgram(gl, vertexShaderHandle, fragmentShaderHandle, sharedAttributeLayout = [])
    {
        const programHandle = gl.createProgram();
        gl.attachShader(programHandle, vertexShaderHandle);
        gl.attachShader(programHandle, fragmentShaderHandle);

        // Bind the attribute locations, (either this or use 'layout(location = ?)' in the shader)
        // NOTE: Unfortunately, this must happen before program linking to take effect.
        for(let i = 0; i < sharedAttributeLayout.length; ++i)
        {
            gl.bindAttribLocation(programHandle, i, sharedAttributeLayout[i]);
        }

        gl.linkProgram(programHandle);
        if (!gl.getProgramParameter(programHandle, gl.LINK_STATUS))
        {
            const result = gl.getProgramInfoLog(programHandle);
            gl.deleteProgram(programHandle);
            throw new Error(result);
        }
        return programHandle;
    }

    function createShaderProgramAttributeSetters(gl, programHandle)
    {
        const dst = {};
        const attributeCount = gl.getProgramParameter(programHandle, gl.ACTIVE_ATTRIBUTES);
        for(let i = 0; i < attributeCount; ++i)
        {
            const activeAttributeInfo = gl.getActiveAttrib(programHandle, i);
            if (!activeAttributeInfo) break;
            const attributeName = activeAttributeInfo.name;
            const attributeIndex = gl.getAttribLocation(programHandle, attributeName);
            dst[attributeName] = createShaderProgramAttributeSetter(attributeIndex);
        }
        return dst;
    }

    function createShaderProgramAttributeSetter(attributeIndex)
    {
        const result = (function(attributeIndex, gl, bufferInfo) {
            gl.enableVertexAttribArray(attributeIndex);
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.handle);
            gl.vertexAttribPointer(attributeIndex,
                bufferInfo.size,
                bufferInfo.type,
                bufferInfo.normalize,
                bufferInfo.stride,
                bufferInfo.offset);
        }).bind(null, attributeIndex);
        result.location = attributeIndex;
        return result;
    }

    function createShaderProgramUniformSetters(gl, programHandle)
    {
        const dst = {};
        const ctx = {
            textureUnit: 0
        };
        const uniformCount = gl.getProgramParameter(programHandle, gl.ACTIVE_UNIFORMS);
        for(let i = 0; i < uniformCount; ++i)
        {
            const activeUniformInfo = gl.getActiveUniform(programHandle, i);
            if (!activeUniformInfo) break;

            let uniformName = activeUniformInfo.name;
            if (uniformName.substring(uniformName.length - 3) === '[0]')
            {
                uniformName = uniformName.substring(0, uniformName.length - 3);
            }
            const uniformSetter = createShaderProgramUniformSetter(gl, programHandle, activeUniformInfo, ctx);
            dst[uniformName] = uniformSetter;
        }
        return dst;
    }

    function createShaderProgramUniformSetter(gl, programHandle, uniformInfo, ctx)
    {
        const name = uniformInfo.name;
        const location = gl.getUniformLocation(programHandle, name);
        const type = uniformInfo.type;
        const array = (uniformInfo.size > 1 && name.substring(name.length - 3) === '[0]');

        const uniformTypeInfo = getUniformTypeInfo(gl, type);
        if (!uniformTypeInfo)
        {
            throw new Error(`Unknown uniform type 0x${type.toString(16)}.`);
        }

        switch(type)
        {
            case gl.FLOAT:
            case gl.INT:
            case gl.BOOL:
                return uniformTypeInfo.setter(location, array);
            case gl.SAMPLER_2D:
            case gl.SAMPLER_CUBE:
                let textureUnit;
                if (array)
                {
                    textureUnit = [];
                    for(let i = 0; i < uniformInfo.size; ++i)
                    {
                        textureUnit.push(ctx.textureUnit++);
                    }
                }
                else
                {
                    textureUnit = ctx.textureUnit++;
                }
                return uniformTypeInfo.setter(location, array, textureUnit);
            default:
                return uniformTypeInfo.setter(location);
        }
    }

    let UNIFORM_TYPE_MAP = null;
    function getUniformTypeInfo(gl, type)
    {
        if (UNIFORM_TYPE_MAP) return UNIFORM_TYPE_MAP[type];

        // NOTE: Instead of setting the active texture index for the sampler, we instead designate
        // active texture indices based on the program and number of sampler uniforms it has.
        // This way, we simply pass the texture handle to the uniform setter and it will find
        // the associated texture index by name. This is okay since we usually expect each
        // program to have it's own unqiue active texture list, therefore we can take advantage
        // of the reassignment of sampler uniforms to perform a lookup first instead.
        // This does mean that when creating a texture, you don't need to specify which active
        // texture index it should be in. This is handled by the shader program initialization,
        // and is assigned when the program is used.
        function samplerSetter(textureTarget, location, array = false, textureUnit = 0)
        {
            if (array && !Array.isArray(textureUnit)) throw new Error('Cannot create sampler array for non-array texture unit.');
            const result = (array
                ? function(location, textureUnits, textureTarget, gl, textures) {
                    gl.uniform1fv(location, textureUnits);
                    textures.forEach((texture, index) => {
                        gl.activeTexture(gl.TEXTURE0 + textureUnits[index]);
                        gl.bindTexture(textureTarget, texture);
                    });
                }
                : function(location, textureUnit, textureTarget, gl, texture) {
                    gl.uniform1i(location, textureUnit);
                    gl.activeTexture(gl.TEXTURE0 + textureUnit);
                    gl.bindTexture(textureTarget, texture);
                })
                .bind(null, location, textureUnit, textureTarget);
            result.location = location;
            return result;
        }

        UNIFORM_TYPE_MAP = {
            [gl.FLOAT]: {
                TypedArray: Float32Array,
                size: 4,
                setter(location, array = false)
                {
                    const result = (array
                        ? function(location, gl, value) { gl.uniform1fv(location, value); }
                        : function(location, gl, value) { gl.uniform1f(location, value); })
                        .bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.FLOAT_VEC2]: {
                TypedArray: Float32Array,
                size: 8,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniform2fv(location, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.FLOAT_VEC3]: {
                TypedArray: Float32Array,
                size: 12,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniform3fv(location, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.FLOAT_VEC4]: {
                TypedArray: Float32Array,
                size: 16,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniform4fv(location, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.INT]: {
                TypedArray: Int32Array,
                size: 4,
                setter(location, array = false)
                {
                    const result = (array
                        ? function(location, gl, value) { gl.uniform1iv(location, value); }
                        : function(location, gl, value) { gl.uniform1i(location, value); })
                        .bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.INT_VEC2]: {
                TypedArray: Int32Array,
                size: 8,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniform2iv(location, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.INT_VEC3]: {
                TypedArray: Int32Array,
                size: 12,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniform3iv(location, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.INT_VEC4]: {
                TypedArray: Int32Array,
                size: 16,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniform4iv(location, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.BOOL]: {
                TypedArray: Uint32Array,
                size: 4,
                setter(location, array = false)
                {
                    const result = (array
                        ? function(location, gl, value) { gl.uniform1iv(location, value); }
                        : function(location, gl, value) { gl.uniform1i(location, value); })
                        .bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.BOOL_VEC2]: {
                TypedArray: Uint32Array,
                size: 8,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniform2iv(location, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.BOOL_VEC3]: {
                TypedArray: Uint32Array,
                size: 12,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniform3iv(location, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.BOOL_VEC4]: {
                TypedArray: Uint32Array,
                size: 16,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniform4iv(location, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.FLOAT_MAT2]: {
                TypedArray: Float32Array,
                size: 16,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniformMatrix2fv(location, false, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.FLOAT_MAT3]: {
                TypedArray: Float32Array,
                size: 36,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniformMatrix3fv(location, false, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.FLOAT_MAT4]: {
                TypedArray: Float32Array,
                size: 64,
                setter(location)
                {
                    const result = (function(location, gl, value) { gl.uniformMatrix4fv(location, false, value); }).bind(null, location);
                    result.location = location;
                    return result;
                }
            },
            [gl.SAMPLER_2D]: {
                TypedArray: null,
                size: 0,
                setter: samplerSetter.bind(null, gl.TEXTURE_2D)
            },
            [gl.SAMPLER_CUBE]: {
                TypedArray: null,
                size: 0,
                setter: samplerSetter.bind(null, gl.TEXTURE_CUBE)
            },
            // UNSIGNED_INT
            // UNSIGNED_INT_VEC2
            // UNSIGNED_INT_VEC3
            // UNSIGNED_INT_VEC4
            // FLOAT_MAT2x3
            // FLOAT_MAT2x4
            // FLOAT_MAT3x2
            // FLOAT_MAT3x4
            // FLOAT_MAT4x2
            // FLOAT_MAT4x3
            // SAMPLER_3D
            // SAMPLER_2D_SHADOW
            // SAMPLER_2D_ARRAY
            // SAMPLER_2D_ARRAY_SHADOW
            // INT_SAMPLER_2D
            // INT_SAMPLER_3D
            // INT_SAMPLER_CUBE
            // INT_SAMPLER_2D_ARRAY
            // UNSIGNED_INT_SAMPLER_2D
            // UNSIGNED_INT_SAMPLER_3D
            // UNSIGNED_INT_SAMPLER_CUBE
            // UNSIGNED_INT_SAMPLER_2D_ARRAY
        };
        return UNIFORM_TYPE_MAP[type];
    }

    function createBufferInfo(gl, type, data, size, normalize = false, stride = 0, offset = 0, bufferTarget = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW)
    {
        const bufferHandle = gl.createBuffer();

        const bufferTypeInfo = getBufferTypeInfo(gl, type);
        if (!bufferTypeInfo) throw new Error(`Unknown uniform type 0x${type.toString(16)}.`);    

        if (data instanceof bufferTypeInfo.TypedArray)
        {
            gl.bindBuffer(bufferTarget, bufferHandle);
            gl.bufferData(bufferTarget, data, usage);
        }
        else if (Array.isArray(data))
        {
            data = new bufferTypeInfo.TypedArray(data);
            gl.bindBuffer(bufferTarget, bufferHandle);
            gl.bufferData(bufferTarget, data, usage);
        }
        else if (typeof data === 'number')
        {
            gl.bindBuffer(bufferTarget, bufferHandle);
            gl.bufferData(bufferTarget, data, usage);
        }
        else
        {
            throw new Error(`Unknown buffer data type - can only be a TypedArray, an Array, or a number.`);
        }

        return {
            handle: bufferHandle,
            size,
            type,
            normalize,
            stride,
            offset,
            /** TODO: It binds the buffer to ARRAY_BUFFER, does this still work for ELEMENT_ARRAY_BUFFER? */
            updateData(gl, data, offset = 0, usage = gl.STATIC_DRAW)
            {
                // NOTE: All vertex array objects should NOT be bound. Otherwise, it will cause weird errors.
                gl.bindBuffer(gl.ARRAY_BUFFER, this.handle);
                const bufferTypeInfo = getBufferTypeInfo(gl, type);
                if (!(data instanceof bufferTypeInfo.TypedArray))
                {
                    data = new bufferTypeInfo.TypedArray(data);
                }

                if (offset > 0)
                {
                    gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
                }
                else
                {
                    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
                }
            }
        };
    }

    function createElementBufferInfo(gl, type, data, stride = 0, offset = 0, usage = gl.STATIC_DRAW)
    {
        // NOTE: Element buffer arrays can only be UNSIGNED bytes/shorts/ints.
        return createBufferInfo(gl, type, data, 1, false, stride, offset, gl.ELEMENT_ARRAY_BUFFER, usage);
    }

    let BUFFER_TYPE_MAP = null;
    function getBufferTypeInfo(gl, type)
    {
        if (BUFFER_TYPE_MAP) return BUFFER_TYPE_MAP[type];

        BUFFER_TYPE_MAP = {
            [gl.BYTE]: {
                TypedArray: Int8Array,
                size: 1
            },
            [gl.SHORT]: {
                TypedArray: Int16Array,
                size: 2
            },
            [gl.UNSIGNED_BYTE]: {
                TypedArray: Uint8Array,
                size: 1
            },
            [gl.UNSIGNED_SHORT]: {
                TypedArray: Uint16Array,
                size: 2
            },
            [gl.FLOAT]: {
                TypedArray: Float32Array,
                size: 4
            },
            // HALF_FLOAT
        };

        return BUFFER_TYPE_MAP[type];
    }

    function createVertexArrayInfo(gl, sharedAttributeLayout = [])
    {
        const vertexArrayHandle = gl.createVertexArray();

        const attributes = {};
        for(let i = 0; i < sharedAttributeLayout.length; ++i)
        {
            attributes[sharedAttributeLayout[i]] = {
                location: i,
                setter: createShaderProgramAttributeSetter(i)
            };
        }

        return {
            handle: vertexArrayHandle,
            attributes: attributes,
            _gl: gl,
            elementBuffer: null,
            elementType: null,
            elementCount: 0,
            attributeBuffers: {},
            setElementCount(count)
            {
                this.elementCount = count;
                return this;
            },
            elementAttribute(bufferInfo)
            {
                this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferInfo.handle);

                const bufferTypeInfo = getBufferTypeInfo(this._gl, bufferInfo.type);
                // NOTE: Number of bytes in buffer divided by the number of bytes of element type
                this.elementCount = this._gl.getBufferParameter(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.BUFFER_SIZE) / bufferTypeInfo.size;
                this.elementBuffer = bufferInfo;
                this.elementType = bufferInfo.type;
                return this;
            },
            sharedAttribute(name, bufferInfo)
            {
                if (name in this.attributes)
                {
                    this.attributes[name].setter(this._gl, bufferInfo);
                }
                this.attributeBuffers[name] = bufferInfo;
                return this;
            },
            programAttribute(name, bufferInfo, ...programInfos)
            {
                for(const program of programInfos)
                {
                    program.attribute(name, bufferInfo);
                }
                this.attributeBuffers[name] = bufferInfo;
                return this;
            }
        };
    }

    function createTextureInfo(gl)
    {
        const textureHandle = gl.createTexture();
        return {
            handle: textureHandle
        };
    }

    function createDrawInfo(programInfo, vertexArrayInfo, uniforms, drawArrayOffset = 0, drawMode = null)
    {
        return {
            programInfo,
            vertexArrayInfo,
            uniforms,
            drawArrayOffset,
            drawMode
        };
    }

    function draw(gl, drawInfos, sharedUniforms = {})
    {
        for(const drawInfo of drawInfos)
        {
            const programInfo = drawInfo.programInfo;
            const vertexArrayInfo = drawInfo.vertexArrayInfo;
            const uniforms = drawInfo.uniforms;
            const drawArrayOffset = drawInfo.drawArrayOffset;
            const drawMode = drawInfo.drawMode || gl.TRIANGLES;

            // Prepare program...
            gl.useProgram(programInfo.handle);

            // Prepare vertex array...
            gl.bindVertexArray(vertexArrayInfo.handle);

            // Prepare shared uniforms...
            for(const [name, value] of Object.entries(sharedUniforms))
            {
                programInfo.uniform(name, value);
            }

            // Prepare uniforms...
            for(const [name, value] of Object.entries(uniforms))
            {
                programInfo.uniform(name, value);
            }

            // Depends on buffers in attributes...
            if (vertexArrayInfo.elementBuffer)
            {
                // NOTE: The offset is in BYTES, whereas drawArrayOffset is the number of elements.
                gl.drawElements(drawMode, vertexArrayInfo.elementCount, vertexArrayInfo.elementType, drawArrayOffset * vertexArrayInfo.elementBuffer.size);
            }
            else
            {
                gl.drawArrays(drawMode, drawArrayOffset, vertexArrayInfo.elementCount);
            }
        }
    }

    async function loadImage(filepath, opts)
    {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.addEventListener('load', () => {
                resolve(img);
            });
            img.addEventListener('error', ev => {
                reject(ev);
            });
            img.src = filepath;
        });
    }

    var ImageLoader = /*#__PURE__*/Object.freeze({
        __proto__: null,
        loadImage: loadImage
    });

    async function loadText(filepath, opts)
    {
        let result = await fetch(filepath);
        return result.text();
    }

    var TextLoader = /*#__PURE__*/Object.freeze({
        __proto__: null,
        loadText: loadText
    });

    async function loadBytes(filepath, opts)
    {
        let result = await fetch(filepath);
        let buffer = await result.arrayBuffer();
        return buffer;
    }

    var ByteLoader = /*#__PURE__*/Object.freeze({
        __proto__: null,
        loadBytes: loadBytes
    });

    async function loadJSON(filepath, opts)
    {
        let result = await fetch(filepath);
        let json = await result.json();
        return json;
    }

    var JSONLoader = /*#__PURE__*/Object.freeze({
        __proto__: null,
        loadJSON: loadJSON
    });

    async function loadOBJ(filepath, opts)
    {
        let result = await fetch(filepath);
        let string = await result.text();
        {
            // console.log('ORIGINAL');
            const attempts = 10;
            for(let i = 0; i < attempts; ++i)
            {
                let then = performance.now();
                parse(string);
                let now = performance.now();
            }
            // console.log(sum / attempts);
        }
        {
            // console.log('UPDATE');
            const attempts = 10;
            for(let i = 0; i < attempts; ++i)
            {
                let then = performance.now();
                parse2(string);
                let now = performance.now();
            }
            // console.log(sum / attempts);
        }
        return parse2(string);
    }

    function parse2(string)
    {
        const vertexList = [];
        const texcoordList = [];
        const normalList = [];

        const vertexIndices = [];
        const texcoordIndices = [];
        const normalIndices = [];

        // # comments
        const commentPattern = /^#.*/g;
        // v float float float
        const vertexPattern = /v\s+(\S+)\s+(\S+)\s+(\S+)/g;
        // vn float float float
        const normalPattern = /vn\s+(\S+)\s+(\S+)\s+(\S+)/g;
        // vt float float float
        const texcoordPattern = /vt\s+(\S+)\s+(\S+)/g;
        // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
        const facePattern = /f\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*))\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*))\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*))(\s+(([^\/\s]*)\/([^\/\s]*)\/?([^\/\s]*)))?/g;
        // f float float float
        const faceVertexPattern = /f\s+([^\/\s]+)\s+([^\/\s]+)\s+([^\/\s]+)/g;

        let quad = false;
        let result = null;
        let x, y, z, w;

        // Remove all comments
        string = string.replace(commentPattern, '');

        // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
        while ((result = vertexPattern.exec(string)) != null) {
            x = Number.parseFloat(result[1]);
            y = Number.parseFloat(result[2]);
            z = Number.parseFloat(result[3]);
            vertexList.push(x);
            vertexList.push(y);
            vertexList.push(z);
        }

        // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
        while ((result = normalPattern.exec(string)) != null) {
            x = Number.parseFloat(result[1]);
            y = Number.parseFloat(result[2]);
            z = Number.parseFloat(result[3]);
            normalList.push(x);
            normalList.push(y);
            normalList.push(z);
        }

        // ["vt 1.0 2.0", "1.0", "2.0"]
        while ((result = texcoordPattern.exec(string)) != null) {
            x = Number.parseFloat(result[1]);
            y = Number.parseFloat(result[2]);
            texcoordList.push(x);
            texcoordList.push(y);
        }

        // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", "4/4/4", "4", "4", "4"]
        while ((result = facePattern.exec(string)) != null) {
            // Vertex indices
            x = Number.parseInt(result[2]);
            if (Number.isNaN(x)) x = 1;
            y = Number.parseInt(result[6]);
            if (Number.isNaN(y)) y = 1;
            z = Number.parseInt(result[10]);
            if (Number.isNaN(z)) z = 1;
            vertexIndices.push(x);
            vertexIndices.push(y);
            vertexIndices.push(z);

            // Normal indices
            x = Number.parseInt(result[4]);
            if (Number.isNaN(x))
            {
                // No UVs.
                x = Number.parseInt(result[3]);
                y = Number.parseInt(result[7]);
                z = Number.parseInt(result[11]);
                normalIndices.push(x);
                normalIndices.push(y);
                normalIndices.push(z);

                texcoordIndices.push(1);
                texcoordIndices.push(1);
                texcoordIndices.push(1);
            }
            else
            {
                // Maybe UVs.
                y = Number.parseInt(result[8]);
                if (Number.isNaN(y)) y = 1;
                z = Number.parseInt(result[12]);
                if (Number.isNaN(z)) z = 1;
                normalIndices.push(x);
                normalIndices.push(y);
                normalIndices.push(z);

                // UV indices
                x = Number.parseInt(result[3]);
                if (Number.isNaN(x)) x = 1;
                y = Number.parseInt(result[7]);
                if (Number.isNaN(y)) y = 1;
                z = Number.parseInt(result[11]);
                if (Number.isNaN(z)) z = 1;
                texcoordIndices.push(x);
                texcoordIndices.push(y);
                texcoordIndices.push(z);
            }

            // Quad face
            if (typeof result[13] !== 'undefined') {
                
                // Vertex indices
                w = Number.parseInt(result[15]);
                if (Number.isNaN(w)) w = 1;
                vertexIndices.push(w);

                // Normal indices
                w = Number.parseInt(result[17]);
                if (Number.isNaN(w))
                {
                    // No UVs.
                    w = Number.parseInt(result[16]);
                    normalIndices.push(w);
                    texcoordIndices.push(1);
                }
                else
                {
                    // Maybe UVs.
                    normalIndices.push(w);

                    w = Number.parseInt(result[16]);
                    texcoordIndices.push(w);
                }

                quad = true;
            }
        }

        // ["f 1 2 3 4", "1", "2", "3", "4"]
        while ((result = faceVertexPattern.exec(string)) != null) {
            // Vertex indices
            x = Number.parseInt(result[2]);
            y = Number.parseInt(result[6]);
            z = Number.parseInt(result[10]);
            vertexIndices.push(x);
            vertexIndices.push(y);
            vertexIndices.push(z);

            // UV indices
            texcoordIndices.push(1);
            texcoordIndices.push(1);
            texcoordIndices.push(1);

            // Normal indices
            normalIndices.push(1);
            normalIndices.push(1);
            normalIndices.push(1);

            // Quad face
            if (typeof result[13] !== 'undefined') {

                // Vertex indices
                w = Number.parseInt(result[14]);
                vertexIndices.push(w);

                // UV indices
                texcoordIndices.push(1);
                // Normal indices
                normalIndices.push(1);

                quad = true;
            }
        }

        let index, size;

        size = vertexIndices.length;
        const positions = new Float32Array(size * 3);
        for (let i = 0; i < size; ++i) {
            index = vertexIndices[i] - 1;
            positions[i * 3 + 0] = vertexList[index * 3 + 0];
            positions[i * 3 + 1] = vertexList[index * 3 + 1];
            positions[i * 3 + 2] = vertexList[index * 3 + 2];
        }

        size = texcoordIndices.length;
        const texcoords = new Float32Array(size * 2);
        for (let i = 0; i < size; ++i) {
            index = texcoordIndices[i] - 1;
            texcoords[i * 2 + 0] = texcoordList[index * 2 + 0];
            texcoords[i * 2 + 1] = texcoordList[index * 2 + 1];
        }

        size = normalIndices.length;
        const normals = new Float32Array(size * 3);
        for (let i = 0; i < size; ++i) {
            index = normalIndices[i] - 1;
            normals[i * 3 + 0] = normalList[index * 3 + 0];
            normals[i * 3 + 1] = normalList[index * 3 + 1];
            normals[i * 3 + 2] = normalList[index * 3 + 2];
        }

        // Must be either unsigned short or unsigned byte.
        size = vertexIndices.length;
        const indices = new Uint16Array(size);
        for (let i = 0; i < size; ++i) {
            indices[i] = i;
        }

        if (quad) {
            console.warn('WebGL does not support quad faces, only triangles.');
        }

        return {
            positions,
            texcoords,
            normals,
            indices,
        };
    }

    function parse(string)
    {
        const vertexList = [];
        const texcoordList = [];
        const normalList = [];

        const vertexIndices = [];
        const texcoordIndices = [];
        const normalIndices = [];

        // # comments
        const commentPattern = /^#.*/g;
        // v float float float
        const vertexPattern = /v( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;
        // vn float float float
        const normalPattern = /vn( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;
        // vt float float float
        const texcoordPattern = /vt( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;
        // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
        const facePattern = /f( +([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))( ([\d]*)\/([\d]*)\/([\d]*))?/g;
        // f float float float
        const faceVertexPattern = /f( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/g;

        let quad = false;
        let result = null;
        let x, y, z, w;

        // Remove all comments
        string = string.replace(commentPattern, '');

        // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
        while ((result = vertexPattern.exec(string)) != null) {
            x = Number.parseFloat(result[1]);
            y = Number.parseFloat(result[2]);
            z = Number.parseFloat(result[3]);
            vertexList.push(x);
            vertexList.push(y);
            vertexList.push(z);
        }

        // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
        while ((result = normalPattern.exec(string)) != null) {
            x = Number.parseFloat(result[1]);
            y = Number.parseFloat(result[2]);
            z = Number.parseFloat(result[3]);
            normalList.push(x);
            normalList.push(y);
            normalList.push(z);
        }

        // ["vt 1.0 2.0", "1.0", "2.0"]
        while ((result = texcoordPattern.exec(string)) != null) {
            x = Number.parseFloat(result[1]);
            y = Number.parseFloat(result[2]);
            texcoordList.push(x);
            texcoordList.push(y);
        }

        // ["f 1/1/1 2/2/2 3/3/3", "1/1/1", "1", "1", "1", "2/2/2", "2", "2", "2", "3/3/3", "3", "3", "3", "4/4/4", "4", "4", "4"]
        while ((result = facePattern.exec(string)) != null) {
            // Vertex indices
            x = Number.parseInt(result[2]);
            if (Number.isNaN(x)) x = 1;
            y = Number.parseInt(result[6]);
            if (Number.isNaN(y)) y = 1;
            z = Number.parseInt(result[10]);
            if (Number.isNaN(z)) z = 1;
            vertexIndices.push(x);
            vertexIndices.push(y);
            vertexIndices.push(z);

            // UV indices
            x = Number.parseInt(result[3]);
            if (Number.isNaN(x)) x = 1;
            y = Number.parseInt(result[7]);
            if (Number.isNaN(y)) y = 1;
            z = Number.parseInt(result[11]);
            if (Number.isNaN(z)) z = 1;
            texcoordIndices.push(x);
            texcoordIndices.push(y);
            texcoordIndices.push(z);

            // Normal indices
            x = Number.parseInt(result[4]);
            if (Number.isNaN(x)) x = 1;
            y = Number.parseInt(result[8]);
            if (Number.isNaN(y)) y = 1;
            z = Number.parseInt(result[12]);
            if (Number.isNaN(z)) z = 1;
            normalIndices.push(x);
            normalIndices.push(y);
            normalIndices.push(z);

            // Quad face
            if (typeof result[13] !== 'undefined') {
                
                // Vertex indices
                w = Number.parseInt(result[14]);
                if (Number.isNaN(w)) w = 1;
                vertexIndices.push(w);

                // UV indices
                w = Number.parseInt(result[15]);
                if (Number.isNaN(w)) w = 1;
                texcoordIndices.push(w);

                // Normal indices
                w = Number.parseInt(result[16]);
                if (Number.isNaN(w)) w = 1;
                normalIndices.push(w);

                quad = true;
            }
        }

        // ["f 1 2 3 4", "1", "2", "3", "4"]
        while ((result = faceVertexPattern.exec(string)) != null) {
            // Vertex indices
            x = Number.parseInt(result[2]);
            y = Number.parseInt(result[6]);
            z = Number.parseInt(result[10]);
            vertexIndices.push(x);
            vertexIndices.push(y);
            vertexIndices.push(z);

            // UV indices
            texcoordIndices.push(1);
            texcoordIndices.push(1);
            texcoordIndices.push(1);

            // Normal indices
            normalIndices.push(1);
            normalIndices.push(1);
            normalIndices.push(1);

            // Quad face
            if (typeof result[13] !== 'undefined') {

                // Vertex indices
                w = Number.parseInt(result[14]);
                vertexIndices.push(w);

                // UV indices
                texcoordIndices.push(1);
                // Normal indices
                normalIndices.push(1);

                quad = true;
            }
        }

        let index, size;

        size = vertexIndices.length;
        const positions = new Float32Array(size * 3);
        for (let i = 0; i < size; ++i) {
            index = vertexIndices[i] - 1;
            positions[i * 3 + 0] = vertexList[index * 3 + 0];
            positions[i * 3 + 1] = vertexList[index * 3 + 1];
            positions[i * 3 + 2] = vertexList[index * 3 + 2];
        }

        size = texcoordIndices.length;
        const texcoords = new Float32Array(size * 2);
        for (let i = 0; i < size; ++i) {
            index = texcoordIndices[i] - 1;
            texcoords[i * 2 + 0] = texcoordList[index * 2 + 0];
            texcoords[i * 2 + 1] = texcoordList[index * 2 + 1];
        }

        size = normalIndices.length;
        const normals = new Float32Array(size * 3);
        for (let i = 0; i < size; ++i) {
            index = normalIndices[i] - 1;
            normals[i * 3 + 0] = normalList[index * 3 + 0];
            normals[i * 3 + 1] = normalList[index * 3 + 1];
            normals[i * 3 + 2] = normalList[index * 3 + 2];
        }

        // Must be either unsigned short or unsigned byte.
        size = vertexIndices.length;
        const indices = new Uint16Array(size);
        for (let i = 0; i < size; ++i) {
            indices[i] = i;
        }

        if (quad) {
            console.warn('WebGL does not support quad faces, only triangles.');
        }

        return {
            positions,
            texcoords,
            normals,
            indices,
        };
    }

    var OBJLoader = /*#__PURE__*/Object.freeze({
        __proto__: null,
        loadOBJ: loadOBJ
    });

    let ASSET_LOADERS = {};

    defineAssetLoader('image', loadImage);
    defineAssetLoader('text', loadText);
    defineAssetLoader('json', loadJSON);
    defineAssetLoader('bytes', loadBytes);
    defineAssetLoader('obj', loadOBJ);

    function defineAssetLoader(assetType, assetLoader)
    {
        ASSET_LOADERS[assetType] = assetLoader;
    }

    function getAssetLoader(assetType)
    {
        if (assetType in ASSET_LOADERS)
        {
            return ASSET_LOADERS[assetType];
        }
        else
        {
            throw new Error(`Unknown asset type '${assetType}'.`);
        }
    }

    async function loadAssetMap(assetMap, assetParentPath = '.')
    {
        let result = {};
        for(let assetName of Object.keys(assetMap))
        {
            let entry = assetMap[assetName];
            if (typeof entry === 'string')
            {
                result[assetName] = await loadAsset(entry, undefined, assetParentPath);
            }
            else if (typeof entry === 'object')
            {
                if (!('src' in entry))
                {
                    throw new Error(`Missing required field 'src' for entry in asset map.`);
                }

                if ('name' in entry && entry.name !== assetName)
                {
                    throw new Error(`Cannot redefine name for asset '${assetName}' for entry in asset map.`);
                }

                result[assetName] = await loadAsset(entry.src, entry, assetParentPath);
            }
            else
            {
                throw new Error('Unknown entry type in asset map.');
            }
        }
        return result;
    }

    async function loadAssetList(assetList, assetParentPath = '.')
    {
        let result = {};
        for(let entry of assetList)
        {
            if (typeof entry === 'string')
            {
                result[entry] = await loadAsset(entry, undefined, assetParentPath);
            }
            else if (typeof entry === 'object')
            {
                if (!('src' in entry))
                {
                    throw new Error(`Missing required field 'src' for entry in asset list.`);
                }

                result['name' in entry ? entry.name : entry.src] = await loadAsset(entry.src, entry, assetParentPath);
            }
            else
            {
                throw new Error('Unknown entry type in asset list.');
            }
        }
        return result;
    }

    async function loadAsset(assetSrc, assetOpts = {}, assetParentPath = '.')
    {
        if (assetSrc.indexOf(':') < 0)
        {
            throw new Error('Missing type for asset source.');
        }

        let [assetType, assetPath] = assetSrc.split(':');
        let assetLoader = getAssetLoader(assetType);
        return await assetLoader(assetParentPath + '/' + assetPath, assetOpts);
    }

    var AssetLoader = /*#__PURE__*/Object.freeze({
        __proto__: null,
        defineAssetLoader: defineAssetLoader,
        getAssetLoader: getAssetLoader,
        loadAssetMap: loadAssetMap,
        loadAssetList: loadAssetList,
        loadAsset: loadAsset
    });

    // SOURCE: https://noonat.github.io/intersect/#aabb-vs-aabb

    /* Surface contacts are considered intersections, including sweeps. */

    const EPSILON$1 = 1e-8;

    function clamp(value, min, max)
    {
        return Math.min(Math.max(value, min), max);
    }

    function createAABB(x, y, rx, ry)
    {
        return {
            x, y,
            rx, ry,
        };
    }

    function createRect(left, top, right, bottom)
    {
        let rx = Math.abs(right - left) / 2;
        let ry = Math.abs(bottom - top) / 2;
        return createAABB(Math.min(left, right) + rx, Math.min(top, bottom) + ry, rx, ry);
    }

    function testAABB(a, b)
    {
        if (Math.abs(a.x - b.x) > (a.rx + b.rx)) return false;
        if (Math.abs(a.y - b.y) > (a.ry + b.ry)) return false;
        return true;
    }

    function intersectAABB(out, a, b)
    {
        let dx = b.x - a.x;
        let px = (b.rx + a.rx) - Math.abs(dx);
        if (px < 0) return null;

        let dy = b.y - a.y;
        let py = (b.ry + a.ry) - Math.abs(dy);
        if (py < 0) return null;

        if (px < py)
        {
            let sx = Math.sign(dx);
            out.dx = px * sx;
            out.dy = 0;
            out.nx = sx;
            out.ny = 0;
            out.x = a.x + (a.rx * sx);
            out.y = b.y;
        }
        else
        {
            let sy = Math.sign(dy);
            out.dx = 0;
            out.dy = py * sy;
            out.nx = 0;
            out.ny = sy;
            out.x = b.x;
            out.y = a.y + (a.ry * sy);
        }

        return out;
    }

    function intersectPoint(out, a, x, y)
    {
        let dx = x - a.x;
        let px = a.rx - Math.abs(dx);
        if (px < 0) return null;

        let dy = y - a.y;
        let py = a.ry - Math.abs(dy);
        if (py < 0) return null;

        if (px < py)
        {
            let sx = Math.sign(dx);
            out.dx = px * sx;
            out.dy = 0;
            out.nx = sx;
            out.ny = 0;
            out.x = a.x + (a.rx * sx);
            out.y = y;
        }
        else
        {
            let sy = Math.sign(dy);
            out.dx = 0;
            out.dy = py * sy;
            out.nx = 0;
            out.ny = sy;
            out.x = x;
            out.y = a.y + (a.ry * sy);
        }

        return out;
    }

    function intersectSegment(out, a, x, y, dx, dy, px = 0, py = 0)
    {
        if (Math.abs(dx) < EPSILON$1
            && Math.abs(dy) < EPSILON$1
            && px === 0
            && py === 0)
        {
            return intersectPoint(out, a, x, y);
        }
        
        let arx = a.rx;
        let ary = a.ry;
        let bpx = px;
        let bpy = py;
        let scaleX = 1.0 / (dx || EPSILON$1);
        let scaleY = 1.0 / (dy || EPSILON$1);
        let signX = Math.sign(scaleX);
        let signY = Math.sign(scaleY);
        let nearTimeX = (a.x - signX * (arx + bpx) - x) * scaleX;
        let nearTimeY = (a.y - signY * (ary + bpy) - y) * scaleY;
        let farTimeX = (a.x + signX * (arx + bpx) - x) * scaleX;
        let farTimeY = (a.y + signY * (ary + bpy) - y) * scaleY;
        if (nearTimeX > farTimeY || nearTimeY > farTimeX) return null;

        let nearTime = Math.max(nearTimeX, nearTimeY);
        let farTime = Math.min(farTimeX, farTimeY);
        if (nearTime > 1 || farTime < 0) return null;

        let time = clamp(nearTime, 0, 1);
        let hitdx = (1.0 - time) * -dx;
        let hitdy = (1.0 - time) * -dy;
        let hitx = x + dx * time;
        let hity = y + dy * time;

        if (nearTimeX > nearTimeY)
        {
            out.time = time;
            out.nx = -signX;
            out.ny = 0;
            out.dx = hitdx;
            out.dy = hitdy;
            out.x = hitx;
            out.y = hity;
        }
        else
        {
            out.time = time;
            out.nx = 0;
            out.ny = -signY;
            out.dx = hitdx;
            out.dy = hitdy;
            out.x = hitx;
            out.y = hity;
        }

        return out;
    }

    function intersectSweepAABB(out, a, b, dx, dy)
    {
        return intersectSegment(out, a, b.x, b.y, dx, dy, b.rx, b.ry);
    }

    function sweepIntoAABB(out, a, b, dx, dy)
    {
        if (Math.abs(dx) < EPSILON$1 && Math.abs(dy) < EPSILON$1)
        {
            let hit = intersectAABB({}, b, a);
            if (hit) hit.time = 0;

            out.x = a.x;
            out.y = a.y;
            out.time = hit ? 0 : 1;
            out.hit = hit;
            return out;
        }

        let hit = intersectSweepAABB({}, b, a, dx, dy);
        if (hit)
        {
            let time = clamp(hit.time, 0, 1);
            let length = Math.sqrt(dx * dx + dy * dy);

            let normaldx;
            let normaldy;
            if (length)
            {
                normaldx = dx / length;
                normaldy = dy / length;
            }
            else
            {
                normaldx = 0;
                normaldy = 0;
            }
            hit.x = clamp(hit.x + normaldx * a.rx, b.x - b.rx, b.x + b.rx);
            hit.y = clamp(hit.y + normaldy * a.ry, b.y - b.ry, b.y + b.ry);

            out.time = time;
            out.x = a.x + dx * time;
            out.y = a.y + dy * time;
            out.hit = hit;
        }
        else
        {
            out.time = 1;
            out.x = a.x + dx;
            out.y = a.y + dy;
            out.hit = hit;
        }

        return out;
    }

    function sweepInto(out, a, staticColliders, dx, dy)
    {
        let tmp = {};

        out.time = 1;
        out.x = a.x + dx;
        out.y = a.y + dy;
        out.hit = null;

        for(let i = 0, l = staticColliders.length; i < l; ++i)
        {
            let result = sweepIntoAABB(tmp, a, staticColliders[i], dx, dy);
            if (result.time <= out.time)
            {
                out.time = result.time;
                out.x = result.x;
                out.y = result.y;
                out.hit = result.hit;
            }
        }
        return out;
    }

    var IntersectionHelper = /*#__PURE__*/Object.freeze({
        __proto__: null,
        EPSILON: EPSILON$1,
        clamp: clamp,
        createAABB: createAABB,
        createRect: createRect,
        testAABB: testAABB,
        intersectAABB: intersectAABB,
        intersectPoint: intersectPoint,
        intersectSegment: intersectSegment,
        sweepInto: sweepInto
    });

    const MAX_SWEEP_RESOLUTION_ITERATIONS = 100;

    function computeIntersections(masks, statics = [])
    {
        // Compute physics.
        for(let mask of masks)
        {
            switch(mask.type)
            {
                case 'point':
                    mask.hit = null;
                    for(let other of statics)
                    {
                        mask.hit = intersectPoint({}, other, mask.x, mask.y);
                        if (mask.hit) break;
                    }
                    break;
                case 'segment':
                    mask.hit = null;
                    for(let other of statics)
                    {
                        mask.hit = intersectSegment({}, other, mask.x, mask.y, mask.dx, mask.dy, mask.px, mask.py);
                        if (mask.hit) break;
                    }
                    break;
                case 'aabb':
                    mask.hit = null;
                    for(let other of statics)
                    {
                        mask.hit = intersectAABB({}, other, mask);
                        if (mask.hit) break;
                    }
                    break;
            }
        }
    }

    function resolveIntersections(dynamics, statics = [], dt = 1)
    {
        // Do physics.
        for(let dynamic of dynamics)
        {
            let dx = dynamic.dx * dt;
            let dy = dynamic.dy * dt;
            
            let time = 0;
            let tmp = {};
            let sweep;

            let hit = null;
            let iterations = MAX_SWEEP_RESOLUTION_ITERATIONS;
            do
            {
                // Do detection.
                sweep = sweepInto(tmp, dynamic, statics, dx, dy);
        
                // Do resolution.
                dynamic.x = sweep.x - (Math.sign(dx) * EPSILON$1);
                dynamic.y = sweep.y - (Math.sign(dy) * EPSILON$1);
                time += sweep.time;
                if (sweep.hit)
                {
                    dx += sweep.hit.nx * Math.abs(dx);
                    dy += sweep.hit.ny * Math.abs(dy);
                    hit = sweep.hit;

                    // Make sure that spent motion is consumed.
                    let remainingTime = Math.max(1 - time, 0);
                    dx *= remainingTime;
                    dy *= remainingTime;
        
                    if (Math.abs(dx) < EPSILON$1) dx = 0;
                    if (Math.abs(dy) < EPSILON$1) dy = 0;
                }
            }
            while(time < 1 && --iterations >= 0);
            
            dynamic.dx = dx;
            dynamic.dy = dy;
            dynamic.hit = hit;
        }
    }

    var IntersectionResolver = /*#__PURE__*/Object.freeze({
        __proto__: null,
        computeIntersections: computeIntersections,
        resolveIntersections: resolveIntersections
    });

    function createIntersectionWorld()
    {
        return {
            dynamics: [],
            masks: [],
            statics: [],
            update(dt)
            {
                resolveIntersections(this.dynamics, this.statics, dt);
                computeIntersections(this.masks, this.statics);
            },
            render(ctx)
            {
                ctx.save();
                {
                    // Draw static colliders.
                    ctx.strokeStyle = 'green';
                    for(let collider of this.statics)
                    {
                        ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
                    }

                    // Draw dynamic colliders.
                    ctx.strokeStyle = 'lime';
                    for(let collider of this.dynamics)
                    {
                        ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
                    }

                    // Draw mask colliders.
                    ctx.strokeStyle = 'blue';
                    for(let collider of this.masks)
                    {
                        switch(collider.type)
                        {
                            case 'point':
                                ctx.save();
                                {
                                    ctx.fillStyle = 'red';
                                    ctx.fillRect(collider.x - 1, collider.y - 1, 2, 2);
                                }
                                ctx.restore();
                                break;
                            case 'segment':
                                ctx.beginPath();
                                ctx.moveTo(collider.x, collider.y);
                                ctx.lineTo(collider.x + collider.dx, collider.y + collider.dy);
                                ctx.stroke();
                                break;
                            case 'aabb':
                                ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
                                break;
                        }
                    }
                }
                ctx.restore();
            }
        };
    }

    var IntersectionWorld = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createIntersectionWorld: createIntersectionWorld
    });

    // https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

    function createBounds(x, y, rx, ry)
    {
        return { x, y, rx, ry };
    }

    const MAX_OBJECTS = 10;
    const MAX_LEVELS = 5;

    class QuadTree
    {
        constructor(level = 0, bounds = createBounds(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
        {
            this.level = level;
            this.bounds = bounds;

            this.objects = [];
            this.nodes = new Array(4);
        }

        clear()
        {
            this.objects.length = 0;

            for(let i = 0; i < this.nodes.length; ++i)
            {
                let node = this.nodes[i];
                if (node)
                {
                    node.clear();
                    this.nodes[i] = null;
                }
            }
        }

        split()
        {
            let { x, y, rx, ry } = this.bounds;
            let nextLevel = this.level + 1;

            let ChildConstructor = this.constructor;

            this.nodes[0] = new ChildConstructor(nextLevel, createBounds(x + rx, y, rx, ry));
            this.nodes[1] = new ChildConstructor(nextLevel, createBounds(x, y, rx, ry));
            this.nodes[2] = new ChildConstructor(nextLevel, createBounds(x, y + ry, rx, ry));
            this.nodes[3] = new ChildConstructor(nextLevel, createBounds(x + rx, y + ry, rx, ry));
        }

        findQuadIndex(object)
        {
            let { x, y, rx, ry } = this.bounds;

            let index = -1;
            let midpointX = x + rx;
            let midpointY = y + ry;

            let isTop = object.y < midpointY && object.y + object.ry * 2 < midpointY;
            let isBottom = object.y > midpointY;

            let isLeft = object.x < midpointX && object.x + object.rx * 2 < midpointX;
            let isRight= object.x > midpointX;

            if (isLeft)
            {
                if (isTop)
                {
                    index = 1;
                }
                else if (isBottom)
                {
                    index = 2;
                }
            }
            else if (isRight)
            {
                if (isTop)
                {
                    index = 0;
                }
                else if (isBottom)
                {
                    index = 3;
                }
            }

            return index;
        }

        insertAll(objects)
        {
            for(let object of objects)
            {
                this.insert(object);
            }
        }

        insert(object)
        {
            let hasNode = this.nodes[0];

            if (hasNode)
            {
                let quadIndex = this.findQuadIndex(object);
                if (quadIndex >= 0)
                {
                    this.nodes[quadIndex].insert(object);
                    return;
                }
            }

            this.objects.push(object);

            if (this.objects.length > MAX_OBJECTS && this.level < MAX_LEVELS)
            {
                if (!hasNode) this.split();

                for(let i = this.objects.length - 1; i >= 0; --i)
                {
                    let obj = this.objects[i];
                    let quadIndex = this.findQuadIndex(obj);
                    if (quadIndex >= 0)
                    {
                        this.objects.splice(i, 1);
                        this.nodes[quadIndex].insert(obj);
                    }
                }
            }
        }

        retreive(out, object)
        {
            if (this.nodes[0])
            {
                let quadIndex = this.findQuadIndex(object);
                if (quadIndex >= 0)
                {
                    this.nodes[quadIndex].retreive(out, object);
                }
            }

            out.push(...this.objects);
            return out;
        }
    }

    var QuadTree$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createBounds: createBounds,
        QuadTree: QuadTree
    });

    const AUDIO_CONTEXT = new AudioContext();
    autoUnlock(AUDIO_CONTEXT);

    const AUDIO_ASSET_TAG = 'audio';
    async function loadAudio(filepath, opts = {})
    {
        const ctx = AUDIO_CONTEXT;

        let result = await fetch(filepath);
        let buffer = await result.arrayBuffer();
        let data = await ctx.decodeAudioData(buffer);
        return new Sound(ctx, data, Boolean(opts.loop));
    }

    const DEFAULT_SOURCE_PARAMS = {
        gain: 0,
        pitch: 0,
        pan: 0,
        loop: false,
    };
    class Sound
    {
        constructor(ctx, audioBuffer, loop = false)
        {
            this.context = ctx;
            this.buffer = audioBuffer;

            this._source = null;

            this.playing = false;
            this.loop = loop;

            this.onAudioSourceEnded = this.onAudioSourceEnded.bind(this);
        }

        onAudioSourceEnded()
        {
            this._playing = false;
        }

        play(opts = DEFAULT_SOURCE_PARAMS)
        {
            if (!this.buffer) return;
            if (this._source) this.destroy();

            const ctx = this.context;
            let source = ctx.createBufferSource();
            source.addEventListener('ended', this.onAudioSourceEnded);
            source.buffer = this.buffer;
            source.loop = opts.loop;

            let prevNode = source;

            // https://www.oreilly.com/library/view/web-audio-api/9781449332679/ch04.html
            // Add pitch
            if (opts.pitch)
            {
                source.detune.value = opts.pitch * 100;
            }

            // Add gain
            if (opts.gain)
            {
                const gainNode = ctx.createGain();
                gainNode.gain.value = opts.gain;
                prevNode = prevNode.connect(gainNode);
            }

            // Add stereo pan
            if (opts.pan)
            {
                const pannerNode = ctx.createStereoPanner();
                pannerNode.pan.value = opts.pan;
                prevNode = prevNode.connect(pannerNode);
            }

            prevNode.connect(ctx.destination);
            source.start();

            this._source = source;
            this._playing = true;
        }

        pause()
        {
            this._source.stop();
            this._playing = false;
        }

        destroy()
        {
            if (this._source) this._source.disconnect();
            this._source = null;
        }
    }

    async function autoUnlock(ctx)
    {
        const callback = () => {
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
        };
        document.addEventListener('click', callback);
    }

    var Audio = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AUDIO_CONTEXT: AUDIO_CONTEXT,
        AUDIO_ASSET_TAG: AUDIO_ASSET_TAG,
        loadAudio: loadAudio
    });

    const MAX_FIXED_UPDATES = 250;

    /**
     * @typedef Application
     * @property {Function} [start]
     * @property {Function} [stop]
     * @property {Function} [preUpdate]
     * @property {Function} [update]
     * @property {Function} [fixedUpdate]
     * @property {Function} [postUpdate]
     * @property {Function} [pause]
     * @property {Function} [resume]
     */

    class ApplicationLoop
    {
        static currentTime() { return performance.now(); }

        static start(app)
        {
            let result = new ApplicationLoop(app, false);
            result.start();
            return result;
        }

        /**
         * @param {Application} app The application object that holds all the executable logic.
         * @param {Boolean} [controlled = false] Whether the loop should NOT execute and manage itself.
         */
        constructor(app, controlled = false)
        {
            this.app = app;

            this._controlled = controlled;
            this._animationFrameHandle = null;

            this.prevFrameTime = 0;
            this.started = false;
            this.paused = false;
            this.fixedTimeStep = 1 / 60;
            this.prevAccumulatedTime = 0;

            this._onstart = null;
            this._onstop = null;
            this._onpreupdate = null;
            this._onupdate = null;
            this._onfixedupdate = null;
            this._onpostupdate = null;
            this._onpause = null;
            this._onresume = null;

            this.onAnimationFrame = this.onAnimationFrame.bind(this);
            this.onWindowFocus = this.onWindowFocus.bind(this);
            this.onWindowBlur = this.onWindowBlur.bind(this);
        }

        setFixedUpdatesPerSecond(count)
        {
            this.fixedTimeStep = 1 / count;
            return this;
        }

        onWindowFocus()
        {
            if (!this.started) return;
            this.resume();
        }

        onWindowBlur()
        {
            if (!this.started) return;
            this.pause();
        }

        /**
         * Runs the game loop. If this is a controlled game loop, it will call itself
         * continuously until stop() or pause().
         */
        onAnimationFrame(now)
        {
            if (this._controlled) throw new Error('Cannot run controlled game loop; call step() instead.');
            if (!this.started) throw new Error('Must be called after start().');

            this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
            this.step(now);
        }

        /** Runs one update step for the game loop. This is usually called 60 times a second. */
        step(now = ApplicationLoop.currentTime())
        {
            if (!this.started) return false;

            const deltaTime = now - this.prevFrameTime;
            this.prevFrameTime = now;
            
            if (this.paused) return false;

            if (this.app.preUpdate) this.app.preUpdate(deltaTime);
            if (this.app.update) this.app.update(deltaTime);

            this.prevAccumulatedTime += deltaTime / 1000;
            if (this.prevAccumulatedTime > MAX_FIXED_UPDATES * this.fixedTimeStep)
            {
                let max = MAX_FIXED_UPDATES * this.fixedTimeStep;
                let count = Math.floor((this.prevAccumulatedTime - max) / this.fixedTimeStep);
                this.prevAccumulatedTime = max;
                console.error(`[ApplicationLoop] Too many updates! Skipped ${count} fixed updates.`);
            }

            while(this.prevAccumulatedTime >= this.fixedTimeStep)
            {
                this.prevAccumulatedTime -= this.fixedTimeStep;
                if (this.app.fixedUpdate) this.app.fixedUpdate();
            }

            if (this.app.postUpdate) this.app.postUpdate(deltaTime);
        }

        /** Starts the game loop. Calls run(), unless recursive is set to false. */
        start()
        {
            if (this.started) throw new Error('Loop already started.');

            // If the window is out of focus, just ignore the time.
            window.addEventListener('focus', this.onWindowFocus);
            window.addEventListener('blur', this.onWindowBlur);

            this.started = true;
            this.prevFrameTime = ApplicationLoop.currentTime();

            if (this.app.start) this.app.start();
            
            if (!this.controlled)
            {
                this.onAnimationFrame(this.prevFrameTime);
            }

            return this;
        }

        /** Stops the game loop. */
        stop()
        {
            if (!this.started) throw new Error('Loop not yet started.');
            
            // If the window is out of focus, just ignore the time.
            window.removeEventListener('focus', this.onWindowFocus);
            window.removeEventListener('blur', this.onWindowBlur);

            this.started = false;

            if (this.app.stop) this.app.stop();

            if (!this._controlled)
            {
                if (this.animationFrameHandle)
                {
                    cancelAnimationFrame(this.animationFrameHandle);
                    this.animationFrameHandle = null;
                }
            }

            return this;
        }

        /** Pauses the game loop. */
        pause()
        {
            if (this.paused) return this;

            this.paused = true;
            
            if (this.app.pause) this.app.pause();
            return this;
        }

        /** Resumes the game loop. */
        resume()
        {
            if (!this.pause) return this;

            // This is an intentional frame skip (due to pause).
            this.prevFrameTime = ApplicationLoop.currentTime();

            this.paused = false;

            if (this.app.resume) this.app.resume();
            return this;
        }
    }

    class Game
    {
        constructor(context)
        {
            this.context = context;

            this.display = null;
            this.renderContext = null;
        }

        setDisplay(display)
        {
            this.display = display;
            this.renderContext = display.canvas.getContext('2d');
            return this;
        }

        /** @override */
        start()
        {
            this.context.start();
        }

        /** @override */
        update(dt)
        {
            this.context.update(dt);
            this.context.render(this.renderContext);
        }
    }

    const GAME_PROPERTY = Symbol('game');
    const LOOP_PROPERTY = Symbol('loop');

    function start(context)
    {
        let gameContext = { ...context };

        let game = new Game(gameContext);
        let loop = new ApplicationLoop(game);

        gameContext[GAME_PROPERTY] = game;
        gameContext[LOOP_PROPERTY] = loop;
        gameContext.display = null;

        window.addEventListener('DOMContentLoaded', () => {
            let display = document.querySelector('display-port');
            if (!display) throw new Error('Cannot find display-port in document.');
            game.setDisplay(display);
            gameContext.display = display;
            gameContext.load().then(() => loop.start());
        });

        return gameContext;
    }

    function stop(gameContext)
    {
        gameContext[LOOP_PROPERTY].stop();

        delete gameContext[GAME_PROPERTY];
        delete gameContext[LOOP_PROPERTY];
    }

    var Game$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        start: start,
        stop: stop
    });

    const DEFAULT_INFO = {
        x: 0, y: 0,
        width: 1,
        height: 1,
        color: 'dodgerblue',
        solid: true,
    };
    const INFO_KEY = Symbol('BoxRendererInfo');

    class BoxRenderer
    {
        static get Info() { return INFO_KEY; }

        static draw(ctx, targets, defaultInfo = undefined)
        {
            const defaults = defaultInfo ? { ...DEFAULT_INFO, ...defaultInfo } : DEFAULT_INFO;
            for(let target of targets)
            {
                const info = target[INFO_KEY];
                
                const x = resolveInfo('x', info, target, defaults);
                const y = resolveInfo('y', info, target, defaults);
                const width = resolveInfo('width', info, target, defaults);
                const height = resolveInfo('height', info, target, defaults);
                const color = resolveInfo('color', info, target, defaults);
                const solid = resolveInfo('solid', info, target, defaults);

                ctx.translate(x, y);
                {
                    const halfWidth = width / 2;
                    const halfHeight = height / 2;

                    if (solid)
                    {
                        ctx.fillStyle = color;
                        ctx.fillRect(-halfWidth, -halfHeight, width, height);
                    }
                    else
                    {
                        ctx.strokeStyle = color;
                        ctx.strokeRect(-halfWidth, -halfHeight, width, height);
                    }
                }
                ctx.translate(-x, -y);
            }
        }
    }

    function resolveInfo(param, info, target, defaults)
    {
        if (info)
        {
            if (param in info)
            {
                return info[param];
            }
            else if (param in target)
            {
                return target[param];
            }
            else
            {
                return defaults[param];
            }
        }
        else if (target)
        {
            if (param in target)
            {
                return target[param];
            }
            else
            {
                return defaults[param];
            }
        }
        else
        {
            return defaults[param];
        }
    }

    const DEFAULT_INFO$1 = {
        x: 0, y: 0,
        width: 1,
        height: 1,
        spriteImage: null,
    };
    const INFO_KEY$1 = Symbol('SpriteRendererInfo');

    class SpriteRenderer
    {
        static get Info() { return INFO_KEY$1; }

        static draw(ctx, targets, defaultInfo = undefined)
        {
            const defaults = defaultInfo ? { ...DEFAULT_INFO$1, ...defaultInfo } : DEFAULT_INFO$1;
            for(let target of targets)
            {
                const info = target[INFO_KEY$1];
                const x = resolveInfo$1('x', info, target, defaults);
                const y = resolveInfo$1('y', info, target, defaults);

                const spriteImage = resolveInfo$1('spriteImage', info, target, defaults);
                if (spriteImage)
                {
                    const width = spriteImage.width;
                    const height = spriteImage.height;

                    ctx.translate(x, y);
                    {
                        const halfWidth = width / 2;
                        const halfHeight = height / 2;
        
                        ctx.drawImage(spriteImage, -halfWidth, -halfHeight);
                    }
                    ctx.translate(-x, -y);
                }
                else
                {
                    const width = 10;
                    const height = 10;

                    ctx.translate(x, y);
                    {
                        const halfWidth = width / 2;
                        const halfHeight = height / 2;

                        ctx.strokeStyle = 'black';
                        ctx.strokeRect(-halfWidth, -halfHeight, width, height);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.strokeText('?', 0, 0, width);
                    }
                    ctx.translate(-x, -y);
                }
            }
        }
    }

    function resolveInfo$1(param, info, target, defaults)
    {
        if (info)
        {
            if (param in info)
            {
                return info[param];
            }
            else if (param in target)
            {
                return target[param];
            }
            else
            {
                return defaults[param];
            }
        }
        else if (target)
        {
            if (param in target)
            {
                return target[param];
            }
            else
            {
                return defaults[param];
            }
        }
        else
        {
            return defaults[param];
        }
    }

    // Bresenham's Line Algorithm
    function line(fromX, fromY, toX, toY, callback)
    {
        let fx = Math.floor(fromX);
        let fy = Math.floor(fromY);
        let tx = Math.floor(toX);
        let ty = Math.floor(toY);

        let dx = Math.abs(toX - fromX);
        let sx = fromX < toX ? 1 : -1;
        let dy = -Math.abs(toY - fromY);
        let sy = fromY < toY ? 1 : -1;
        let er = dx + dy;

        let x = fx;
        let y = fy;
        let flag = callback(x, y);
        if (typeof flag !== 'undefined') return flag;
        
        let maxLength = dx * dx + dy * dy;
        let length = 0;
        while(length < maxLength && (x !== tx || y !== ty))
        {
            // Make sure it doesn't go overboard.
            ++length;

            let er2 = er * 2;

            if (er2 >= dy)
            {
                er += dy;
                x += sx;
            }

            if (er2 <= dx)
            {
                er += dx;
                y += sy;
            }

            flag = callback(x, y);
            if (typeof flag !== 'undefined') return flag;
        }
    }

    var Discrete = /*#__PURE__*/Object.freeze({
        __proto__: null,
        line: line
    });

    const FILE_TYPE_PNG = 'png';
    const FILE_TYPE_SVG = 'svg';

    function downloadText(filename, textData)
    {
        downloadURL(filename, getTextDataURI(textData));
    }

    function downloadImageFromSVG(filename, filetype, svg, width, height)
    {
        const blob = createBlobFromSVG(svg);
        switch (filetype)
        {
            case FILE_TYPE_PNG:
                {
                    const url = URL.createObjectURL(blob);

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const pixelRatio = window.devicePixelRatio || 1;
                    canvas.width = width * pixelRatio;
                    canvas.height = height * pixelRatio;
                    canvas.style.width = width + 'px';
                    canvas.style.height = height + 'px';
                    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

                    const image = new Image();
                    image.onload = () => 
                    {
                        ctx.drawImage(image, 0, 0);
                        URL.revokeObjectURL(url);

                        const imageURI = canvas.toDataURL('image/' + filetype).replace('image/' + filetype, 'image/octet-stream');
                        downloadURL(filename, imageURI);
                    };
                    image.src = url;
                }
                break;
            case FILE_TYPE_SVG:
                {
                    const reader = new FileReader();
                    reader.onload = () => 
                    {
                        downloadURL(filename, reader.result);
                    };
                    reader.readAsDataURL(blob);
                }
                break;
            default:
                throw new Error('Unknown file type \'' + filetype + '\'');
        }
    }

    function downloadURL(filename, url)
    {
        const element = document.createElement('a');
        const headerIndex = url.indexOf(';');
        url = url.substring(0, headerIndex + 1) + 'headers=Content-Disposition%3A%20attachment%3B%20filename=' + filename + ';' + url.substring(headerIndex + 1);
        element.setAttribute('href', url);
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);
    }

    function createBlobFromSVG(svg)
    {
        const styledSVG = computeSVGStyles(svg);
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(styledSVG);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        return blob;
    }

    // SOURCE: https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser/44769098#44769098
    const SVG_CONTAINERS = ['svg', 'g'];
    function computeSVGStyles(svg, dst = svg.cloneNode(true))
    {
        let sourceChildren = svg.childNodes;
        let children = dst.childNodes;

        for (var index = 0; index < children.length; index++)
        {
            let child = children[index];
            let tagName = child.tagName;
            if (SVG_CONTAINERS.indexOf(tagName) != -1)
            {
                computeSVGStyles(sourceChildren[index], child);
            }
            else if (sourceChildren[index] instanceof Element)
            {
                const computedStyle = window.getComputedStyle(sourceChildren[index]);

                let styleAttributes = [];
                for(let styleName of Object.keys(computedStyle))
                {
                    styleAttributes.push(`${styleName}:${computedStyle.getPropertyValue(styleName)};`);
                }

                child.setAttribute('style', styleAttributes.join(''));
            }
        }

        return dst;
    }

    function getTextDataURI(data)
    {
        return 'data:text/plain; charset=utf-8,' + encodeURIComponent(data);
    }

    var Downloader = /*#__PURE__*/Object.freeze({
        __proto__: null,
        FILE_TYPE_PNG: FILE_TYPE_PNG,
        FILE_TYPE_SVG: FILE_TYPE_SVG,
        downloadText: downloadText,
        downloadImageFromSVG: downloadImageFromSVG,
        downloadURL: downloadURL
    });

    async function uploadFile(accept = [], multiple = false)
    {
        return new Promise((resolve, reject) => {
            const element = document.createElement('input');
            element.addEventListener('change', (e) => {
                if (multiple)
                {
                    resolve(e.target.files);
                }
                else
                {
                    resolve(e.target.files[0]);
                }
            });
            element.type = 'file';
            element.accept = accept.join(',');
            element.style.display = 'none';
            element.toggleAttribute('multiple', multiple);
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        });
    }

    var Uploader = /*#__PURE__*/Object.freeze({
        __proto__: null,
        uploadFile: uploadFile
    });

    /* eslint-disable no-console */

    // Log levels
    const TRACE = 5;
    const DEBUG = 4;
    const INFO = 3;
    const WARN = 2;
    const ERROR = 1;
    const OFF = 0;

    const LOG_LEVEL_STYLES = {
        [TRACE]: styledLogLevel('#7F8C8D'), // Gray
        [DEBUG]: styledLogLevel('#2ECC71'), // Green
        [INFO]: styledLogLevel('#4794C8'), // Blue
        [WARN]: styledLogLevel('#F39C12'), // Yellow
        [ERROR]: styledLogLevel('#C0392B'), // Red
        [OFF]: [''],
    };

    function compareLogLevel(a, b)
    {
        return a - b;
    }

    function styledLogLevel(color)
    {
        return [
            `background: ${color}`,
            'border-radius: 0.5em',
            'color: white',
            'font-weight: bold',
            'padding: 2px 0.5em',
        ];
    }

    // Useful functions
    function noop() { /** Do nothing. */ }

    function getStyledMessage(message, styles)
    {
        return [
            `%c${message}`,
            styles.join(';'),
        ];
    }

    function getConsoleFunction(level)
    {
        switch(level)
        {
            case TRACE:
                return console.trace;
            case DEBUG:
                return console.log;
            case INFO:
                return console.log;
            case WARN:
                return console.warn;
            case ERROR:
                return console.error;
            case OFF:
                return noop;
            default:
                return console.log;
        }
    }

    function prependMessageTags(out, name, domain, level)
    {
        if (name)
        {
            out.unshift(`[${name}]`);
        }

        if (domain)
        {
            let tag = getStyledMessage(domain, LOG_LEVEL_STYLES[level]);
            out.unshift(tag[0], tag[1]);
        }

        return out;
    }

    const LEVEL = Symbol('level');
    const DOMAIN = Symbol('domain');
    const LOGGERS = { /** To be populated by logger instances. */ };
    let DEFAULT_LEVEL = WARN;
    let DEFAULT_DOMAIN = 'app';
    class Logger
    {
        static get TRACE() { return TRACE; }
        static get DEBUG() { return DEBUG; }
        static get INFO() { return INFO; }
        static get WARN() { return WARN; }
        static get ERROR() { return ERROR; }
        static get OFF() { return OFF; }

        /**
         * Creates or gets the logger for the given unique name.
         * @param {String} name 
         * @returns {Logger} The logger with the name.
         */
        static getLogger(name)
        {
            if (name in LOGGERS)
            {
                return LOGGERS[name];
            }
            else
            {
                return LOGGERS[name] = new Logger(name);
            }
        }

        static useDefaultLevel(level)
        {
            DEFAULT_LEVEL = level;
            return this;
        }

        static useDefaultDomain(domain)
        {
            DEFAULT_DOMAIN = domain;
            return this;
        }

        constructor(name)
        {
            this.name = name;
            this[LEVEL] = DEFAULT_LEVEL;
            this[DOMAIN] = DEFAULT_DOMAIN;
        }

        setLevel(level)
        {
            this[LEVEL] = level;
            return this;
        }
        
        getLevel()
        {
            return this[LEVEL];
        }

        setDomain(domain)
        {
            this[DOMAIN] = domain;
            return this;
        }

        getDomain()
        {
            return this[DOMAIN];
        }

        log(level, ...messages)
        {
            if (compareLogLevel(this[LEVEL], level) < 0) return this;
            prependMessageTags(messages, this.name, this[DOMAIN], level);
            getConsoleFunction(level)(...messages);
        }

        trace(...messages)
        {
            if (compareLogLevel(this[LEVEL], TRACE) < 0) return this;
            prependMessageTags(messages, this.name, this[DOMAIN], TRACE);
            getConsoleFunction(TRACE)(...messages);
        }

        debug(...messages)
        {
            if (compareLogLevel(this[LEVEL], DEBUG) < 0) return this;
            prependMessageTags(messages, this.name, this[DOMAIN], DEBUG);
            getConsoleFunction(DEBUG)(...messages);
        }

        info(...messages)
        {
            if (compareLogLevel(this[LEVEL], INFO) < 0) return this;
            prependMessageTags(messages, this.name, this[DOMAIN], INFO);
            getConsoleFunction(INFO)(...messages);
        }

        warn(...messages)
        {
            if (compareLogLevel(this[LEVEL], WARN) < 0) return this;
            prependMessageTags(messages, this.name, this[DOMAIN], WARN);
            getConsoleFunction(WARN)(...messages);
        }

        error(...messages)
        {
            if (compareLogLevel(this[LEVEL], ERROR) < 0) return this;
            prependMessageTags(messages, this.name, this[DOMAIN], ERROR);
            getConsoleFunction(ERROR)(...messages);
        }
    }

    var Logger$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Logger: Logger
    });

    /**
     * @typedef Eventable
     * @property {function} on
     * @property {function} off
     * @property {function} once
     * @property {function} emit
     */

    /**
     * @version 1.3.0
     * @description
     * # Changelog
     * ## 1.3.0
     * - Return results for emit()
     * ## 1.2.0
     * - Added named exports
     * - Added custom this context
     * - Added some needed explanations for the functions
     * ## 1.1.0
     * - Started versioning
     */
    const EventableInstance = {
        /**
         * Registers an event handler to continually listen for the event.
         * 
         * @param {string} event The name of the event to listen for.
         * @param {function} callback The callback function to handle the event.
         * @param {*} [handle = callback] The handle to refer to this registered callback.
         * Used by off() to remove handlers. If none specified, it will use the callback
         * itself as the handle. This must be unique.
         * @return {Eventable} Self for method-chaining.
         */
        on(event, callback, handle = callback)
        {
            let callbacks;
            if (!this.__events.has(event))
            {
                callbacks = new Map();
                this.__events.set(event, callbacks);
            }
            else
            {
                callbacks = this.__events.get(event);
            }

            if (!callbacks.has(handle))
            {
                callbacks.set(handle, callback);
            }
            else
            {
                throw new Error(`Found callback for event '${event}' with the same handle '${handle}'.`);
            }
            return this;
        },

        /**
         * Unregisters an event handler to stop listening for the event.
         * 
         * @param {string} event The name of the event listened for.
         * @param {*} handle The registered handle to refer to the registered
         * callback. If no handle was provided when calling on(), the callback
         * is used as the handle instead.
         * @return {Eventable} Self for method-chaining.
         */
        off(event, handle)
        {
            if (this.__events.has(event))
            {
                const callbacks = this.__events.get(event);
                if (callbacks.has(handle))
                {
                    callbacks.delete(handle);
                }
                else
                {
                    throw new Error(`Unable to find callback for event '${event}' with handle '${handle}'.`);
                }
            }
            else
            {
                throw new Error(`Unable to find event '${event}'.`);
            }
            return this;
        },
        
        /**
         * Registers a one-off event handler to start listening for the next,
         * and only the next, event.
         * 
         * @param {string} event The name of the event to listen for.
         * @param {function} callback The callback function to handle the event.
         * @param {*} [handle = callback] The handle to refer to this registered callback.
         * Used by off() to remove handlers. If none specified, it will use the callback
         * itself as the handle. This must be unique.
         * @return {Eventable} Self for method-chaining.
         */
        once(event, callback, handle = callback)
        {
            const func = (...args) => {
                this.off(event, handle);
                callback.apply(this.__context || this, args);
            };
            return this.on(event, func, handle);
        },

        /**
         * Emits the event with the arguments passed on to the registered handlers.
         * The context of the handlers, if none were initially bound, could be
         * defined upon calling the Eventable's creation function. Otherwise, the
         * handler is called with `this` context of the Eventable instance.
         * 
         * @param {string} event The name of the event to emit.
         * @param  {...any} args Any arguments to pass to registered handlers.
         * @return {Array<any>} Array of any returned values of the callbacks.
         */
        emit(event, ...args)
        {
            if (this.__events.has(event))
            {
                let results = [];
                const callbacks = Array.from(this.__events.get(event).values());
                for(const callback of callbacks)
                {
                    let result = callback.apply(this.__context || this, args);
                    if (result) results.push(result);
                }
                return results;
            }
            else
            {
                this.__events.set(event, new Map());
                return [];
            }
        }
    };

    /**
     * Creates an eventable object.
     * 
     * @param {Object} [context] The context used for the event handlers.
     * @return {Eventable} The created eventable object.
     */
    function create$a(context = undefined)
    {
        const result = Object.create(EventableInstance);
        result.__events = new Map();
        result.__context = context;
        return result;
    }

    /**
     * Assigns the passed-in object with eventable properties.
     * 
     * @param {Object} dst The object to assign with eventable properties.
     * @param {Object} [context] The context used for the event handlers.
     * @return {Eventable} The resultant eventable object.
     */
    function assign(dst, context = undefined)
    {
        const result = Object.assign(dst, EventableInstance);
        result.__events = new Map();
        result.__context = context;
        return result;
    }

    /**
     * Mixins eventable properties into the passed-in class.
     * 
     * @param {Class} targetClass The class to mixin eventable properties.
     * @param {Object} [context] The context used for the event handlers.
     * @return {Class<Eventable>} The resultant eventable-mixed-in class.
     */
    function mixin(targetClass, context = undefined)
    {
        const targetPrototype = targetClass.prototype;
        Object.assign(targetPrototype, EventableInstance);
        targetPrototype.__events = new Map();
        targetPrototype.__context = context;
        return targetPrototype;
    }

    var Eventable = {
        create: create$a,
        assign,
        mixin
    };

    var Eventable$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$a,
        assign: assign,
        mixin: mixin,
        'default': Eventable
    });

    const TOP_INDEX = 0;

    // NOTE: Uses a binary heap to sort.
    class PriorityQueue
    {
        constructor(comparator)
        {
            this._heap = [];
            this._comparator = comparator;
        }

        get size() { return this._heap.length; }

        clear()
        {
            this._heap.length = 0;
        }

        push(...values)
        {
            for (const value of values)
            {
                this._heap.push(value);
                this._shiftUp();
            }
        }

        pop()
        {
            const result = this.peek();
            let bottom = bottomIndex(this);
            if (bottom > TOP_INDEX)
            {
                this._swap(TOP_INDEX, bottom);
            }
            this._heap.pop();
            this._shiftDown();
            return result;
        }

        /** Replaces the top value with the new value. */
        replace(value)
        {
            const result = this.peek();
            this._heap[TOP_INDEX] = value;
            this._shiftDown();
            return result;
        }

        peek()
        {
            return this._heap[TOP_INDEX];
        }

        /** @private */
        _compare(i, j)
        {
            return this._comparator(this._heap[i], this._heap[j]);
        }

        /** @private */
        _swap(i, j)
        {
            let result = this._heap[i];
            this._heap[i] = this._heap[j];
            this._heap[j] = result;
        }

        /** @private */
        _shiftUp()
        {
            let node = this._heap.length - 1;
            let nodeParent;
            while (node > TOP_INDEX && this._compare(node, nodeParent = parentIndex(node)))
            {
                this._swap(node, nodeParent);
                node = nodeParent;
            }
        }

        /** @private */
        _shiftDown()
        {
            const length = this._heap.length;
            let node = TOP_INDEX;
            let nodeMax;

            let nodeLeft = leftIndex(node);
            let flagLeft = nodeLeft < length;
            let nodeRight = rightIndex(node);
            let flagRight = nodeRight < length;

            while ((flagLeft && this._compare(nodeLeft, node))
                || (flagRight && this._compare(nodeRight, node)))
            {
                nodeMax = (flagRight && this._compare(nodeRight, nodeLeft)) ? nodeRight : nodeLeft;
                this._swap(node, nodeMax);
                node = nodeMax;

                nodeLeft = leftIndex(node);
                flagLeft = nodeLeft < length;
                nodeRight = rightIndex(node);
                flagRight = nodeRight < length;
            }
        }

        values()
        {
            return this._heap;
        }

        [Symbol.iterator]()
        {
            return this._heap[Symbol.iterator]();
        }
    }

    function bottomIndex(queue)
    {
        return queue._heap.length - 1;
    }

    function parentIndex(i)
    {
        return ((i + 1) >>> 1) - 1;
    }

    function leftIndex(i)
    {
        return (i << 1) + 1;
    }

    function rightIndex(i)
    {
        return (i + 1) << 1;
    }

    var PriorityQueue$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        PriorityQueue: PriorityQueue
    });

    /**
     * Generates a uuid v4.
     * 
     * @param {number} a The placeholder (serves for recursion within function).
     * @returns {string} The universally unique id.
     */
    function uuid(a = undefined)
    {
        // https://gist.github.com/jed/982883
        return a
            ? (a ^ Math.random() * 16 >> a / 4).toString(16)
            : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
    }

    function lerp$5(a, b, t)
    {
        return a + (b - a) * t;
    }

    function clamp$1(value, min, max)
    {
        return Math.min(max, Math.max(min, value));
    }

    function cycle(value, min, max)
    {
        let range = max - min;
        let result = (value - min) % range;
        if (result < 0) result += range;
        return result + min;
    }

    function withinRadius(fromX, fromY, toX, toY, radius)
    {
        const dx = fromX - toX;
        const dy = fromY - toY;
        return dx * dx + dy * dy <= radius * radius
    }

    function distance2(fromX, fromY, toX, toY)
    {
        let dx = toX - fromX;
        let dy = toY - fromY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function direction2(fromX, fromY, toX, toY)
    {
        let dx = toX - fromX;
        let dy = toY - fromY;
        return Math.atan2(dy, dx);
    }

    function lookAt2(radians, target, dt)
    {
        let step = cycle(target - radians, -Math.PI, Math.PI);
        return clamp$1(radians + step, radians - dt, radians + dt);
    }

    const TO_RAD_FACTOR = Math.PI / 180;
    const TO_DEG_FACTOR = 180 / Math.PI;
    function toRadians(degrees)
    {
        return degrees * TO_RAD_FACTOR;
    }

    function toDegrees(radians)
    {
        return radians * TO_DEG_FACTOR;
    }

    class CanvasView
    {
        constructor()
        {
            this.prevTransformMatrix = null;

            this.domProjectionMatrix = new DOMMatrix();
            this.domViewMatrix = new DOMMatrix();

            this.ctx = null;
        }

        begin(ctx, viewMatrix, projectionMatrix)
        {
            if (this.ctx)
            {
                throw new Error('View already begun - maybe missing end() call?');
            }

            if (viewMatrix) setDOMMatrix(this.domViewMatrix, viewMatrix);
            if (projectionMatrix) setDOMMatrix(this.domProjectionMatrix, projectionMatrix);

            this.prevTransformMatrix = ctx.getTransform();

            ctx.setTransform(this.domProjectionMatrix);
            const { a, b, c, d, e, f } = this.domViewMatrix;
            ctx.transform(a, b, c, d, e, f);

            this.ctx = ctx;
        }

        end(ctx)
        {
            ctx.setTransform(this.prevTransformMatrix);
            
            this.ctx = null;
        }
    }

    function setDOMMatrix(domMatrix, glMatrix)
    {
        domMatrix.a = glMatrix[0];
        domMatrix.b = glMatrix[1];
        domMatrix.c = glMatrix[4];
        domMatrix.d = glMatrix[5];
        domMatrix.e = glMatrix[12];
        domMatrix.f = glMatrix[13];
        return domMatrix;
    }

    class Camera
    {
        /** @abstract */
        getViewMatrix(out) {}
        
        /** @abstract */
        getProjectionMatrix(out) {}
    }

    class Camera2D extends Camera
    {
        static screenToWorld(screenX, screenY, viewMatrix, projectionMatrix)
        {
            let mat = multiply$3(create$3(), projectionMatrix, viewMatrix);
            invert$3(mat, mat);
            let result = fromValues$4(screenX, screenY, 0);
            transformMat4(result, result, mat);
            return result;
        }
        
        constructor(left = -1, right = 1, top = -1, bottom = 1, near = 0, far = 1)
        {
            super();

            this.position = create$4();
            this.rotation = create$6();
            this.scale = fromValues$4(1, 1, 1);

            this.clippingPlane = {
                left, right, top, bottom, near, far,
            };
            
            this._viewMatrix = create$3();
            this._projectionMatrix = create$3();
        }

        get x() { return this.position[0]; }
        set x(value) { this.position[0] = value; }
        get y() { return this.position[1]; }
        set y(value) { this.position[1] = value; }
        get z() { return this.position[2]; }
        set z(value) { this.position[2] = value; }

        /** Moves the camera. This is the only way to change the position. */
        moveTo(x, y, z = 0, dt = 1)
        {
            let nextPosition = fromValues$4(x, y, z);
            lerp(this.position, this.position, nextPosition, Math.min(1, dt));
        }

        /** @override */
        getViewMatrix(out = this._viewMatrix)
        {
            let viewX = -Math.round(this.x);
            let viewY = -Math.round(this.y);
            let viewZ = this.z === 0 ? 1 : 1 / this.z;
            let invPosition = fromValues$4(viewX, viewY, 0);
            let invScale = fromValues$4(this.scale[0] * viewZ, this.scale[1] * viewZ, 1);
            fromRotationTranslationScale(out, this.rotation, invPosition, invScale);
            return out;
        }

        /** @override */
        getProjectionMatrix(out = this._projectionMatrix)
        {
            let { left, right, top, bottom, near, far } = this.clippingPlane;
            ortho(out, left, right, top, bottom, near, far);
            return out;
        }
    }

    class Camera3D extends Camera
    {
        static screenToWorld(screenX, screenY, viewMatrix, projectionMatrix)
        {
            let mat = multiply$3(create$3(), projectionMatrix, viewMatrix);
            invert$3(mat, mat);
            let result = fromValues$4(screenX, screenY, 0);
            transformMat4(result, result, mat);
            return result;
        }
        
        constructor(fieldOfView, aspectRatio, near = 0.1, far = 1000)
        {
            super();

            this.position = create$4();
            this.rotation = create$6();

            this.fieldOfView = fieldOfView;

            this.aspectRatio = aspectRatio;
            this.clippingPlane = {
                near,
                far,
            };
            
            this._viewMatrix = create$3();
            this._projectionMatrix = create$3();
        }

        get x() { return this.position[0]; }
        set x(value) { this.position[0] = value; }
        get y() { return this.position[1]; }
        set y(value) { this.position[1] = value; }
        get z() { return this.position[2]; }
        set z(value) { this.position[2] = value; }

        /** Moves the camera. This is the only way to change the position. */
        moveTo(x, y, z, dt = 1)
        {
            let nextPosition = fromValues$4(x, y, z);
            lerp(this.position, this.position, nextPosition, Math.min(1, dt));
        }

        /** @override */
        getViewMatrix(out = this._viewMatrix)
        {
            let viewX = -this.x;
            let viewY = -this.y;
            let viewZ = -this.z;
            let invPosition = fromValues$4(viewX, viewY, viewZ);
            fromRotationTranslation(out, this.rotation, invPosition);
            return out;
        }

        /** @override */
        getProjectionMatrix(out = this._projectionMatrix)
        {
            let { near, far } = this.clippingPlane;
            perspective(out, this.fieldOfView, this.aspectRatio, near, far);
            return out;
        }
    }

    /**
     * Take input from [0, n] and return it as [0, 1]
     * @hidden
     */
    function bound01(n, max) {
        if (isOnePointZero(n)) {
            n = '100%';
        }
        var isPercent = isPercentage(n);
        n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
        // Automatically convert percentage into number
        if (isPercent) {
            n = parseInt(String(n * max), 10) / 100;
        }
        // Handle floating point rounding errors
        if (Math.abs(n - max) < 0.000001) {
            return 1;
        }
        // Convert into [0, 1] range if it isn't already
        if (max === 360) {
            // If n is a hue given in degrees,
            // wrap around out-of-range values into [0, 360] range
            // then convert into [0, 1].
            n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
        }
        else {
            // If n not a hue given in degrees
            // Convert into [0, 1] range if it isn't already.
            n = (n % max) / parseFloat(String(max));
        }
        return n;
    }
    /**
     * Force a number between 0 and 1
     * @hidden
     */
    function clamp01(val) {
        return Math.min(1, Math.max(0, val));
    }
    /**
     * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
     * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
     * @hidden
     */
    function isOnePointZero(n) {
        return typeof n === 'string' && n.includes('.') && parseFloat(n) === 1;
    }
    /**
     * Check to see if string passed in is a percentage
     * @hidden
     */
    function isPercentage(n) {
        return typeof n === 'string' && n.includes('%');
    }
    /**
     * Return a valid alpha value [0,1] with all invalid values being set to 1
     * @hidden
     */
    function boundAlpha(a) {
        a = parseFloat(a);
        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }
        return a;
    }
    /**
     * Replace a decimal with it's percentage value
     * @hidden
     */
    function convertToPercentage(n) {
        if (n <= 1) {
            return Number(n) * 100 + "%";
        }
        return n;
    }
    /**
     * Force a hex value to have 2 characters
     * @hidden
     */
    function pad2(c) {
        return c.length === 1 ? '0' + c : String(c);
    }

    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
    /**
     * Handle bounds / percentage checking to conform to CSS color spec
     * <http://www.w3.org/TR/css3-color/>
     * *Assumes:* r, g, b in [0, 255] or [0, 1]
     * *Returns:* { r, g, b } in [0, 255]
     */
    function rgbToRgb(r, g, b) {
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255,
        };
    }
    /**
     * Converts an RGB color value to HSL.
     * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
     * *Returns:* { h, s, l } in [0,1]
     */
    function rgbToHsl(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h = 0;
        var s = 0;
        var l = (max + min) / 2;
        if (max === min) {
            s = 0;
            h = 0; // achromatic
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = ((g - b) / d) + (g < b ? 6 : 0);
                    break;
                case g:
                    h = ((b - r) / d) + 2;
                    break;
                case b:
                    h = ((r - g) / d) + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h, s: s, l: l };
    }
    function hue2rgb(p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + ((q - p) * (6 * t));
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + ((q - p) * ((2 / 3) - t) * 6);
        }
        return p;
    }
    /**
     * Converts an HSL color value to RGB.
     *
     * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
     * *Returns:* { r, g, b } in the set [0, 255]
     */
    function hslToRgb(h, s, l) {
        var r;
        var g;
        var b;
        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);
        if (s === 0) {
            // achromatic
            g = l;
            b = l;
            r = l;
        }
        else {
            var q = l < 0.5 ? (l * (1 + s)) : (l + s - (l * s));
            var p = (2 * l) - q;
            r = hue2rgb(p, q, h + (1 / 3));
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - (1 / 3));
        }
        return { r: r * 255, g: g * 255, b: b * 255 };
    }
    /**
     * Converts an RGB color value to HSV
     *
     * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
     * *Returns:* { h, s, v } in [0,1]
     */
    function rgbToHsv(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h = 0;
        var v = max;
        var d = max - min;
        var s = max === 0 ? 0 : d / max;
        if (max === min) {
            h = 0; // achromatic
        }
        else {
            switch (max) {
                case r:
                    h = ((g - b) / d) + (g < b ? 6 : 0);
                    break;
                case g:
                    h = ((b - r) / d) + 2;
                    break;
                case b:
                    h = ((r - g) / d) + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    }
    /**
     * Converts an HSV color value to RGB.
     *
     * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
     * *Returns:* { r, g, b } in the set [0, 255]
     */
    function hsvToRgb(h, s, v) {
        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);
        var i = Math.floor(h);
        var f = h - i;
        var p = v * (1 - s);
        var q = v * (1 - (f * s));
        var t = v * (1 - ((1 - f) * s));
        var mod = i % 6;
        var r = [v, q, p, p, t, v][mod];
        var g = [t, v, v, q, p, p][mod];
        var b = [p, p, t, v, v, q][mod];
        return { r: r * 255, g: g * 255, b: b * 255 };
    }
    /**
     * Converts an RGB color to hex
     *
     * Assumes r, g, and b are contained in the set [0, 255]
     * Returns a 3 or 6 character hex
     */
    function rgbToHex(r, g, b, allow3Char) {
        var hex = [
            pad2(Math.round(r).toString(16)),
            pad2(Math.round(g).toString(16)),
            pad2(Math.round(b).toString(16)),
        ];
        // Return a 3 character hex if possible
        if (allow3Char &&
            hex[0].startsWith(hex[0].charAt(1)) &&
            hex[1].startsWith(hex[1].charAt(1)) &&
            hex[2].startsWith(hex[2].charAt(1))) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }
        return hex.join('');
    }
    /**
     * Converts an RGBA color plus alpha transparency to hex
     *
     * Assumes r, g, b are contained in the set [0, 255] and
     * a in [0, 1]. Returns a 4 or 8 character rgba hex
     */
    // eslint-disable-next-line max-params
    function rgbaToHex(r, g, b, a, allow4Char) {
        var hex = [
            pad2(Math.round(r).toString(16)),
            pad2(Math.round(g).toString(16)),
            pad2(Math.round(b).toString(16)),
            pad2(convertDecimalToHex(a)),
        ];
        // Return a 4 character hex if possible
        if (allow4Char &&
            hex[0].startsWith(hex[0].charAt(1)) &&
            hex[1].startsWith(hex[1].charAt(1)) &&
            hex[2].startsWith(hex[2].charAt(1)) &&
            hex[3].startsWith(hex[3].charAt(1))) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
        }
        return hex.join('');
    }
    /**
     * Converts an RGBA color to an ARGB Hex8 string
     * Rarely used, but required for "toFilter()"
     */
    function rgbaToArgbHex(r, g, b, a) {
        var hex = [
            pad2(convertDecimalToHex(a)),
            pad2(Math.round(r).toString(16)),
            pad2(Math.round(g).toString(16)),
            pad2(Math.round(b).toString(16)),
        ];
        return hex.join('');
    }
    /** Converts a decimal to a hex value */
    function convertDecimalToHex(d) {
        return Math.round(parseFloat(d) * 255).toString(16);
    }
    /** Converts a hex value to a decimal */
    function convertHexToDecimal(h) {
        return parseIntFromHex(h) / 255;
    }
    /** Parse a base-16 hex value into a base-10 integer */
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }
    function numberInputToObject(color) {
        return {
            r: color >> 16,
            g: (color & 0xff00) >> 8,
            b: color & 0xff,
        };
    }

    // https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
    /**
     * @hidden
     */
    var names = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        goldenrod: '#daa520',
        gold: '#ffd700',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavenderblush: '#fff0f5',
        lavender: '#e6e6fa',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32',
    };

    /**
     * Given a string or object, convert that input to RGB
     *
     * Possible string inputs:
     * ```
     * "red"
     * "#f00" or "f00"
     * "#ff0000" or "ff0000"
     * "#ff000000" or "ff000000"
     * "rgb 255 0 0" or "rgb (255, 0, 0)"
     * "rgb 1.0 0 0" or "rgb (1, 0, 0)"
     * "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
     * "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
     * "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
     * "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
     * "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
     * ```
     */
    function inputToRGB(color) {
        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var s = null;
        var v = null;
        var l = null;
        var ok = false;
        var format = false;
        if (typeof color === 'string') {
            color = stringInputToObject(color);
        }
        if (typeof color === 'object') {
            if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
            }
            else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
                s = convertToPercentage(color.s);
                v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, s, v);
                ok = true;
                format = 'hsv';
            }
            else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
                s = convertToPercentage(color.s);
                l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, s, l);
                ok = true;
                format = 'hsl';
            }
            if (Object.prototype.hasOwnProperty.call(color, 'a')) {
                a = color.a;
            }
        }
        a = boundAlpha(a);
        return {
            ok: ok,
            format: color.format || format,
            r: Math.min(255, Math.max(rgb.r, 0)),
            g: Math.min(255, Math.max(rgb.g, 0)),
            b: Math.min(255, Math.max(rgb.b, 0)),
            a: a,
        };
    }
    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = '[-\\+]?\\d+%?';
    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var matchers = {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
        rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
        hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
        hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
        hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
        hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    };
    /**
     * Permissive string parsing.  Take in a number of formats, and output an object
     * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
     */
    function stringInputToObject(color) {
        color = color.trim().toLowerCase();
        if (color.length === 0) {
            return false;
        }
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        }
        else if (color === 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
        }
        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match = matchers.rgb.exec(color);
        if (match) {
            return { r: match[1], g: match[2], b: match[3] };
        }
        match = matchers.rgba.exec(color);
        if (match) {
            return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        match = matchers.hsl.exec(color);
        if (match) {
            return { h: match[1], s: match[2], l: match[3] };
        }
        match = matchers.hsla.exec(color);
        if (match) {
            return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        match = matchers.hsv.exec(color);
        if (match) {
            return { h: match[1], s: match[2], v: match[3] };
        }
        match = matchers.hsva.exec(color);
        if (match) {
            return { h: match[1], s: match[2], v: match[3], a: match[4] };
        }
        match = matchers.hex8.exec(color);
        if (match) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                a: convertHexToDecimal(match[4]),
                format: named ? 'name' : 'hex8',
            };
        }
        match = matchers.hex6.exec(color);
        if (match) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                format: named ? 'name' : 'hex',
            };
        }
        match = matchers.hex4.exec(color);
        if (match) {
            return {
                r: parseIntFromHex(match[1] + match[1]),
                g: parseIntFromHex(match[2] + match[2]),
                b: parseIntFromHex(match[3] + match[3]),
                a: convertHexToDecimal(match[4] + match[4]),
                format: named ? 'name' : 'hex8',
            };
        }
        match = matchers.hex3.exec(color);
        if (match) {
            return {
                r: parseIntFromHex(match[1] + match[1]),
                g: parseIntFromHex(match[2] + match[2]),
                b: parseIntFromHex(match[3] + match[3]),
                format: named ? 'name' : 'hex',
            };
        }
        return false;
    }
    /**
     * Check to see if it looks like a CSS unit
     * (see `matchers` above for definition).
     */
    function isValidCSSUnit(color) {
        return Boolean(matchers.CSS_UNIT.exec(String(color)));
    }

    var TinyColor = /** @class */ (function () {
        function TinyColor(color, opts) {
            if (color === void 0) { color = ''; }
            if (opts === void 0) { opts = {}; }
            var _a;
            // If input is already a tinycolor, return itself
            if (color instanceof TinyColor) {
                // eslint-disable-next-line no-constructor-return
                return color;
            }
            if (typeof color === 'number') {
                color = numberInputToObject(color);
            }
            this.originalInput = color;
            var rgb = inputToRGB(color);
            this.originalInput = color;
            this.r = rgb.r;
            this.g = rgb.g;
            this.b = rgb.b;
            this.a = rgb.a;
            this.roundA = Math.round(100 * this.a) / 100;
            this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
            this.gradientType = opts.gradientType;
            // Don't let the range of [0,255] come back in [0,1].
            // Potentially lose a little bit of precision here, but will fix issues where
            // .5 gets interpreted as half of the total, instead of half of 1
            // If it was supposed to be 128, this was already taken care of by `inputToRgb`
            if (this.r < 1) {
                this.r = Math.round(this.r);
            }
            if (this.g < 1) {
                this.g = Math.round(this.g);
            }
            if (this.b < 1) {
                this.b = Math.round(this.b);
            }
            this.isValid = rgb.ok;
        }
        TinyColor.prototype.isDark = function () {
            return this.getBrightness() < 128;
        };
        TinyColor.prototype.isLight = function () {
            return !this.isDark();
        };
        /**
         * Returns the perceived brightness of the color, from 0-255.
         */
        TinyColor.prototype.getBrightness = function () {
            // http://www.w3.org/TR/AERT#color-contrast
            var rgb = this.toRgb();
            return ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
        };
        /**
         * Returns the perceived luminance of a color, from 0-1.
         */
        TinyColor.prototype.getLuminance = function () {
            // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
            var rgb = this.toRgb();
            var R;
            var G;
            var B;
            var RsRGB = rgb.r / 255;
            var GsRGB = rgb.g / 255;
            var BsRGB = rgb.b / 255;
            if (RsRGB <= 0.03928) {
                R = RsRGB / 12.92;
            }
            else {
                R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);
            }
            if (GsRGB <= 0.03928) {
                G = GsRGB / 12.92;
            }
            else {
                G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);
            }
            if (BsRGB <= 0.03928) {
                B = BsRGB / 12.92;
            }
            else {
                B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);
            }
            return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
        };
        /**
         * Returns the alpha value of a color, from 0-1.
         */
        TinyColor.prototype.getAlpha = function () {
            return this.a;
        };
        /**
         * Sets the alpha value on the current color.
         *
         * @param alpha - The new alpha value. The accepted range is 0-1.
         */
        TinyColor.prototype.setAlpha = function (alpha) {
            this.a = boundAlpha(alpha);
            this.roundA = Math.round(100 * this.a) / 100;
            return this;
        };
        /**
         * Returns the object as a HSVA object.
         */
        TinyColor.prototype.toHsv = function () {
            var hsv = rgbToHsv(this.r, this.g, this.b);
            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
        };
        /**
         * Returns the hsva values interpolated into a string with the following format:
         * "hsva(xxx, xxx, xxx, xx)".
         */
        TinyColor.prototype.toHsvString = function () {
            var hsv = rgbToHsv(this.r, this.g, this.b);
            var h = Math.round(hsv.h * 360);
            var s = Math.round(hsv.s * 100);
            var v = Math.round(hsv.v * 100);
            return this.a === 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this.roundA + ")";
        };
        /**
         * Returns the object as a HSLA object.
         */
        TinyColor.prototype.toHsl = function () {
            var hsl = rgbToHsl(this.r, this.g, this.b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
        };
        /**
         * Returns the hsla values interpolated into a string with the following format:
         * "hsla(xxx, xxx, xxx, xx)".
         */
        TinyColor.prototype.toHslString = function () {
            var hsl = rgbToHsl(this.r, this.g, this.b);
            var h = Math.round(hsl.h * 360);
            var s = Math.round(hsl.s * 100);
            var l = Math.round(hsl.l * 100);
            return this.a === 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this.roundA + ")";
        };
        /**
         * Returns the hex value of the color.
         * @param allow3Char will shorten hex value to 3 char if possible
         */
        TinyColor.prototype.toHex = function (allow3Char) {
            if (allow3Char === void 0) { allow3Char = false; }
            return rgbToHex(this.r, this.g, this.b, allow3Char);
        };
        /**
         * Returns the hex value of the color -with a # appened.
         * @param allow3Char will shorten hex value to 3 char if possible
         */
        TinyColor.prototype.toHexString = function (allow3Char) {
            if (allow3Char === void 0) { allow3Char = false; }
            return '#' + this.toHex(allow3Char);
        };
        /**
         * Returns the hex 8 value of the color.
         * @param allow4Char will shorten hex value to 4 char if possible
         */
        TinyColor.prototype.toHex8 = function (allow4Char) {
            if (allow4Char === void 0) { allow4Char = false; }
            return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
        };
        /**
         * Returns the hex 8 value of the color -with a # appened.
         * @param allow4Char will shorten hex value to 4 char if possible
         */
        TinyColor.prototype.toHex8String = function (allow4Char) {
            if (allow4Char === void 0) { allow4Char = false; }
            return '#' + this.toHex8(allow4Char);
        };
        /**
         * Returns the object as a RGBA object.
         */
        TinyColor.prototype.toRgb = function () {
            return {
                r: Math.round(this.r),
                g: Math.round(this.g),
                b: Math.round(this.b),
                a: this.a,
            };
        };
        /**
         * Returns the RGBA values interpolated into a string with the following format:
         * "RGBA(xxx, xxx, xxx, xx)".
         */
        TinyColor.prototype.toRgbString = function () {
            var r = Math.round(this.r);
            var g = Math.round(this.g);
            var b = Math.round(this.b);
            return this.a === 1 ? "rgb(" + r + ", " + g + ", " + b + ")" : "rgba(" + r + ", " + g + ", " + b + ", " + this.roundA + ")";
        };
        /**
         * Returns the object as a RGBA object.
         */
        TinyColor.prototype.toPercentageRgb = function () {
            var fmt = function (x) { return Math.round(bound01(x, 255) * 100) + "%"; };
            return {
                r: fmt(this.r),
                g: fmt(this.g),
                b: fmt(this.b),
                a: this.a,
            };
        };
        /**
         * Returns the RGBA relative values interpolated into a string
         */
        TinyColor.prototype.toPercentageRgbString = function () {
            var rnd = function (x) { return Math.round(bound01(x, 255) * 100); };
            return this.a === 1 ?
                "rgb(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%)" :
                "rgba(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%, " + this.roundA + ")";
        };
        /**
         * The 'real' name of the color -if there is one.
         */
        TinyColor.prototype.toName = function () {
            if (this.a === 0) {
                return 'transparent';
            }
            if (this.a < 1) {
                return false;
            }
            var hex = '#' + rgbToHex(this.r, this.g, this.b, false);
            for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (hex === value) {
                    return key;
                }
            }
            return false;
        };
        /**
         * String representation of the color.
         *
         * @param format - The format to be used when displaying the string representation.
         */
        TinyColor.prototype.toString = function (format) {
            var formatSet = Boolean(format);
            format = format !== null && format !== void 0 ? format : this.format;
            var formattedString = false;
            var hasAlpha = this.a < 1 && this.a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');
            if (needsAlphaFormat) {
                // Special case for "transparent", all other non-alpha formats
                // will return rgba when there is transparency.
                if (format === 'name' && this.a === 0) {
                    return this.toName();
                }
                return this.toRgbString();
            }
            if (format === 'rgb') {
                formattedString = this.toRgbString();
            }
            if (format === 'prgb') {
                formattedString = this.toPercentageRgbString();
            }
            if (format === 'hex' || format === 'hex6') {
                formattedString = this.toHexString();
            }
            if (format === 'hex3') {
                formattedString = this.toHexString(true);
            }
            if (format === 'hex4') {
                formattedString = this.toHex8String(true);
            }
            if (format === 'hex8') {
                formattedString = this.toHex8String();
            }
            if (format === 'name') {
                formattedString = this.toName();
            }
            if (format === 'hsl') {
                formattedString = this.toHslString();
            }
            if (format === 'hsv') {
                formattedString = this.toHsvString();
            }
            return formattedString || this.toHexString();
        };
        TinyColor.prototype.toNumber = function () {
            return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + (Math.round(this.b));
        };
        TinyColor.prototype.clone = function () {
            return new TinyColor(this.toString());
        };
        /**
         * Lighten the color a given amount. Providing 100 will always return white.
         * @param amount - valid between 1-100
         */
        TinyColor.prototype.lighten = function (amount) {
            if (amount === void 0) { amount = 10; }
            var hsl = this.toHsl();
            hsl.l += amount / 100;
            hsl.l = clamp01(hsl.l);
            return new TinyColor(hsl);
        };
        /**
         * Brighten the color a given amount, from 0 to 100.
         * @param amount - valid between 1-100
         */
        TinyColor.prototype.brighten = function (amount) {
            if (amount === void 0) { amount = 10; }
            var rgb = this.toRgb();
            rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
            rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
            rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
            return new TinyColor(rgb);
        };
        /**
         * Darken the color a given amount, from 0 to 100.
         * Providing 100 will always return black.
         * @param amount - valid between 1-100
         */
        TinyColor.prototype.darken = function (amount) {
            if (amount === void 0) { amount = 10; }
            var hsl = this.toHsl();
            hsl.l -= amount / 100;
            hsl.l = clamp01(hsl.l);
            return new TinyColor(hsl);
        };
        /**
         * Mix the color with pure white, from 0 to 100.
         * Providing 0 will do nothing, providing 100 will always return white.
         * @param amount - valid between 1-100
         */
        TinyColor.prototype.tint = function (amount) {
            if (amount === void 0) { amount = 10; }
            return this.mix('white', amount);
        };
        /**
         * Mix the color with pure black, from 0 to 100.
         * Providing 0 will do nothing, providing 100 will always return black.
         * @param amount - valid between 1-100
         */
        TinyColor.prototype.shade = function (amount) {
            if (amount === void 0) { amount = 10; }
            return this.mix('black', amount);
        };
        /**
         * Desaturate the color a given amount, from 0 to 100.
         * Providing 100 will is the same as calling greyscale
         * @param amount - valid between 1-100
         */
        TinyColor.prototype.desaturate = function (amount) {
            if (amount === void 0) { amount = 10; }
            var hsl = this.toHsl();
            hsl.s -= amount / 100;
            hsl.s = clamp01(hsl.s);
            return new TinyColor(hsl);
        };
        /**
         * Saturate the color a given amount, from 0 to 100.
         * @param amount - valid between 1-100
         */
        TinyColor.prototype.saturate = function (amount) {
            if (amount === void 0) { amount = 10; }
            var hsl = this.toHsl();
            hsl.s += amount / 100;
            hsl.s = clamp01(hsl.s);
            return new TinyColor(hsl);
        };
        /**
         * Completely desaturates a color into greyscale.
         * Same as calling `desaturate(100)`
         */
        TinyColor.prototype.greyscale = function () {
            return this.desaturate(100);
        };
        /**
         * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
         * Values outside of this range will be wrapped into this range.
         */
        TinyColor.prototype.spin = function (amount) {
            var hsl = this.toHsl();
            var hue = (hsl.h + amount) % 360;
            hsl.h = hue < 0 ? 360 + hue : hue;
            return new TinyColor(hsl);
        };
        /**
         * Mix the current color a given amount with another color, from 0 to 100.
         * 0 means no mixing (return current color).
         */
        TinyColor.prototype.mix = function (color, amount) {
            if (amount === void 0) { amount = 50; }
            var rgb1 = this.toRgb();
            var rgb2 = new TinyColor(color).toRgb();
            var p = amount / 100;
            var rgba = {
                r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
                g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
                b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
                a: ((rgb2.a - rgb1.a) * p) + rgb1.a,
            };
            return new TinyColor(rgba);
        };
        TinyColor.prototype.analogous = function (results, slices) {
            if (results === void 0) { results = 6; }
            if (slices === void 0) { slices = 30; }
            var hsl = this.toHsl();
            var part = 360 / slices;
            var ret = [this];
            for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results;) {
                hsl.h = (hsl.h + part) % 360;
                ret.push(new TinyColor(hsl));
            }
            return ret;
        };
        /**
         * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
         */
        TinyColor.prototype.complement = function () {
            var hsl = this.toHsl();
            hsl.h = (hsl.h + 180) % 360;
            return new TinyColor(hsl);
        };
        TinyColor.prototype.monochromatic = function (results) {
            if (results === void 0) { results = 6; }
            var hsv = this.toHsv();
            var h = hsv.h;
            var s = hsv.s;
            var v = hsv.v;
            var res = [];
            var modification = 1 / results;
            while (results--) {
                res.push(new TinyColor({ h: h, s: s, v: v }));
                v = (v + modification) % 1;
            }
            return res;
        };
        TinyColor.prototype.splitcomplement = function () {
            var hsl = this.toHsl();
            var h = hsl.h;
            return [
                this,
                new TinyColor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
                new TinyColor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
            ];
        };
        /**
         * Alias for `polyad(3)`
         */
        TinyColor.prototype.triad = function () {
            return this.polyad(3);
        };
        /**
         * Alias for `polyad(4)`
         */
        TinyColor.prototype.tetrad = function () {
            return this.polyad(4);
        };
        /**
         * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
         * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
         */
        TinyColor.prototype.polyad = function (n) {
            var hsl = this.toHsl();
            var h = hsl.h;
            var result = [this];
            var increment = 360 / n;
            for (var i = 1; i < n; i++) {
                result.push(new TinyColor({ h: (h + (i * increment)) % 360, s: hsl.s, l: hsl.l }));
            }
            return result;
        };
        /**
         * compare color vs current color
         */
        TinyColor.prototype.equals = function (color) {
            return this.toRgbString() === new TinyColor(color).toRgbString();
        };
        return TinyColor;
    }());
    // kept for backwards compatability with v1
    function tinycolor(color, opts) {
        if (color === void 0) { color = ''; }
        if (opts === void 0) { opts = {}; }
        return new TinyColor(color, opts);
    }

    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)
    /**
     * AKA `contrast`
     *
     * Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
     */
    function readability(color1, color2) {
        var c1 = new TinyColor(color1);
        var c2 = new TinyColor(color2);
        return ((Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) /
            (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05));
    }
    /**
     * Ensure that foreground and background color combinations meet WCAG2 guidelines.
     * The third argument is an object.
     *      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
     *      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
     * If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.
     *
     * Example
     * ```ts
     * new TinyColor().isReadable('#000', '#111') => false
     * new TinyColor().isReadable('#000', '#111', { level: 'AA', size: 'large' }) => false
     * ```
     */
    function isReadable(color1, color2, wcag2) {
        var _a, _b;
        if (wcag2 === void 0) { wcag2 = { level: 'AA', size: 'small' }; }
        var readabilityLevel = readability(color1, color2);
        switch (((_a = wcag2.level) !== null && _a !== void 0 ? _a : 'AA') + ((_b = wcag2.size) !== null && _b !== void 0 ? _b : 'small')) {
            case 'AAsmall':
            case 'AAAlarge':
                return readabilityLevel >= 4.5;
            case 'AAlarge':
                return readabilityLevel >= 3;
            case 'AAAsmall':
                return readabilityLevel >= 7;
            default:
                return false;
        }
    }
    /**
     * Given a base color and a list of possible foreground or background
     * colors for that base, returns the most readable color.
     * Optionally returns Black or White if the most readable color is unreadable.
     *
     * @param baseColor - the base color.
     * @param colorList - array of colors to pick the most readable one from.
     * @param args - and object with extra arguments
     *
     * Example
     * ```ts
     * new TinyColor().mostReadable('#123', ['#124", "#125'], { includeFallbackColors: false }).toHexString(); // "#112255"
     * new TinyColor().mostReadable('#123', ['#124", "#125'],{ includeFallbackColors: true }).toHexString();  // "#ffffff"
     * new TinyColor().mostReadable('#a8015a', ["#faf3f3"], { includeFallbackColors:true, level: 'AAA', size: 'large' }).toHexString(); // "#faf3f3"
     * new TinyColor().mostReadable('#a8015a', ["#faf3f3"], { includeFallbackColors:true, level: 'AAA', size: 'small' }).toHexString(); // "#ffffff"
     * ```
     */
    function mostReadable(baseColor, colorList, args) {
        if (args === void 0) { args = { includeFallbackColors: false, level: 'AA', size: 'small' }; }
        var bestColor = null;
        var bestScore = 0;
        var includeFallbackColors = args.includeFallbackColors, level = args.level, size = args.size;
        for (var _i = 0, colorList_1 = colorList; _i < colorList_1.length; _i++) {
            var color = colorList_1[_i];
            var score = readability(baseColor, color);
            if (score > bestScore) {
                bestScore = score;
                bestColor = new TinyColor(color);
            }
        }
        if (isReadable(baseColor, bestColor, { level: level, size: size }) || !includeFallbackColors) {
            return bestColor;
        }
        args.includeFallbackColors = false;
        return mostReadable(baseColor, ['#fff', '#000'], args);
    }

    /**
     * Returns the color represented as a Microsoft filter for use in old versions of IE.
     */
    function toMsFilter(firstColor, secondColor) {
        var color = new TinyColor(firstColor);
        var hex8String = '#' + rgbaToArgbHex(color.r, color.g, color.b, color.a);
        var secondHex8String = hex8String;
        var gradientType = color.gradientType ? 'GradientType = 1, ' : '';
        if (secondColor) {
            var s = new TinyColor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s.r, s.g, s.b, s.a);
        }
        return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
    }

    /**
     * If input is an object, force 1 into "1.0" to handle ratios properly
     * String input requires "1.0" as input, so 1 will be treated as 1
     */
    function fromRatio(ratio, opts) {
        var newColor = {
            r: convertToPercentage(ratio.r),
            g: convertToPercentage(ratio.g),
            b: convertToPercentage(ratio.b),
        };
        if (ratio.a !== undefined) {
            newColor.a = Number(ratio.a);
        }
        return new TinyColor(newColor, opts);
    }
    /** old random function */
    function legacyRandom() {
        return new TinyColor({
            r: Math.random(),
            g: Math.random(),
            b: Math.random(),
        });
    }

    // randomColor by David Merfield under the CC0 license
    function random$4(options) {
        if (options === void 0) { options = {}; }
        // Check if we need to generate multiple colors
        if (options.count !== undefined && options.count !== null) {
            var totalColors = options.count;
            var colors = [];
            options.count = undefined;
            while (totalColors > colors.length) {
                // Since we're generating multiple colors,
                // incremement the seed. Otherwise we'd just
                // generate the same color each time...
                options.count = null;
                if (options.seed) {
                    options.seed += 1;
                }
                colors.push(random$4(options));
            }
            options.count = totalColors;
            return colors;
        }
        // First we pick a hue (H)
        var h = pickHue(options.hue, options.seed);
        // Then use H to determine saturation (S)
        var s = pickSaturation(h, options);
        // Then use S and H to determine brightness (B).
        var v = pickBrightness(h, s, options);
        var res = { h: h, s: s, v: v };
        if (options.alpha !== undefined) {
            res.a = options.alpha;
        }
        // Then we return the HSB color in the desired format
        return new TinyColor(res);
    }
    function pickHue(hue, seed) {
        var hueRange = getHueRange(hue);
        var res = randomWithin(hueRange, seed);
        // Instead of storing red as two seperate ranges,
        // we group them, using negative numbers
        if (res < 0) {
            res = 360 + res;
        }
        return res;
    }
    function pickSaturation(hue, options) {
        if (options.hue === 'monochrome') {
            return 0;
        }
        if (options.luminosity === 'random') {
            return randomWithin([0, 100], options.seed);
        }
        var saturationRange = getColorInfo(hue).saturationRange;
        var sMin = saturationRange[0];
        var sMax = saturationRange[1];
        switch (options.luminosity) {
            case 'bright':
                sMin = 55;
                break;
            case 'dark':
                sMin = sMax - 10;
                break;
            case 'light':
                sMax = 55;
                break;
        }
        return randomWithin([sMin, sMax], options.seed);
    }
    function pickBrightness(H, S, options) {
        var bMin = getMinimumBrightness(H, S);
        var bMax = 100;
        switch (options.luminosity) {
            case 'dark':
                bMax = bMin + 20;
                break;
            case 'light':
                bMin = (bMax + bMin) / 2;
                break;
            case 'random':
                bMin = 0;
                bMax = 100;
                break;
        }
        return randomWithin([bMin, bMax], options.seed);
    }
    function getMinimumBrightness(H, S) {
        var lowerBounds = getColorInfo(H).lowerBounds;
        for (var i = 0; i < lowerBounds.length - 1; i++) {
            var s1 = lowerBounds[i][0];
            var v1 = lowerBounds[i][1];
            var s2 = lowerBounds[i + 1][0];
            var v2 = lowerBounds[i + 1][1];
            if (S >= s1 && S <= s2) {
                var m = (v2 - v1) / (s2 - s1);
                var b = v1 - (m * s1);
                return (m * S) + b;
            }
        }
        return 0;
    }
    function getHueRange(colorInput) {
        var num = parseInt(colorInput, 10);
        if (!Number.isNaN(num) && num < 360 && num > 0) {
            return [num, num];
        }
        if (typeof colorInput === 'string') {
            var namedColor = bounds.find(function (n) { return n.name === colorInput; });
            if (namedColor) {
                var color = defineColor(namedColor);
                if (color.hueRange) {
                    return color.hueRange;
                }
            }
            var parsed = new TinyColor(colorInput);
            if (parsed.isValid) {
                var hue = parsed.toHsv().h;
                return [hue, hue];
            }
        }
        return [0, 360];
    }
    function getColorInfo(hue) {
        // Maps red colors to make picking hue easier
        if (hue >= 334 && hue <= 360) {
            hue -= 360;
        }
        for (var _i = 0, bounds_1 = bounds; _i < bounds_1.length; _i++) {
            var bound = bounds_1[_i];
            var color = defineColor(bound);
            if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
                return color;
            }
        }
        throw Error('Color not found');
    }
    function randomWithin(range, seed) {
        if (seed === undefined) {
            return Math.floor(range[0] + (Math.random() * (range[1] + 1 - range[0])));
        }
        // Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
        var max = range[1] || 1;
        var min = range[0] || 0;
        seed = ((seed * 9301) + 49297) % 233280;
        var rnd = seed / 233280.0;
        return Math.floor(min + (rnd * (max - min)));
    }
    function defineColor(bound) {
        var sMin = bound.lowerBounds[0][0];
        var sMax = bound.lowerBounds[bound.lowerBounds.length - 1][0];
        var bMin = bound.lowerBounds[bound.lowerBounds.length - 1][1];
        var bMax = bound.lowerBounds[0][1];
        return {
            name: bound.name,
            hueRange: bound.hueRange,
            lowerBounds: bound.lowerBounds,
            saturationRange: [sMin, sMax],
            brightnessRange: [bMin, bMax],
        };
    }
    /**
     * @hidden
     */
    var bounds = [
        {
            name: 'monochrome',
            hueRange: null,
            lowerBounds: [[0, 0], [100, 0]],
        },
        {
            name: 'red',
            hueRange: [-26, 18],
            lowerBounds: [
                [20, 100],
                [30, 92],
                [40, 89],
                [50, 85],
                [60, 78],
                [70, 70],
                [80, 60],
                [90, 55],
                [100, 50],
            ],
        },
        {
            name: 'orange',
            hueRange: [19, 46],
            lowerBounds: [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]],
        },
        {
            name: 'yellow',
            hueRange: [47, 62],
            lowerBounds: [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]],
        },
        {
            name: 'green',
            hueRange: [63, 178],
            lowerBounds: [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]],
        },
        {
            name: 'blue',
            hueRange: [179, 257],
            lowerBounds: [
                [20, 100],
                [30, 86],
                [40, 80],
                [50, 74],
                [60, 60],
                [70, 52],
                [80, 44],
                [90, 39],
                [100, 35],
            ],
        },
        {
            name: 'purple',
            hueRange: [258, 282],
            lowerBounds: [
                [20, 100],
                [30, 87],
                [40, 79],
                [50, 70],
                [60, 65],
                [70, 59],
                [80, 52],
                [90, 45],
                [100, 42],
            ],
        },
        {
            name: 'pink',
            hueRange: [283, 334],
            lowerBounds: [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]],
        },
    ];

    exports.ApplicationLoop = ApplicationLoop;
    exports.AssetLoader = AssetLoader;
    exports.Audio = Audio;
    exports.BoxRenderer = BoxRenderer;
    exports.ByteLoader = ByteLoader;
    exports.Camera = Camera;
    exports.Camera2D = Camera2D;
    exports.Camera3D = Camera3D;
    exports.CanvasView = CanvasView;
    exports.Discrete = Discrete;
    exports.DisplayPort = DisplayPort;
    exports.Downloader = Downloader;
    exports.Eventable = Eventable$1;
    exports.Game = Game$1;
    exports.Geometry = Geometry3D;
    exports.Geometry2D = Geometry2D;
    exports.ImageLoader = ImageLoader;
    exports.InputContext = InputContext;
    exports.InputKey = InputKey;
    exports.IntersectionHelper = IntersectionHelper;
    exports.IntersectionResolver = IntersectionResolver;
    exports.IntersectionWorld = IntersectionWorld;
    exports.JSONLoader = JSONLoader;
    exports.Keyboard = Keyboard;
    exports.Logger = Logger$1;
    exports.Mouse = Mouse;
    exports.OBJLoader = OBJLoader;
    exports.PriorityQueue = PriorityQueue$1;
    exports.QuadTree = QuadTree$1;
    exports.Random = Random;
    exports.RandomGenerator = RandomGenerator;
    exports.SceneGraph = SceneGraph;
    exports.SimpleRandomGenerator = SimpleRandomGenerator;
    exports.SpriteRenderer = SpriteRenderer;
    exports.TextLoader = TextLoader;
    exports.TinyColor = TinyColor;
    exports.Transform = Transform;
    exports.Uploader = Uploader;
    exports.bounds = bounds;
    exports.clamp = clamp$1;
    exports.createBufferInfo = createBufferInfo;
    exports.createDrawInfo = createDrawInfo;
    exports.createElementBufferInfo = createElementBufferInfo;
    exports.createShader = createShader;
    exports.createShaderProgram = createShaderProgram;
    exports.createShaderProgramAttributeSetter = createShaderProgramAttributeSetter;
    exports.createShaderProgramAttributeSetters = createShaderProgramAttributeSetters;
    exports.createShaderProgramInfo = createShaderProgramInfo;
    exports.createShaderProgramUniformSetter = createShaderProgramUniformSetter;
    exports.createShaderProgramUniformSetters = createShaderProgramUniformSetters;
    exports.createTextureInfo = createTextureInfo;
    exports.createVertexArrayInfo = createVertexArrayInfo;
    exports.cycle = cycle;
    exports.direction2 = direction2;
    exports.distance2 = distance2;
    exports.draw = draw;
    exports.fromRatio = fromRatio;
    exports.getBufferTypeInfo = getBufferTypeInfo;
    exports.getUniformTypeInfo = getUniformTypeInfo;
    exports.glMatrix = common;
    exports.inputToRGB = inputToRGB;
    exports.isReadable = isReadable;
    exports.isValidCSSUnit = isValidCSSUnit;
    exports.legacyRandom = legacyRandom;
    exports.lerp = lerp$5;
    exports.lookAt2 = lookAt2;
    exports.mat2 = mat2;
    exports.mat2d = mat2d;
    exports.mat3 = mat3;
    exports.mat4 = mat4;
    exports.mostReadable = mostReadable;
    exports.names = names;
    exports.quat = quat;
    exports.quat2 = quat2;
    exports.random = random$4;
    exports.readability = readability;
    exports.setDOMMatrix = setDOMMatrix;
    exports.stringInputToObject = stringInputToObject;
    exports.tinycolor = tinycolor;
    exports.toDegrees = toDegrees;
    exports.toMsFilter = toMsFilter;
    exports.toRadians = toRadians;
    exports.uuid = uuid;
    exports.vec2 = vec2$1;
    exports.vec3 = vec3$1;
    exports.vec4 = vec4;
    exports.withinRadius = withinRadius;

    Object.defineProperty(exports, '__esModule', { value: true });

})));