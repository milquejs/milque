(function () {
    'use strict';

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

    const INNER_HTML$1$1 = `
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
    const INNER_STYLE$1$1 = `
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

    const TEMPLATE_KEY$1$1 = Symbol('template');
    const STYLE_KEY$1$1 = Symbol('style');

    const POLL_WARNING_TIME = 3000;

    class InputContext extends HTMLElement
    {
        static get [TEMPLATE_KEY$1$1]()
        {
            let template = document.createElement('template');
            template.innerHTML = INNER_HTML$1$1;
            Object.defineProperty(this, TEMPLATE_KEY$1$1, { value: template });
            return template;
        }

        static get [STYLE_KEY$1$1]()
        {
            let style = document.createElement('style');
            style.innerHTML = INNER_STYLE$1$1;
            Object.defineProperty(this, STYLE_KEY$1$1, { value: style });
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
            this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY$1$1].content.cloneNode(true));
            this.shadowRoot.appendChild(this.constructor[STYLE_KEY$1$1].cloneNode(true));

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

    /**
     * Common utilities
     * @module glMatrix
     */
    // Configuration Constants
    var EPSILON = 0.000001;
    var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
    if (!Math.hypot) Math.hypot = function () {
      var y = 0,
          i = arguments.length;

      while (i--) {
        y += arguments[i] * arguments[i];
      }

      return Math.sqrt(y);
    };

    /**
     * 3x3 Matrix
     * @module mat3
     */

    /**
     * Creates a new identity mat3
     *
     * @returns {mat3} a new 3x3 matrix
     */

    function create() {
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
     * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
     * @module mat4
     */

    /**
     * Creates a new identity mat4
     *
     * @returns {mat4} a new 4x4 matrix
     */

    function create$1() {
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
     * Inverts a mat4
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the source matrix
     * @returns {mat4} out
     */

    function invert(out, a) {
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
     * Multiplies two mat4s
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {mat4} out
     */

    function multiply(out, a, b) {
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
     * 3 Dimensional Vector
     * @module vec3
     */

    /**
     * Creates a new, empty vec3
     *
     * @returns {vec3} a new 3D vector
     */

    function create$2() {
      var out = new ARRAY_TYPE(3);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }

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

    function fromValues(x, y, z) {
      var out = new ARRAY_TYPE(3);
      out[0] = x;
      out[1] = y;
      out[2] = z;
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

    function dot(a, b) {
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
     * Alias for {@link vec3.length}
     * @function
     */

    var len = length;
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
      var vec = create$2();
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

    /**
     * 4 Dimensional Vector
     * @module vec4
     */

    /**
     * Creates a new, empty vec4
     *
     * @returns {vec4} a new 4D vector
     */

    function create$3() {
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
      var vec = create$3();
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

    /**
     * Quaternion
     * @module quat
     */

    /**
     * Creates a new identity quat
     *
     * @returns {quat} a new quaternion
     */

    function create$4() {
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
     * Normalize a quat
     *
     * @param {quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quaternion to normalize
     * @returns {quat} out
     * @function
     */

    var normalize$2 = normalize$1;
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
      var tmpvec3 = create$2();
      var xUnitVec3 = fromValues(1, 0, 0);
      var yUnitVec3 = fromValues(0, 1, 0);
      return function (out, a, b) {
        var dot$1 = dot(a, b);

        if (dot$1 < -0.999999) {
          cross(tmpvec3, xUnitVec3, a);
          if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
          normalize(tmpvec3, tmpvec3);
          setAxisAngle(out, tmpvec3, Math.PI);
          return out;
        } else if (dot$1 > 0.999999) {
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
          out[3] = 1 + dot$1;
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
      var temp1 = create$4();
      var temp2 = create$4();
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
      var matr = create();
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

    const ORIGIN = fromValues(0, 0, 0);
    const XAXIS = fromValues(1, 0, 0);
    const YAXIS = fromValues(0, 1, 0);
    const ZAXIS = fromValues(0, 0, 1);

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

    // Bresenham's Line Algorithm

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
    function create$5(context = undefined)
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
        create: create$5,
        assign,
        mixin
    };

    var Eventable$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create$5,
        assign: assign,
        mixin: mixin,
        'default': Eventable
    });

    function lerp$1(a, b, t)
    {
        return a + (b - a) * t;
    }

    function distance2(fromX, fromY, toX, toY)
    {
        let dx = toX - fromX;
        let dy = toY - fromY;
        return Math.sqrt(dx * dx + dy * dy);
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

    class Camera2D
    {
        static screenToWorld(screenX, screenY, viewMatrix, projectionMatrix)
        {
            let mat = multiply(create$1(), projectionMatrix, viewMatrix);
            invert(mat, mat);
            let result = fromValues(screenX, screenY, 0);
            transformMat4(result, result, mat);
            return result;
        }
        
        constructor(left = -1, right = 1, top = -1, bottom = 1, near = 0, far = 1)
        {
            this.position = create$2();
            this.rotation = create$4();
            this.scale = fromValues(1, 1, 1);

            this.clippingPlane = {
                left, right, top, bottom, near, far,
            };
            
            this._viewMatrix = create$1();
            this._projectionMatrix = create$1();
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
            let nextPosition = fromValues(x, y, z);
            lerp(this.position, this.position, nextPosition, Math.min(1, dt));
        }

        getViewMatrix(out = this._viewMatrix)
        {
            let viewX = -Math.round(this.x);
            let viewY = -Math.round(this.y);
            let viewZ = this.z === 0 ? 1 : 1 / this.z;
            let invPosition = fromValues(viewX, viewY, 0);
            let invScale = fromValues(this.scale[0] * viewZ, this.scale[1] * viewZ, 1);
            fromRotationTranslationScale(out, this.rotation, invPosition, invScale);
            return out;
        }

        getProjectionMatrix(out = this._projectionMatrix)
        {
            let { left, right, top, bottom, near, far } = this.clippingPlane;
            ortho(out, left, right, top, bottom, near, far);
            return out;
        }
    }

    function toChunkId(chunkCoordX, chunkCoordY)
    {
        return chunkCoordX + ',' + chunkCoordY;
    }

    function toChunkCoords(chunkId)
    {
        let separator = chunkId.indexOf(',');
        let chunkCoordX = Number(chunkId.substring(0, separator));
        let chunkCoordY = Number(chunkId.substring(separator + 1));
        return [ chunkCoordX, chunkCoordY ];
    }

    class Chunk
    {
        constructor(chunkManager, chunkId, chunkCoordX, chunkCoordY, chunkData)
        {
            this.chunkManager = chunkManager;
            this.chunkId = chunkId;
            this.chunkCoordX = chunkCoordX;
            this.chunkCoordY = chunkCoordY;
            this._data = chunkData;
        }

        get data()
        {
            return this._data;
        }
    }

    class ChunkData
    {
        constructor(width, height)
        {
            const length = width * height;
            this.block = new Uint8Array(length).fill(0);
            this.meta = new Uint8Array(length).fill(0);
            this.neighbor = new Uint8Array(length).fill(0b1111);
        }
    }

    class BlockPos
    {
        constructor(chunkWidth, chunkHeight)
        {
            this._chunkWidth = chunkWidth;
            this._chunkHeight = chunkHeight;
            
            this._x = 0;
            this._y = 0;

            this._blockCoordX = 0;
            this._blockCoordY = 0;
            this._index = 0;

            this._chunkCoordX = 0;
            this._chunkCoordY = 0;
            this._chunkId = null;
        }

        get x() { return this._x; }
        get y() { return this._y; }

        get blockCoordX() { return this._blockCoordX; }
        get blockCoordY() { return this._blockCoordY; }
        get index() { return this._index; }

        get chunkCoordX() { return this._chunkCoordX; }
        get chunkCoordY() { return this._chunkCoordY; }
        get chunkId() { return this._chunkId; }

        /**
         * Creates a new instance of this BlockPos. This does not copy values, only initializes a new instance.
         * Because of this, this is useful when we the position is arbitrary, but we want a new instance to modify.
         */
        clone()
        {
            return new BlockPos(this._chunkWidth, this._chunkHeight);
        }

        set(x, y)
        {
            this._x = x;
            this._y = y;

            const chunkWidth = this._chunkWidth;
            const chunkHeight = this._chunkHeight;

            if (x < 0)
            {
                this._blockCoordX = Math.abs(chunkWidth + Math.floor(x)) % chunkWidth;
            }
            else
            {
                this._blockCoordX = Math.floor(x) % chunkWidth;
            }

            if (y < 0)
            {
                this._blockCoordY = Math.abs(chunkHeight + Math.floor(y)) % chunkHeight;
            }
            else
            {
                this._blockCoordY = Math.floor(y) % chunkHeight;
            }
            
            this._index = this._blockCoordX + this._blockCoordY * chunkWidth;

            this._chunkCoordX = Math.floor(x / chunkWidth);
            this._chunkCoordY = Math.floor(y / chunkHeight);
            this._chunkId = toChunkId(this._chunkCoordX, this._chunkCoordY);
            return this;
        }

        copy(out = this.clone())
        {
            out._x = this.x;
            out._y = this.y;

            out._blockCoordX = this.blockCoordX;
            out._blockCoordY = this.blockCoordY;
            out._index = this.index;

            out._chunkCoordX = this.chunkCoordX;
            out._chunkCoordY = this.chunkCoordY;
            out._chunkId = this.chunkId;
            return out;
        }

        offset(out = this, dx = 0, dy = 0)
        {
            return out.set(this.x + dx, this.y + dy);
        }

        down(out = this, offset = 1)
        {
            return out.set(this.x, this.y + offset);
        }

        up(out = this, offset = 1)
        {
            return out.set(this.x, this.y - offset);
        }

        right(out = this, offset = 1)
        {
            return out.set(this.x + offset, this.y);
        }

        left(out = this, offset = 1)
        {
            return out.set(this.x - offset, this.y);
        }
        
        reset(src = null)
        {
            if (src)
            {
                return src.copy(this);
            }
            else
            {
                return this.set(0, 0);
            }
        }

        equals(blockPos)
        {
            return Math.abs(this.x - blockPos.x) < Number.EPSILON
                && Math.abs(this.y - blockPos.y) < Number.EPSILON;
        }

        /** @override */
        toString(details = false)
        {
            return `BlockPos(${this.x},${this.y})`
            + (details
                ? `:Chunk[${this.chunkId}]@{${this.blockCoordX},${this.blockCoordY}}[${this.index}],`
                : '');
        }
    }

    class ChunkManager
    {
        constructor(chunkWidth, chunkHeight)
        {
            this.chunkWidth = chunkWidth;
            this.chunkHeight = chunkHeight;

            this.chunks = {};
        }

        clear()
        {
            this.chunks = {};
        }

        getChunkById(chunkId)
        {
            if (chunkId in this.chunks)
            {
                return this.chunks[chunkId];
            }
            else
            {
                const [chunkCoordX, chunkCoordY] = toChunkCoords(chunkId);
                let chunkData = new ChunkData(this.chunkWidth, this.chunkHeight);
                let chunk = new Chunk(this, chunkId, chunkCoordX, chunkCoordY, chunkData);
                this.chunks[chunkId] = chunk;
                return chunk;
            }
        }

        getChunkByCoord(chunkCoordX, chunkCoordY)
        {
            const chunkId = toChunkId(chunkCoordX, chunkCoordY);
            return this.getChunkById(chunkId);
        }

        getChunksWithinBounds(fromBlockPos, toBlockPos)
        {
            let dst = [];
            const fromChunkCoordX = fromBlockPos.chunkCoordX;
            const fromChunkCoordY = fromBlockPos.chunkCoordY;
            const toChunkCoordX = toBlockPos.chunkCoordX;
            const toChunkCoordY = toBlockPos.chunkCoordY;
            for(let chunkCoordY = fromChunkCoordY; chunkCoordY <= toChunkCoordY; ++chunkCoordY)
            {
                for(let chunkCoordX = fromChunkCoordX; chunkCoordX <= toChunkCoordX; ++chunkCoordX)
                {
                    const chunkId = toChunkId(chunkCoordX, chunkCoordY);
                    dst.push(this.getChunkById(chunkId));
                }
            }
            return dst;
        }

        getLoadedChunks()
        {
            let dst = [];
            for(let chunkId of Object.keys(this.chunks))
            {
                let chunk = this.chunks[chunkId];
                dst.push(chunk);
            }
            return dst;
        }
    }

    class ChunkMap extends ChunkManager
    {
        constructor(left = -Infinity, top = -Infinity,
            right = Infinity, bottom = Infinity,
            chunkWidth = Number.isFinite(right - left) ? right - left : 16, chunkHeight = Number.isFinite(bottom - top) ? bottom - top : 16)
        {
            super(chunkWidth, chunkHeight);

            this.bounds = {
                left,
                right,
                top,
                bottom,
            };
        }

        isWithinBounds(blockPos)
        {
            if (!blockPos) return false;
            const { x, y } = blockPos;
            return (x <= this.bounds.right)
                && (x >= this.bounds.left)
                && (y <= this.bounds.bottom)
                && (y >= this.bounds.top);
        }

        isWithinLoaded(blockPos)
        {
            return blockPos.chunkId in this.chunks;
        }

        getChunk(blockPos)
        {
            return this.getChunkById(blockPos.chunkId);
        }

        getBlockId(blockPos)
        {
            return this.getChunkById(blockPos.chunkId).data.block[blockPos.index];
        }

        getBlockMeta(blockPos)
        {
            return this.getChunkById(blockPos.chunkId).data.meta[blockPos.index];
        }

        getBlockNeighbor(blockPos)
        {
            return this.getChunkById(blockPos.chunkId).data.neighbor[blockPos.index];
        }

        setBlockId(blockPos, value)
        {
            this.getChunkById(blockPos.chunkId).data.block[blockPos.index] = value;
            return this;
        }
        
        setBlockMeta(blockPos, value)
        {
            this.getChunkById(blockPos.chunkId).data.meta[blockPos.index] = value;
            return this;
        }

        setBlockNeighbor(blockPos, value)
        {
            this.getChunkById(blockPos.chunkId).data.neighbor[blockPos.index] = value;
            return this;
        }

        at(x, y)
        {
            return new BlockPos(this.chunkWidth, this.chunkHeight).set(x, y);
        }
    }

    class BlockRegistry
    {
        constructor()
        {
            this.blocks = {};
            this.components = {};
        }

        register(blockId, ...components)
        {
            if (blockId in this.blocks)
            {
                throw new Error(`BlockId '${blockId}' already registered.`);
            }

            const componentOpts = components.map(opt => !Array.isArray(opt) ? [ opt, true ] : opt);
            for(let [component, initial] of componentOpts)
            {
                if (!(component in this.components)) this.components[component] = {};
                
                let blockComponents = this.components[component];
                
                if (blockId in blockComponents) throw new Error(`Component '${component}' for block '${blockId}' already registered.`);

                let value;
                if (typeof initial === 'object')
                {
                    value = Object.assign({}, initial);
                }
                else
                {
                    value = initial;
                }
                blockComponents[blockId] = value;
            }

            let block = new Block(this, blockId, componentOpts);

            this.blocks[blockId] = block;
            return block;
        }

        getBlock(blockId)
        {
            if (blockId in this.blocks)
            {
                return this.blocks[blockId];
            }
            else
            {
                return null;
            }
        }

        getBlocks()
        {
            return Object.values(this.blocks);
        }

        getBlockIds()
        {
            return Object.keys(this.blocks);
        }

        getBlockComponents(blockId)
        {
            let result = [];
            for(let blockComponents of this.components)
            {
                if (blockId in blockComponents)
                {
                    result.push(blockComponents[blockId]);
                }
            }
            return result;
        }

        hasComponent(component, blockId)
        {
            return component in this.components
                && blockId in this.components[component];
        }

        getComponent(component, blockId)
        {
            if (component in this.components)
            {
                let blockComponents = this.components[component];
                if (blockId in blockComponents)
                {
                    return blockComponents[blockId];
                }
            }
            return null;
        }

        getComponents(component)
        {
            if (component in this.components)
            {
                let blockComponents = this.components[component];
                return Object.values(blockComponents);
            }
        }

        getComponentNames()
        {
            return Object.keys(this.components);
        }
    }

    class Block
    {
        constructor(blockRegistry, blockId, componentOpts)
        {
            this.blockRegistry = blockRegistry;
            this.blockId = blockId;
            this.blockOpts = componentOpts;
            
            for(let [component, values] of componentOpts)
            {
                this[component] = blockRegistry.getComponent(component, blockId);
            }
        }

        /** @override */
        toString()
        {
            return `Block#${this.blockId}`;
        }
    }

    const BLOCKS = new BlockRegistry();

    const AIR = BLOCKS.register(0, 'air');
    const WATER = BLOCKS.register(1, 'fluid', ['color', 'dodgerblue'], ['material', 'fluid']);

    const DIRT = BLOCKS.register(3, 'solid', 'grassSoil', ['color', 'saddlebrown'], ['material', 'dirt']);
    const GOLD = BLOCKS.register(4, 'solid', ['color', 'gold'], ['material', 'metal']);
    const GRASS = BLOCKS.register(5, 'solid', ['color', 'limegreen'], ['material', 'dirt']);
    const STONE = BLOCKS.register(6, 'solid', ['color', 'slategray'], ['material', 'stone']);
    const CLAY = BLOCKS.register(7, 'solid', ['color', 'salmon'], ['material', 'stone']);
    const STONE2 = BLOCKS.register(8, 'solid', ['color', 'powderblue'], ['material', 'metal']);
    const STONE3 = BLOCKS.register(9, 'solid', ['color', 'rebeccapurple'], ['material', 'stone']);
    const STONE4 = BLOCKS.register(10, 'solid', ['color', 'teal'], ['material', 'stone']);
    const STONE5 = BLOCKS.register(11, 'solid', ['color', 'mediumvioletred'], ['material', 'stone']);
    const SAND = BLOCKS.register(12, 'solid', ['color', 'navajowhite'], ['material', 'dirt']);

    const PLACE_EVENT = 'place';
    const BREAK_EVENT = 'break';

    function emitPlaceEvent(world, blockPos, blockId)
    {
        world.emit(PLACE_EVENT, world, blockPos, blockId);
    }

    function emitBreakEvent(world, blockPos, blockId)
    {
        world.emit(BREAK_EVENT, world, blockPos, blockId);
    }

    const UPDATE_EVENT = 'update';
    const WORLD_UPDATE_EVENT = 'worldUpdate';
    const CHUNK_UPDATE_EVENT = 'chunkUpdate';
    const BLOCK_UPDATE_EVENT = 'blockUpdate';

    function emitUpdateEvent(world)
    {
        world.emit(UPDATE_EVENT, world);
    }

    function emitWorldUpdateEvent(world)
    {
        world.emit(WORLD_UPDATE_EVENT, world);
    }

    function emitChunkUpdateEvent(world, chunk)
    {
        world.emit(CHUNK_UPDATE_EVENT, world, chunk);
    }

    function emitBlockUpdateEvent(world, chunk, blockPos)
    {
        world.emit(BLOCK_UPDATE_EVENT, world, chunk, blockPos);
    }

    const AIR_COMPONENT = 'air';
    const FLUID_COMPONENT = 'fluid';

    const MAX_FLUID_LEVELS = 3;

    function initialize(world)
    {
        world.on(PLACE_EVENT, onBlockPlace);
        world.on(WORLD_UPDATE_EVENT, onWorldUpdate);
    }

    function onBlockPlace(world, blockPos, blockId)
    {
        if (BLOCKS.hasComponent(FLUID_COMPONENT, blockId))
        {
            world.map.setBlockMeta(blockPos, MAX_FLUID_LEVELS);
        }
    }

    function onWorldUpdate(world)
    {
        let sortedChunks = sortChunksByBottomFirst(world.map.getLoadedChunks());

        for(let chunk of sortedChunks)
        {
            updateFluidsInChunk(world, chunk);
        }
    }

    function sortChunksByBottomFirst(chunks)
    {
        return chunks.sort((a, b) => {
            if (a.chunkCoordY < b.chunkCoordY)
            {
                return 1;
            }
            else if (a.chunkCoordY > b.chunkCoordY)
            {
                return -1;
            }
            else if (a.chunkCoordX < b.chunkCoordX)
            {
                return 1;
            }
            else if (a.chunkCoordX > b.chunkCoordX)
            {
                return -1;
            }
            else
            {
                return 0;
            }
        });
    }

    function updateFluidsInChunk(world, chunk)
    {
        const worldMap = world.map;
        const chunkX = chunk.chunkCoordX * worldMap.chunkWidth;
        const chunkY = chunk.chunkCoordY * worldMap.chunkHeight;

        // Do water physics.
        let blockPos = worldMap.at(0, 0);
        for(let y = worldMap.chunkHeight - 1; y >= 0; --y)
        {
            for(let x = 0; x < worldMap.chunkWidth; ++x)
            {
                blockPos.set(x + chunkX, y + chunkY);
                let blockId = worldMap.getBlockId(blockPos);
                if (BLOCKS.hasComponent(FLUID_COMPONENT, blockId))
                {
                    updateFluidBlock(world, blockPos);
                }
            }
        }
    }

    function updateFluidBlock(world, blockPos)
    {
        const worldMap = world.map;
        if (!tryFlowWaterDown(worldMap, blockPos) && !tryFlowWaterSide(worldMap, blockPos))
        ;
    }

    function tryFlowWaterDown(worldMap, blockPos)
    {
        let toBlockPos = blockPos.copy().down();
        return flowWater(worldMap, blockPos, toBlockPos, MAX_FLUID_LEVELS);
    }

    function tryFlowWaterSide(worldMap, blockPos)
    {
        let flag = false;
        let meta = worldMap.getBlockMeta(blockPos);
        let toBlockPos = blockPos.copy();
        if (meta <= 1)
        {
            blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
            flag |= flowWater(worldMap, blockPos, toBlockPos, 1, false);
        }
        else
        {
            blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
            flag |= flowWater(worldMap, blockPos, toBlockPos, 1, false);
            blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
            flag |= flowWater(worldMap, blockPos, toBlockPos, 1, false);
        }
        return flag;
    }

    function flowWater(worldMap, fromBlockPos, toBlockPos, amount, allowBackflow = true)
    {
        if (!worldMap.isWithinBounds(toBlockPos)) return false;
        if (!worldMap.isWithinLoaded(toBlockPos))
        {
            worldMap.setBlockId(fromBlockPos, 0);
            worldMap.setBlockMeta(fromBlockPos, 0);
            return true;
        }
        
        let fromBlock = worldMap.getBlockId(fromBlockPos);
        let fromMeta = worldMap.getBlockMeta(fromBlockPos);
        let toBlock = worldMap.getBlockId(toBlockPos);
        let toMeta = worldMap.getBlockMeta(toBlockPos);

        if (amount > fromMeta) amount = fromMeta;

        if (BLOCKS.hasComponent(AIR_COMPONENT, toBlock))
        {
            let remainder = fromMeta - amount;
            if (remainder <= 0)
            {
                worldMap.setBlockId(toBlockPos, fromBlock)
                    .setBlockMeta(toBlockPos, fromMeta)
                    .setBlockId(fromBlockPos, 0)
                    .setBlockMeta(fromBlockPos, 0);
                return true;
            }
            else
            {
                worldMap.setBlockId(toBlockPos, fromBlock)
                    .setBlockMeta(toBlockPos, amount)
                    .setBlockMeta(fromBlockPos, remainder);
                return true;
            }
        }
        else if (BLOCKS.hasComponent(FLUID_COMPONENT, toBlock) && toMeta < MAX_FLUID_LEVELS)
        {
            if (!allowBackflow && fromMeta <= toMeta) return false;
            
            if (toMeta + amount <= MAX_FLUID_LEVELS)
            {
                worldMap.setBlockMeta(toBlockPos, toMeta + amount);

                if (amount >= fromMeta)
                {
                    worldMap.setBlockId(fromBlockPos, 0)
                        .setBlockMeta(fromBlockPos, 0);
                }
                else
                {
                    worldMap.setBlockMeta(fromBlockPos, fromMeta - amount);
                }
                return true;
            }
            else
            {
                worldMap.setBlockMeta(toBlockPos, MAX_FLUID_LEVELS);

                let remainder = amount - (MAX_FLUID_LEVELS - toMeta);
                worldMap.setBlockMeta(fromBlockPos, remainder);
                return true;
            }
        }
    }

    function hasUpNeighbor(neighbor)
    {
        return (neighbor & 0b0010) >> 1 > 0;
    }

    function onBlockPlace$1(world, blockPos, blockId)
    {
        const worldMap = world.map;

        let out = blockPos.clone();
        let neighbor = 0b0000;
        if (worldMap.isWithinBounds(blockPos.right(out))
            && worldMap.getBlockId(out) === blockId)
        {
            neighbor |= 0b0001;
            worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) | 0b0100);
        }
        if (worldMap.isWithinBounds(blockPos.up(out))
            && worldMap.getBlockId(out) === blockId)
        {
            neighbor |= 0b0010;
            worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) | 0b1000);
        }
        if (worldMap.isWithinBounds(blockPos.left(out))
            && worldMap.getBlockId(out) === blockId)
        {
            neighbor |= 0b0100;
            worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) | 0b0001);
        }
        if (worldMap.isWithinBounds(blockPos.down(out))
            && worldMap.getBlockId(out) === blockId)
        {
            neighbor |= 0b1000;
            worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) | 0b0010);
        }
        worldMap.setBlockNeighbor(blockPos, neighbor);
    }

    function onBlockBreak(world, blockPos, blockId)
    {
        const worldMap = world.map;
        
        let out = blockPos.clone();
        if (worldMap.isWithinBounds(blockPos.right(out))
            && worldMap.getBlockId(out) === blockId)
        {
            worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) & 0b1011);
        }
        if (worldMap.isWithinBounds(blockPos.up(out))
            && worldMap.getBlockId(out) === blockId)
        {
            worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) & 0b0111);
        }
        if (worldMap.isWithinBounds(blockPos.left(out))
            && worldMap.getBlockId(out) === blockId)
        {
            worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) & 0b1110);
        }
        if (worldMap.isWithinBounds(blockPos.down(out))
            && worldMap.getBlockId(out) === blockId)
        {
            worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) & 0b1101);
        }
        worldMap.setBlockNeighbor(blockPos, 0);
    }

    function renderBlock(ctx, world, blockPos, blockSize)
    {
        let blockId = world.map.getBlockId(blockPos);
        if (BLOCKS.hasComponent('air', blockId)) return;
        if (BLOCKS.hasComponent('fluid', blockId))
        {
            renderBlockFluid(ctx, world, blockPos, blockSize, blockId);
            return;
        }
        if (BLOCKS.hasComponent('solid', blockId))
        {
            renderBlockSolid(ctx, world, blockPos, blockSize, blockId);
            return;
        }
    }

    function renderBlockFluid(ctx, world, blockPos, blockSize, blockId)
    {
        const worldMap = world.map;
        const blockMeta = worldMap.getBlockMeta(blockPos);
        const fluidRatio = blockMeta <= 0 ? 1 : blockMeta / MAX_FLUID_LEVELS;
        const color = BLOCKS.getComponent('color', blockId);

        ctx.fillStyle = color;
        ctx.fillRect(0, (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);

        let time = Date.now() / 2000;
        let rx = blockPos.x / worldMap.chunkWidth;
        let ry = blockPos.y / worldMap.chunkHeight;
        let osx = blockPos.blockCoordX % 2 === 0;
        let osy = blockPos.blockCoordY % 2 === 0;
        let sfactor = Math.sin(time + rx - ry + (osx ? 0.3 : 0) + (osy ? 0.1 : 0));
        ctx.fillStyle = `rgba(0, 0, 100, ${((sfactor + 1) / 2) * 0.4})`;
        ctx.fillRect(0, (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);
    }

    function renderBlockSolid(ctx, world, blockPos, blockSize, blockId)
    {
        const worldMap = world.map;
        const color = BLOCKS.getComponent('color', blockId);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, blockSize, blockSize);

        if (blockId === GOLD.blockId)
        {
            let time = Date.now() / 500;
            let rx = blockPos.x / worldMap.chunkWidth;
            let ry = blockPos.y / worldMap.chunkHeight;
            let sfactor = Math.sin(time + rx * 4 + ry * 4);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, sfactor - 0.6)})`;
            ctx.fillRect(0, 0, blockSize, blockSize);
        }
        else if (blockId === DIRT.blockId)
        {
            let osx = blockPos.blockCoordX % 2 === 0;
            let osy = blockPos.blockCoordY % 2 === 0;
            ctx.fillStyle = `rgba(0, 0, 0, ${osx && osy ? 0.1 : 0})`;
            ctx.fillRect(0, 0, blockSize, blockSize);
            
            const blockNeighbor = worldMap.getBlockNeighbor(blockPos);

            const grassSize = Math.ceil(blockSize / 4);
            if (!hasUpNeighbor(blockNeighbor))
            {
                let upBlockId = worldMap.getBlockId(blockPos.up());
                if (BLOCKS.hasComponent(AIR_COMPONENT, upBlockId))
                {
                    ctx.fillStyle = 'limegreen';
                    ctx.fillRect(0, 0, blockSize, grassSize);
                }
                blockPos.down();
            }
        }
        else if (blockId === GRASS.blockId)
        {
            let osx = blockPos.blockCoordX % 2 === 0;
            ctx.fillStyle = `rgba(0, 0, 0, ${osx ? 0.1 : 0})`;
            ctx.fillRect(0, 0, blockSize, blockSize);
        }
    }

    async function load() {}

    function drawChunkMap(ctx, chunkMap, blockSize)
    {
        const chunkBlockWidth = chunkMap.chunkWidth * blockSize;
        const chunkBlockHeight = chunkMap.chunkHeight * blockSize;
        for(let chunk of chunkMap.getLoadedChunks())
        {
            const chunkX = chunk.chunkCoordX * chunkBlockWidth;
            const chunkY = chunk.chunkCoordY * chunkBlockHeight;
            ctx.translate(chunkX, chunkY);
            {
                drawChunk(ctx, chunkMap, chunk, blockSize);
                // ctx.fillStyle = 'white';
                // ctx.fillText(chunk.chunkId, 0, 16);
                // ctx.strokeStyle = 'white';
                // ctx.strokeRect(0, 0, chunkBlockWidth, chunkBlockHeight);
            }
            ctx.translate(-chunkX, -chunkY);
        }
    }

    function drawPlacement(ctx, placementState, blockSize)
    {
        drawChunkMap(ctx, placementState.shapeMap, blockSize);
    }

    function drawChunk(ctx, chunkMap, chunk, blockSize)
    {
        const chunkWidth = chunkMap.chunkWidth;
        const chunkHeight = chunkMap.chunkHeight;

        const chunkOffsetX = chunk.chunkCoordX * chunkWidth;
        const chunkOffsetY = chunk.chunkCoordY * chunkHeight;
        let blockPos = chunkMap.at(chunkOffsetX, chunkOffsetY);
        for(let y = 0; y < chunkHeight; ++y)
        {
            for(let x = 0; x < chunkWidth; ++x)
            {
                blockPos.set(x + chunkOffsetX, y + chunkOffsetY);
                ctx.translate(x * blockSize, y * blockSize);
                {
                    renderBlock(ctx, { map: chunkMap }, blockPos, blockSize);
                    // ctx.fillStyle = 'white';
                    // ctx.fillText(chunkMap.getBlockNeighbor(blockPos), 0, 0);
                }
                ctx.translate(-x * blockSize, -y * blockSize);
            }
        }
    }

    function placeBlock(world, blockPos, blockId, blockMeta = 0)
    {
        const prevBlockId = world.map.getBlockId(blockPos);
        const isNextFluid = BLOCKS.hasComponent(FLUID_COMPONENT, blockId);

        // Break the previous block, as long as the next block is NOT a fluid.
        if (!isNextFluid)
        {
            emitBreakEvent(world, blockPos, prevBlockId);

            const isPrevFluid = BLOCKS.hasComponent(FLUID_COMPONENT, prevBlockId);
            if (!isPrevFluid)
            {
                onBlockBreak(world, blockPos, prevBlockId);
            }
        }
        else if (!BLOCKS.hasComponent(AIR_COMPONENT, prevBlockId))
        {
            // If it IS a fluid, then it should not replace anything but AIR.
            return;
        }

        world.map.setBlockId(blockPos, blockId);
        world.map.setBlockMeta(blockPos, blockMeta);

        if (!isNextFluid)
        {
            onBlockPlace$1(world, blockPos, blockId);
        }
        emitPlaceEvent(world, blockPos, blockId);
    }

    const GRASS_SOIL_COMPONENT = 'grassSoil';
    const GRASS_BLOCK_ID = 5;

    function initialize$1(world)
    {
        world.on(BLOCK_UPDATE_EVENT, onBlockUpdate);
    }

    function onBlockUpdate(world, chunk, blockPos)
    {
        const worldMap = world.map;
        let blockId = worldMap.getBlockId(blockPos);
        if (BLOCKS.hasComponent(GRASS_SOIL_COMPONENT, blockId))
        {
            let upBlockId = worldMap.getBlockId(blockPos.up());
            if (BLOCKS.hasComponent(AIR_COMPONENT, upBlockId))
            {
                if (Random.next() < 0.001)
                {
                    placeBlock(world, blockPos, GRASS_BLOCK_ID);
                }
            }
        }
    }

    const MATERIAL_COMPONENT = 'material';

    const PLACE_SOUNDS = {};

    async function load$1(assets)
    {
        PLACE_SOUNDS.dirt = await Audio.loadAudio('arroyo/dirt.wav');
        PLACE_SOUNDS.stone = await Audio.loadAudio('arroyo/stone.wav');
        PLACE_SOUNDS.fluid = await Audio.loadAudio('arroyo/waterpop.wav');
        PLACE_SOUNDS.metal = await Audio.loadAudio('arroyo/ding.wav');
    }

    function playPlaceSound(blockId)
    {
        let material = getMaterial(blockId);
        switch(material)
        {
            case 'dirt':
                PLACE_SOUNDS.dirt.play({ pitch: Random.range(-5, 5) });
                break;
            case 'fluid':
                PLACE_SOUNDS.fluid.play({ pitch: Random.range(-5, 5) });
                break;
            case 'metal':
                PLACE_SOUNDS.metal.play({ gain: 4, pitch: Random.range(-5, 5) });
                break;
            case 'stone':
            default:
                PLACE_SOUNDS.stone.play({ gain: 1.5, pitch: Random.range(-5, 5) });
                break;
        }
    }

    function getMaterial(blockId)
    {
        if (BLOCKS.hasComponent(MATERIAL_COMPONENT, blockId))
        {
            return BLOCKS.getComponent(MATERIAL_COMPONENT, blockId);
        }
        else
        {
            return 'stone';
        }
    }

    const AIR_COMPONENT$1 = 'air';
    const FALLING_COMPONENT = 'falling';

    function initialize$2(world)
    {
        world.on(WORLD_UPDATE_EVENT, onWorldUpdate$1);
    }

    // TODO: What happens if it falls in water?
    // TODO: It should not update neighbor until it is stable.

    function onWorldUpdate$1(world)
    {
        let sortedChunks = sortChunksByBottomFirst$1(world.map.getLoadedChunks());

        for(let chunk of sortedChunks)
        {
            updateFallingInChunk(world, chunk);
        }
    }

    function sortChunksByBottomFirst$1(chunks)
    {
        return chunks.sort((a, b) => {
            if (a.chunkCoordY < b.chunkCoordY)
            {
                return 1;
            }
            else if (a.chunkCoordY > b.chunkCoordY)
            {
                return -1;
            }
            else if (a.chunkCoordX < b.chunkCoordX)
            {
                return 1;
            }
            else if (a.chunkCoordX > b.chunkCoordX)
            {
                return -1;
            }
            else
            {
                return 0;
            }
        });
    }

    function updateFallingInChunk(world, chunk)
    {
        const worldMap = world.map;
        const chunkX = chunk.chunkCoordX * worldMap.chunkWidth;
        const chunkY = chunk.chunkCoordY * worldMap.chunkHeight;

        // Do falling physics.
        let blockPos = worldMap.at(0, 0);
        for(let y = worldMap.chunkHeight - 1; y >= 0; --y)
        {
            for(let x = 0; x < worldMap.chunkWidth; ++x)
            {
                blockPos.set(x + chunkX, y + chunkY);
                let blockId = worldMap.getBlockId(blockPos);
                if (BLOCKS.hasComponent(FALLING_COMPONENT, blockId))
                {
                    updateFallingBlock(world, blockPos);
                }
            }
        }
    }

    function updateFallingBlock(world, blockPos)
    {
        const worldMap = world.map;
        if (!tryFallingDown(worldMap, blockPos))
        ;
    }

    function tryFallingDown(worldMap, blockPos)
    {
        let toBlockPos = blockPos.copy().down();
        return fallBlock(worldMap, blockPos, toBlockPos);
    }

    function fallBlock(worldMap, fromBlockPos, toBlockPos)
    {
        if (!worldMap.isWithinBounds(toBlockPos)) return false;
        if (!worldMap.isWithinLoaded(toBlockPos))
        {
            worldMap.setBlockId(fromBlockPos, 0);
            return true;
        }
        
        let fromBlock = worldMap.getBlockId(fromBlockPos);
        let toBlock = worldMap.getBlockId(toBlockPos);

        if (BLOCKS.hasComponent(AIR_COMPONENT$1, toBlock))
        {
            worldMap.setBlockId(toBlockPos, fromBlock)
                .setBlockId(fromBlockPos, 0);
            return true;
        }
    }

    const IMINO = [
        { w: 1, h: 4, m: [1, 1, 1, 1] },
        { w: 4, h: 1, m: [1, 1, 1, 1] },
    ];
    const OMINO = [
        { w: 2, h: 2, m: [1, 1, 1, 1] },
    ];
    const TMINO = [
        { w: 3, h: 2, m: [0, 1, 0, 1, 1, 1] },
        { w: 2, h: 3, m: [1, 0, 1, 1, 1, 0] },
        { w: 3, h: 2, m: [1, 1, 1, 0, 1, 0] },
        { w: 2, h: 3, m: [0, 1, 1, 1, 0, 1] },
    ];
    const LMINO = [
        { w: 2, h: 3, m: [1, 0, 1, 0, 1, 1] },
        { w: 3, h: 2, m: [0, 0, 1, 1, 1, 1] },
        { w: 2, h: 3, m: [1, 1, 0, 1, 0, 1] },
        { w: 3, h: 2, m: [1, 1, 1, 1, 0, 0] },
    ];
    const JMINO = [
        { w: 2, h: 3, m: [0, 1, 0, 1, 1, 1] },
        { w: 3, h: 2, m: [1, 0, 0, 1, 1, 1] },
        { w: 2, h: 3, m: [1, 1, 1, 0, 1, 0] },
        { w: 3, h: 2, m: [1, 1, 1, 0, 0, 1] },
    ];
    const ZMINO = [
        { w: 3, h: 2, m: [1, 1, 0, 0, 1, 1] },
        { w: 2, h: 3, m: [0, 1, 1, 1, 1, 0] },
    ];
    const SMINO = [
        { w: 3, h: 2, m: [0, 1, 1, 1, 1, 0] },
        { w: 2, h: 3, m: [1, 0, 1, 1, 0, 1] },
    ];

    const ALL = [
        IMINO,
        OMINO,
        TMINO,
        JMINO,
        LMINO,
        SMINO,
        ZMINO,
    ];

    let minw = Infinity;
    let minh = Infinity;
    let maxw = 1;
    let maxh = 1;
    for(let tetromino of ALL)
    {
        for(let shape of tetromino)
        {
            minw = Math.min(shape.w, minw);
            minh = Math.min(shape.h, minh);
            maxw = Math.max(shape.w, maxw);
            maxh = Math.max(shape.h, maxh);
        }
    }
    const MAX_WIDTH = maxw;
    const MAX_HEIGHT = maxh;

    const RESPAWN_PLACEMENT_TICKS = 30;
    const PLACEMENT_BLOCK_IDS = [
        1, 3, 4, 6, 7, 8, 9, 10, 11, 12
    ];

    function initialize$3()
    {
        return {
            placing: false,
            floating: true,
            shape: null,
            shapeType: null,
            shapeMap: new ChunkMap(0, 0, MAX_WIDTH, MAX_HEIGHT),
            value: 0,
            placeX: 0,
            placeY: 0,
            placeTicks: 0,
        };
    }

    function update(dt, state, placeInput, rotateInput, world, cx, cy, onplace, onreset)
    {
        const worldMap = world.map;

        // Block placement
        if (state.placing)
        {
            const shape = state.shape;

            const nextPlaceX = Math.min(worldMap.bounds.right - shape.w, Math.max(worldMap.bounds.left, cx - Math.floor((shape.w - 1) / 2)));
            const nextPlaceY = Math.min(worldMap.bounds.bottom - shape.h, Math.max(worldMap.bounds.top, cy - Math.floor((shape.h - 1) / 2)));

            if (state.floating)
            {
                const dx = Math.sign(nextPlaceX - state.placeX);
                const dy = Math.sign(nextPlaceY - state.placeY);
                if (!intersectBlock(shape, state.placeX + dx, state.placeY + dy, worldMap))
                {
                    state.floating = false;
                }
                state.placeX += dx;
                state.placeY += dy;
                state.valid = false;
            }
            else
            {
                const prevPlaceX = state.placeX;
                if (prevPlaceX < nextPlaceX)
                {
                    if (!intersectBlock(shape, prevPlaceX + 1, state.placeY, worldMap))
                    {
                        state.placeX += 1;
                    }
                }
                else if (prevPlaceX > nextPlaceX)
                {
                    if (!intersectBlock(shape, prevPlaceX - 1, state.placeY, worldMap))
                    {
                        state.placeX -= 1;
                    }
                }
        
                const prevPlaceY = state.placeY;
                if (prevPlaceY < nextPlaceY)
                {
                    if (!intersectBlock(shape, state.placeX, prevPlaceY + 1, worldMap))
                    {
                        state.placeY += 1;
                    }
                }
                else if (prevPlaceY > nextPlaceY)
                {
                    if (!intersectBlock(shape, state.placeX, prevPlaceY - 1, worldMap))
                    {
                        state.placeY -= 1;
                    }
                }

                state.valid = canPlaceBlockShape(state.value, shape, state.placeX, state.placeY, worldMap);
            }
        }

        // Try placing and rotating
        if (state.placeTicks <= 0)
        {
            if (state.placing)
            {
                if (placeInput.value && state.valid)
                {
                    placeBlockShape(state.value, state.shape, state.placeX, state.placeY, world);
                    state.placing = false;
                    state.placeTicks = RESPAWN_PLACEMENT_TICKS;

                    onplace(state);
                }

                if (rotateInput.value)
                {
                    state.placing = false;
                }
            }
            else
            {
                randomizePlacement(state);
                state.placing = true;
                state.floating = true;
                state.valid = false;

                onreset(state);
            }
        }
        else
        {
            state.placeTicks -= dt;
        }
    }

    function intersectBlock(blockShape, blockX, blockY, worldMap)
    {
        const { w, h, m } = blockShape;
        let blockPos = worldMap.at(0, 0);
        for(let y = 0; y < h; ++y)
        {
            for(let x = 0; x < w; ++x)
            {
                let i = x + y * w;
                if (m[i])
                {
                    blockPos.set(x + blockX, y + blockY);
                    if (!worldMap.isWithinLoaded(blockPos))
                    {
                        continue;
                    }

                    let blockId = worldMap.getBlockId(blockPos);
                    if (BLOCKS.hasComponent(FLUID_COMPONENT, blockId))
                    {
                        if (worldMap.getBlockMeta(blockPos) >= MAX_FLUID_LEVELS)
                        {
                            return true;
                        }
                    }
                    else if (!BLOCKS.hasComponent(AIR_COMPONENT, blockId))
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function canPlaceBlockShape(blockValue, blockShape, blockX, blockY, worldMap)
    {
        if (BLOCKS.hasComponent(FLUID_COMPONENT, blockValue)) return true;
        
        let blockPos = worldMap.at(blockX, blockY);
        const { w, h, m } = blockShape;
        for(let y = 0; y < h; ++y)
        {
            for(let x = 0; x < w; ++x)
            {
                blockPos.set(x + blockX, y + blockY);
                let i = x + y * w;
                if (m[i])
                {
                    if (!worldMap.isWithinLoaded(blockPos))
                    {
                        continue;
                    }
                    if (worldMap.getBlockNeighbor(blockPos) !== 0b1111)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function placeBlockShape(blockId, blockShape, blockX, blockY, world)
    {
        const { w, h, m } = blockShape;
        let blockPos = world.map.at(0, 0);
        for(let y = 0; y < h; ++y)
        {
            for(let x = 0; x < w; ++x)
            {
                let i = x + y * w;
                if (m[i])
                {
                    blockPos.set(x + blockX, y + blockY);
                    placeBlock(world, blockPos, blockId);
                }
            }
        }
    }

    function setBlockShape(blockId, blockShape, blockX, blockY, shapeMap)
    {
        const { w, h, m } = blockShape;
        let blockPos = shapeMap.at(0, 0);
        for(let y = 0; y < h; ++y)
        {
            for(let x = 0; x < w; ++x)
            {
                let i = x + y * w;
                if (m[i])
                {
                    blockPos.set(x + blockX, y + blockY);
                    shapeMap.setBlockId(blockPos, blockId);
                }
            }
        }
    }

    function randomizePlacement(state)
    {
        const shapeType = Random.choose(ALL);
        const shapeIndex = Math.floor(Random.range(0, shapeType.length));

        const currentBlockId = state.value;
        let flag = false;
        switch(currentBlockId)
        {
            case 0:
                flag = true;
                break;
            case 1: // Water
                flag = Random.next() < (1 / 4);
                break;
            case 3: // Dirt
                flag = Random.next() < (1 / 8);
                break;
            case 4: // Gold
                flag = Random.next() < (1 / 4);
                break;
            case 6: // Stone
                flag = Random.next() < (1 / 8);
                break;
            default:
                flag = Random.next() < (1 / 6);
                break;
        }

        const nextBlockId = flag ? Random.choose(PLACEMENT_BLOCK_IDS) : currentBlockId;
        state.value = nextBlockId;
        state.shapeType = shapeType;
        state.shape = shapeType[shapeIndex];
        state.shapeMap.clear();
        setBlockShape(nextBlockId, state.shape, 0, 0, state.shapeMap);
    }

    function getPlacementSpawnPosition(
        cursorX, cursorY, blockSize,
        displayWidth, displayHeight,
        viewMatrix, projectionMatrix)
    {
        let resultX = 0;
        let resultY = 0;
        
        const quadIndex = (cursorX <= 0.5 ? 0 : 2) + (cursorY <= 0.5 ? 0 : 1);
        switch(quadIndex)
        {
            case 0: // TopLeft
            {
                let corner = Camera2D.screenToWorld(
                    0, 0,
                    viewMatrix, projectionMatrix
                );
                resultX = corner[0];
                resultY = corner[1];
            }
            break;
            case 1: // BottomLeft
            {
                let corner = Camera2D.screenToWorld(
                    0, displayHeight,
                    viewMatrix, projectionMatrix
                );
                resultX = corner[0];
                resultY = corner[1];
            }
            break;
            case 2: // TopRight
            {
                let corner = Camera2D.screenToWorld(
                    displayWidth, 0,
                    viewMatrix, projectionMatrix
                );
                resultX = corner[0];
                resultY = corner[1];
            }
            break;
            case 3: // BottomRight
            {
                let corner = Camera2D.screenToWorld(
                    displayWidth, displayHeight,
                    viewMatrix, projectionMatrix
                );
                resultX = corner[0];
                resultY = corner[1];
            }
            break;
        }

        return [
            Math.floor(resultX / blockSize),
            Math.floor(resultY / blockSize)
        ];
    }

    function loadWorld(world, worldData)
    {
        const chunkWidth = world.map.chunkWidth;
        const chunkHeight = world.map.chunkHeight;
        if (chunkWidth !== worldData.chunkWidth || chunkHeight !== worldData.chunkHeight) return null;

        world.score = worldData.score || 0;
        world.cameraX = worldData.cameraX || 0;
        world.cameraY = worldData.cameraY || 0;

        const length = chunkWidth * chunkHeight;
        for(let chunkId of Object.keys(worldData.chunks))
        {
            const chunkData = worldData.chunks[chunkId];
            const [chunkCoordX, chunkCoordY] = toChunkCoords(chunkId);

            let data = new ChunkData(chunkWidth, chunkHeight);
            for(let i = 0; i < length; ++i)
            {
                data.block[i] = chunkData.block[i];
                data.meta[i] = chunkData.meta[i];
                data.neighbor[i] = chunkData.neighbor[i];
            }
            let chunk = new Chunk(this, chunkId, chunkCoordX, chunkCoordY, data);
            world.map.chunks[chunkId] = chunk;
        }

        return world;
    }

    function saveWorld(world, worldData)
    {
        const chunkWidth = world.map.chunkWidth;
        const chunkHeight = world.map.chunkHeight;

        worldData.score = world.score;
        worldData.cameraX = world.cameraX;
        worldData.cameraY = world.cameraY;
        worldData.chunkWidth = chunkWidth;
        worldData.chunkHeight = chunkHeight;
        
        let chunks = {};
        const length = chunkWidth * chunkHeight;
        for(let chunk of world.map.getLoadedChunks())
        {
            const chunkId = chunk.chunkId;
            let data = {
                block: new Array(length),
                meta: new Array(length),
                neighbor: new Array(length),
            };
            for(let i = 0; i < length; ++i)
            {
                data.block[i] = chunk.data.block[i];
                data.meta[i] = chunk.data.meta[i];
                data.neighbor[i] = chunk.data.neighbor[i];
            }
            chunks[chunkId] = data;
        }

        worldData.chunks = chunks;
        return worldData;
    }

    // TODO: Move the camera towards the placed block each time.
    // TODO: Regionize the block maps.
    // TODO: Multiple fluids?
    // TODO: Sound?
    // TODO: Trees? Plants?
    // TODO: Sunlight? Light map.

    document.addEventListener('DOMContentLoaded', main);

    const MAX_BLOCK_TICKS = 10;
    const MAX_AUTO_SAVE_TICKS = 100;
    const MAX_FADE_IN_TICKS = 300;
    const BLOCK_SIZE = 4;

    const SOUNDS = {};

    async function load$2(assets)
    {
        const assetsDir = '';
        SOUNDS.flick = await Audio.loadAudio(assetsDir + 'arroyo/flick.wav');
        SOUNDS.melt = await Audio.loadAudio(assetsDir + 'arroyo/melt.mp3');

        SOUNDS.reset = SOUNDS.flick;
        SOUNDS.background = SOUNDS.melt;

        await load();
    }

    async function main()
    {
        const display = document.querySelector('display-port');
        const input = document.querySelector('input-context');

        const CursorX = input.getInput('cursorX');
        const CursorY = input.getInput('cursorY');
        const Place = input.getInput('place');
        const Rotate = input.getInput('rotate');
        const Debug = input.getInput('debug');
        const Reset = input.getInput('reset');
        const Save = input.getInput('save');
        const Load = input.getInput('load');

        const ctx = display.canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        await load$2();
        await load$1();

        const view = new CanvasView();
        const camera = new Camera2D();

        // Initialize world
        const world = {
            map: new ChunkMap(),
            score: 0,
            cameraX: 0,
            cameraY: 0,
            time: 0,
            firstPlace: true,
        };
        Eventable$1.assign(world);

        // Initialize systems
        initialize(world);
        initialize$1(world);
        initialize$2(world);

        let worldData = localStorage.getItem('worldData');
        if (!worldData || !loadWorld(world, JSON.parse(worldData)))
        {
            initializeWorld(world, display);
        }

        let blockTicks = 0;
        let autoSaveTicks = 0;

        const cameraSpeed = 0.1;
        camera.moveTo(world.cameraX, world.cameraY);

        let placement = initialize$3();

        display.addEventListener('frame', e => {
            const dt = e.detail.deltaTime / 1000 * 60;
            
            // Reset world
            if (Reset.value)
            {
                localStorage.removeItem('worldData');
                world.map.clear();
                initializeWorld(world, display);
                return;
            }
            // Save world
            else if (Save.value)
            {
                let worldData = saveWorld(world, {});
                Downloader.downloadText('worldData.json', JSON.stringify(worldData));
            }
            // Load world
            else if (Load.value)
            {
                Uploader.uploadFile(['.json'], false)
                    .then(fileBlob => fileBlob.text())
                    .then(textData => {
                        let worldData = JSON.parse(textData);
                        world.map.clear();
                        if (!worldData || !loadWorld(world, worldData))
                        {
                            initializeWorld(world, display);
                        }
                    });
            }
            else
            {
                world.time += dt;
            }

            // Update camera
            {
                let aspectRatio = display.width / display.height;
                let cw = aspectRatio <= 1 ? aspectRatio : 1;
                let ch = aspectRatio <= 1 ? 1 : 1 / aspectRatio;
                let cx = (CursorX.value - 0.5);
                let cy = (CursorY.value - 0.5);

                const cameraOffsetAmount = 4;
                let radian = Math.atan2(cy, cx);
                let distance = distance2(0, 0, cx, cy);
                let clampDist = distance < 0.3 ? 0 : distance - 0.3;
                let cameraOffsetX = Math.cos(radian) * clampDist * BLOCK_SIZE * world.map.chunkWidth * cw * cameraOffsetAmount;
                let cameraOffsetY = Math.sin(radian) * clampDist * BLOCK_SIZE * world.map.chunkWidth * ch * cameraOffsetAmount;
                camera.moveTo(
                    lerp$1(camera.x, world.cameraX + cameraOffsetX, dt * cameraSpeed),
                    lerp$1(camera.y, world.cameraY + cameraOffsetY, dt * cameraSpeed)
                );
            }

            let viewMatrix = camera.getViewMatrix();
            let projectionMatrix = camera.getProjectionMatrix();

            // Cursor worldPos
            const [cursorX, cursorY] = Camera2D.screenToWorld(CursorX.value * display.width, CursorY.value * display.height, viewMatrix, projectionMatrix);
            const nextPlaceX = Math.floor(cursorX / BLOCK_SIZE);
            const nextPlaceY = Math.floor(cursorY / BLOCK_SIZE);

            function onPlace(placeState)
            {
                // Move towards placement
                const [centerX, centerY] = Camera2D.screenToWorld(display.width / 2, display.height / 2, viewMatrix, projectionMatrix);
                const centerCoordX = Math.floor(centerX / BLOCK_SIZE);
                const centerCoordY = Math.floor(centerY / BLOCK_SIZE);
                let dx = Math.ceil((placeState.placeX - centerCoordX) / 4);
                let dy = Math.ceil((placeState.placeY - centerCoordY) / 4);
                world.cameraX += dx * BLOCK_SIZE;
                world.cameraY += dy * BLOCK_SIZE;
                world.score += 1;

                playPlaceSound(placeState.value);

                if (world.firstPlace)
                {
                    world.firstPlace = false;
                    SOUNDS.background.play();
                }
            }

            function onReset(placeState)
            {
                let [resetPlaceX, resetPlaceY] = getPlacementSpawnPosition(
                    CursorX.value, CursorY.value, BLOCK_SIZE,
                    display.width, display.height,
                    viewMatrix, projectionMatrix
                );
                placeState.placeX = resetPlaceX;
                placeState.placeY = resetPlaceY;
                SOUNDS.reset.play({ pitch: Random.range(-5, 5) });
            }

            update(dt, placement, Place, Rotate, world, nextPlaceX, nextPlaceY, onPlace, onReset);

            emitUpdateEvent(world);

            // Compute block physics
            if (blockTicks <= 0)
            {
                blockTicks = MAX_BLOCK_TICKS;

                // if (Debug.value)
                {
                    emitWorldUpdateEvent(world);

                    const chunks = world.map.getLoadedChunks();
                    const chunkWidth = world.map.chunkWidth;
                    const chunkHeight = world.map.chunkHeight;
                    
                    let blockPos = world.map.at(0, 0);
                    for(let chunk of chunks)
                    {
                        const chunkX = chunk.chunkCoordX * chunkWidth;
                        const chunkY = chunk.chunkCoordY * chunkHeight;
                        emitChunkUpdateEvent(world, chunk);
                        
                        for(let y = 0; y < chunkHeight; ++y)
                        {
                            for(let x = 0; x < chunkWidth; ++x)
                            {
                                blockPos.set(x + chunkX, y + chunkY);
                                emitBlockUpdateEvent(world, chunk, blockPos);
                            }
                        }
                    }
                }
            }
            else
            {
                blockTicks -= dt;
            }

            // AutoSave
            if (autoSaveTicks <= 0)
            {
                autoSaveTicks = MAX_AUTO_SAVE_TICKS;
                let worldData = saveWorld(world, {});
                localStorage.setItem('worldData', JSON.stringify(worldData));
            }
            else
            {
                autoSaveTicks -= dt;
            }

            ctx.clearRect(0, 0, display.width, display.height);
            view.begin(ctx, viewMatrix, projectionMatrix);
            {
                drawChunkMap(ctx, world.map, BLOCK_SIZE);

                if (placement.placing)
                {
                    ctx.translate(placement.placeX * BLOCK_SIZE, placement.placeY * BLOCK_SIZE);
                    {
                        drawPlacement(ctx, placement, BLOCK_SIZE);
                    }
                    ctx.translate(-placement.placeX * BLOCK_SIZE, -placement.placeY * BLOCK_SIZE);
                }
            }
            view.end(ctx);

            if (world.time < MAX_FADE_IN_TICKS)
            {
                ctx.fillStyle = `rgba(0, 0, 0, ${1 - (world.time / MAX_FADE_IN_TICKS)})`;
                ctx.fillRect(0, 0, display.width, display.height);
            }

            ctx.fillStyle = 'white';
            ctx.fillText(world.score, 4, 12);
        });
    }

    function initializeWorld(world, display)
    {
        // Initialize new world
        world.score = 0;
        world.time = 0;
        world.firstPlace = true;
        
        let blockPos = world.map.at(0, 0);
        let out = blockPos.clone();
        placeBlock(world, blockPos, GOLD.blockId);
        placeBlock(world, blockPos.offset(out, -1, 0), GOLD.blockId);
        placeBlock(world, blockPos.offset(out, 0, -1), GOLD.blockId);
        placeBlock(world, blockPos.offset(out, -1, -1), GOLD.blockId);

        world.cameraX = -display.width / 2;
        world.cameraY = -display.height / 2;
    }

}());
//# sourceMappingURL=index.js.map
