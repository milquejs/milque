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

    async function loadBytes(filepath, opts)
    {
        let result = await fetch(filepath);
        let buffer = await result.arrayBuffer();
        return buffer;
    }

    async function loadJSON(filepath, opts)
    {
        let result = await fetch(filepath);
        let json = await result.json();
        return json;
    }

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

    const AUDIO_CONTEXT = new AudioContext();
    autoUnlock(AUDIO_CONTEXT);

    async function autoUnlock(ctx)
    {
        const callback = () => {
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
        };
        document.addEventListener('click', callback);
    }

    // https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

    /**
     * @typedef Bounds
     * @property {Number} x The center x position.
     * @property {Number} y The center y position.
     * @property {Number} rx The half width of the bounds.
     * @property {Number} ry The half height of the bounds.
     */

    const MAX_OBJECTS = 10;
    const MAX_LEVELS = 5;

    /**
     * A quadtree to help your sort boxes by proximity (in quadrants). Usually, this is used
     * like this:
     * 1. Clear the tree to be empty.
     * 2. Add all the boxes. They should be in the shape of {@link Bounds}.
     * 3. For each target box you want to check for, call {@link retrieve()}.
     * 4. The previous function should return a list of potentially colliding boxes. This is
     * where you should use a more precise intersection test to accurately determine if the
     * result is correct.
     * 
     * ```js
     * // Here is an example
     * quadTree.clear();
     * quadTree.insertAll(boxes);
     * let out = [];
     * for(let box of boxes)
     * {
     *   quadTree.retrieve(box, out);
     *   for(let other of out)
     *   {
     *     // Found a potential collision between box and other.
     *     // Run your collision detection algorithm for them here.
     *   }
     *   out.length = 0;
     * }
     * ```
     */
    class QuadTree
    {
        /**
         * Creates bounds for the given dimensions.
         * 
         * @param {Number} x The center x position.
         * @param {Number} y The center y position.
         * @param {Number} rx The half width of the bounds.
         * @param {Number} ry The half height of the bounds.
         * @returns {Bounds} The newly created bounds.
         */
        static createBounds(x, y, rx, ry)
        {
            return { x, y, rx, ry };
        }

        /**
         * Constructs an empty quadtree.
         * 
         * @param {Number} [level] The root level for this tree.
         * @param {Bounds} [bounds] The bounds of this tree.
         */
        constructor(
            level = 0,
            bounds = QuadTree.createBounds(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
        {
            this.level = level;
            this.bounds = bounds;

            this.boxes = [];
            this.nodes = new Array(4);
        }

        /**
         * Inserts all the boxes into the tree.
         * 
         * @param {Array<Buonds>} boxes A list of boxes.
         */
        insertAll(boxes)
        {
            for(let box of boxes)
            {
                this.insert(box);
            }
        }

        /**
         * Inserts the box into the tree.
         * 
         * @param {Bounds} box A box.
         */
        insert(box)
        {
            let hasNode = this.nodes[0];

            if (hasNode)
            {
                let quadIndex = this.findQuadIndex(box);
                if (quadIndex >= 0)
                {
                    this.nodes[quadIndex].insert(box);
                    return;
                }
            }

            this.boxes.push(box);

            if (this.boxes.length > MAX_OBJECTS && this.level < MAX_LEVELS)
            {
                if (!hasNode) this.split();

                for(let i = this.boxes.length - 1; i >= 0; --i)
                {
                    let otherBox = this.boxes[i];
                    let quadIndex = this.findQuadIndex(otherBox);
                    if (quadIndex >= 0)
                    {
                        this.boxes.splice(i, 1);
                        this.nodes[quadIndex].insert(otherBox);
                    }
                }
            }
        }

        /**
         * Retrieves all the near boxes for the target.
         * 
         * @param {Bounds} box The target box to get all near boxes for.
         * @param {Array<Bounds>} [out=[]] The list to append results to.
         * @param {Object} [opts] Any additional options.
         * @param {Boolean} [opts.includeSelf=false] Whether to include the
         * target in the result list.
         * @returns {Array<Bounds>} The appended list of results.
         */
        retrieve(box, out = [], opts = {})
        {
            const { includeSelf = false } = opts;

            if (this.nodes[0])
            {
                let quadIndex = this.findQuadIndex(box);
                if (quadIndex >= 0)
                {
                    this.nodes[quadIndex].retrieve(box, out);
                }
            }

            let boxes = this.boxes;
            if (!includeSelf)
            {
                // Append all elements before the index (or none, if not found)...
                let targetIndex = boxes.indexOf(box);
                for(let i = 0; i < targetIndex; ++i)
                {
                    out.push(boxes[i]);
                }
                // Append all elements after the index (or from 0, if not found)...
                let length = boxes.length;
                for(let i = targetIndex + 1; i < length; ++i)
                {
                    out.push(boxes[i]);
                }
            }
            else
            {
                out.push(...boxes);
            }
            return out;
        }

        /**
         * Removes all boxes form the tree.
         */
        clear()
        {
            this.boxes.length = 0;

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

        /** @private */
        split()
        {
            let { x, y, rx, ry } = this.bounds;
            let nextLevel = this.level + 1;

            let ChildConstructor = this.constructor;

            this.nodes[0] = new ChildConstructor(nextLevel, QuadTree.createBounds(x + rx, y, rx, ry));
            this.nodes[1] = new ChildConstructor(nextLevel, QuadTree.createBounds(x, y, rx, ry));
            this.nodes[2] = new ChildConstructor(nextLevel, QuadTree.createBounds(x, y + ry, rx, ry));
            this.nodes[3] = new ChildConstructor(nextLevel, QuadTree.createBounds(x + rx, y + ry, rx, ry));
        }

        /** @private */
        findQuadIndex(box)
        {
            const { x: bx, y: by, rx: brx, ry: bry } = this.bounds;
            const midpointX = bx + brx;
            const midpointY = by + bry;

            const { x, y, rx, ry } = box;
            const isTop = y < midpointY && y + ry * 2 < midpointY;
            const isBottom = y > midpointY;
            const isLeft = x < midpointX && x + rx * 2 < midpointX;
            const isRight= x > midpointX;

            let index = -1;
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
    }

    function createHitResult(x, y, dx, dy, nx, ny, time)
    {
        return {
            x, y,
            dx, dy,
            nx, ny,
            time,
        };
    }

    function intersectAxisAlignedBoundingBox(a, b)
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
            return createHitResult(a.x + (a.rx * sx), b.y, px * sx, 0, sx, 0, 0);
        }
        else
        {
            let sy = Math.sign(dy);
            return createHitResult(b.x, a.y + (a.ry * sy), 0, py * sy, 0, sy, 0);
        }
    }

    /**
     * @typedef Mask
     * @property {Object} owner
     * @property {AxisAlignedBoundingBox} box
     * @property {Function} get
     */

    /**
     * The property key for masks to keep count of how many are
     * still available.
     */
    const MASK_COUNT = Symbol('maskCount');

    /** An axis-aligned graph for effeciently solving box collisions. */
    class AxisAlignedBoundingBoxGraph
    {
        /**
         * Constructs an empty graph.
         * 
         * @param {Object} [opts={}] Any additional options.
         */
        constructor(opts = {})
        {
            this.masks = new Map();
            this.boxes = new Set();
            
            // Used to store dynamic mask data and provide constant lookup.
            this.dynamics = new Map();
            // Used for efficiently pruning objects when solving.
            this.quadtree = new QuadTree();
        }

        add(owner, maskName, maskValues = {})
        {
            let mask = {
                owner,
                box: null,
                get: null,
            };

            if (!this.masks.has(owner))
            {
                this.masks.set(owner, {
                    [MASK_COUNT]: 1,
                    [maskName]: mask,
                });
            }
            else if (!(maskName in this.masks.get(owner)))
            {
                let ownedMasks = this.masks.get(owner);
                ownedMasks[maskName] = mask;
                ownedMasks[MASK_COUNT]++;
            }
            else
            {
                throw new Error(`Mask ${maskName} already exists for owner.`);
            }

            if (Array.isArray(maskValues))
            {
                const x = maskValues[0] || 0;
                const y = maskValues[1] || 0;
                const rx = (maskValues[2] / 2) || 0;
                const ry = (maskValues[3] / 2) || 0;
                let box = new AxisAlignedBoundingBox(this, owner, maskName, x, y, rx, ry);
                this.boxes.add(box);
                mask.box = box;
            }
            else if (typeof maskValues === 'object')
            {
                let x = maskValues.x || 0;
                let y = maskValues.y || 0;
                let rx = maskValues.rx || (maskValues.width / 2) || 0;
                let ry = maskValues.ry || (maskValues.height / 2) || 0;
                if (typeof owner === 'object')
                {
                    if (!x) x = owner.x || 0;
                    if (!y) y = owner.y || 0;
                    if (!rx) rx = (owner.width / 2) || 0;
                    if (!ry) ry = (owner.height / 2) || 0;
                }
                let box = new AxisAlignedBoundingBox(this, owner, maskName, x, y, rx, ry);
                this.boxes.add(box);
                mask.box = box;
                if ('get' in maskValues)
                {
                    mask.get = maskValues.get;
                    mask.get(box, owner);
                    this.dynamics.set(mask, {
                        halfdx: 0,
                        halfdy: 0,
                    });
                }
            }
            else if (typeof maskValues === 'function')
            {
                let box = new AxisAlignedBoundingBox(this, owner, maskName, 0, 0, 0, 0);
                this.boxes.add(box);
                mask.box = box;
                mask.get = maskValues;
                mask.get(box, owner);
                this.dynamics.set(mask, {
                    halfdx: 0,
                    halfdy: 0,
                });
            }
            else
            {
                throw new Error('Invalid mask option type.');
            }
        }

        /**
         * @returns {Boolean} Whether the mask for the given name exists and was
         * removed from the owner.
         */
        remove(owner, maskName)
        {
            if (this.masks.has(owner))
            {
                let ownedMasks = this.masks.get(owner);
                let mask = ownedMasks[maskName];
                if (mask)
                {
                    if (mask.get) this.dynamics.delete(mask);
                    this.boxes.delete(mask.box);
                    ownedMasks[maskName] = null;

                    let count = --ownedMasks[MASK_COUNT];
                    if (count <= 0)
                    {
                        this.masks.delete(owner);
                    }
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        /** @returns {Mask} The owned mask for the given name. */
        get(owner, maskName)
        {
            if (this.masks.has(owner))
            {
                return this.masks.get(owner)[maskName];
            }
            else
            {
                return null;
            }
        }

        /** @returns {Number} The number of masks that belong to the owner. */
        count(owner)
        {
            if (this.masks.has(owner))
            {
                return this.masks.get(owner)[MASK_COUNT];
            }
            else
            {
                return 0;
            }
        }

        clear()
        {
            this.boxes.clear();
            this.masks.clear();
            this.dynamics.clear();
            this.quadtree.clear();
        }
        
        /**
         * Solves the current graph for collisions.
         * 
         * @param {Array<Object>} [targets=undefined] A list of active target to solve
         * for. If undefined or null, it will solve collisions using all boxes as
         * active targets. This can be used to prune box collisions that are not
         * relevant, or "active".
         * @returns {Array<CollisionResult>} The collisions found in the current graph.
         */
        solve(targets = undefined)
        {
            // Update dynamic boxes to include motions
            for(let mask of this.dynamics.keys())
            {
                let { box, owner } = mask; 
                let x0 = box.x;
                let y0 = box.y;
                mask.get(box, owner);
                let dynamics = this.dynamics.get(mask);
                let halfMotionX = (box.x - x0) / 2;
                let halfMotionY = (box.y - y0) / 2;
                dynamics.halfMotionX = halfMotionX;
                dynamics.halfMotionY = halfMotionY;
                box.x -= halfMotionX;
                box.y -= halfMotionY;
                box.rx += Math.abs(halfMotionX);
                box.ry += Math.abs(halfMotionY);
            }
            
            if (typeof targets === 'undefined' || targets === null)
            {
                targets = this.masks.keys();
            }

            let result = [];
            let quadtree = this.quadtree;
            quadtree.clear();
            quadtree.insertAll(this.boxes);

            // Revert dynamic boxes back to their original dimensions
            for(let mask of this.dynamics.keys())
            {
                const { box } = mask;
                const { halfMotionX, halfMotionY } = this.dynamics.get(mask);
                box.x += halfMotionX;
                box.y += halfMotionY;
                box.rx -= Math.abs(halfMotionX);
                box.ry -= Math.abs(halfMotionY);
            }

            let others = [];
            for(let owner of targets)
            {
                let ownedMasks = Object.values(this.masks.get(owner));
                for(let mask of ownedMasks)
                {
                    const { box } = mask;
                    quadtree.retrieve(box, others);
                    let dx = 0;
                    let dy = 0;
                    if (this.dynamics.has(mask))
                    {
                        const { halfMotionX, halfMotionY } = this.dynamics.get(mask);
                        dx = halfMotionX * 2;
                        dy = halfMotionY * 2;
                    }
                    for(let other of others)
                    {
                        let hit = intersectAxisAlignedBoundingBox(box, other);
                        if (hit)
                        {
                            result.push({
                                mask,
                                otherMask: this.masks.get(other.owner)[other.maskName],
                                box,
                                otherBox: other,
                                hit,
                                dx,
                                dy,
                            });
                        }
                    }
                    others.length = 0;
                }
            }
            return result;
        }
    }

    /**
     * A representative bounding box to keep positional and
     * dimensional metadata for any object in the
     * {@link AxisAlignedBoundingBoxGraph}.
     */
    class AxisAlignedBoundingBox
    {
        constructor(aabbGraph, owner, maskName, x, y, rx, ry)
        {
            this.aabbGraph = aabbGraph;
            this.owner = owner;
            this.maskName = maskName;
            this.x = x;
            this.y = y;
            this.rx = rx;
            this.ry = ry;
        }

        setPosition(x, y)
        {
            this.x = x;
            this.y = y;
            return this;
        }

        setSize(width, height)
        {
            return this.setHalfSize(width / 2, height / 2);
        }

        setHalfSize(rx, ry)
        {
            this.rx = rx;
            this.ry = ry;
            return this;
        }
    }

    /**
     * @typedef {String} EntityId
     */

    const DEFAULT_PROPS = {};

    /**
     * Handles all entity and component mappings.
     */
    class EntityManager
    {
        /**
         * Constructs an empty entity manager with the given factories.
         * 
         * @param {Object} [opts={}] Any additional options.
         * @param {Object} [opts.componentFactoryMap={}] An object map of each component to its factory.
         * @param {Boolean} [opts.strictMode=false] Whether to enable error checking (and throwing).
         */
        constructor(opts = {})
        {
            const { componentFactoryMap = {}, strictMode = false } = opts;
            let factoryMap = {};
            let instances = {};
            for(let componentName in componentFactoryMap)
            {
                let factoryOption = componentFactoryMap[componentName];
                let create, destroy;
                try
                {
                    create = 'create' in factoryOption
                        ? factoryOption.create
                        : (typeof factoryOption === 'function'
                            ? factoryOption
                            : null);
                    destroy = 'destroy' in factoryOption
                        ? factoryOption.destroy
                        : null;
                }
                catch(e)
                {
                    throw new Error('Unsupported component factory options.');
                }
                factoryMap[componentName] = { owner: factoryOption, create, destroy };
                instances[componentName] = {};
            }
            this.factoryMap = factoryMap;
            this.instances = instances;
            this.entities = new Set();
            this.nextAvailableEntityId = 1;
            this.strictMode = strictMode;
        }

        create(entityId = undefined)
        {
            if (typeof entityId !== 'undefined')
            {
                if (typeof entityId !== 'string')
                {
                    throw new Error('Invalid type for entity id - must be a string.');
                }
            }
            else
            {
                entityId = String(this.nextAvailableEntityId++);
            }
            
            if (!this.entities.has(entityId))
            {
                this.entities.add(entityId);
                return entityId;
            }
            else
            {
                throw new Error(`Invalid duplicate entity id '${entityId}' allocated for new entity.`)
            }
        }

        destroy(entityId)
        {
            for(let componentName in this.instances)
            {
                this.remove(componentName, entityId);
            }
            this.entities.delete(entityId);
        }

        add(componentName, entityId, props = undefined)
        {
            if (!(componentName in this.factoryMap))
            {
                if (this.strictMode)
                {
                    throw new Error(`Missing component factory for '${componentName}'.`);
                }
                else
                {
                    this.factoryMap[componentName] = {
                        owner: {},
                        create: null,
                        destroy: null,
                    };
                    this.instances[componentName] = {};
                }
            }

            if (!(componentName in this.instances))
            {
                throw new Error(`Missing component instance mapping for '${componentName}'.`);
            }

            if (!this.entities.has(entityId))
            {
                throw new Error(`Entity '${entityId}' does not exist.`);
            }

            if (this.instances[componentName][entityId])
            {
                throw new Error(`Entity already has component '${componentName}'.`);
            }

            const { create } = this.factoryMap[componentName];
            let result = create
                ? create(typeof props !== 'undefined' ? props : DEFAULT_PROPS, entityId, this)
                : (props
                    ? {...props}
                    : {});
            if (result)
            {
                this.instances[componentName][entityId] = result;
            }
        }

        remove(componentName, entityId)
        {
            if (!(componentName in this.factoryMap))
            {
                if (this.strictMode)
                {
                    throw new Error(`Missing component factory for '${componentName}'.`);
                }
                else
                {
                    return;
                }
            }

            if (!(componentName in this.instances))
            {
                throw new Error(`Missing component instance mapping for '${componentName}'.`);
            }
            
            let entityComponents = this.instances[componentName];
            let componentValues = entityComponents[entityId];
            if (componentValues)
            {
                entityComponents[entityId] = null;
        
                const { destroy } = this.factoryMap[componentName];
                if (destroy) destroy(componentValues, entityId, this);
            }
        }

        /**
         * Finds the component for the given entity.
         * 
         * @param {String} componentName The name of the target component.
         * @param {EntityId} entityId The id of the entity to look in.
         * @returns {Object} The component found. If it does not exist, null
         * is returned instead.
         */
        get(componentName, entityId)
        {
            if (!(componentName in this.instances))
            {
                throw new Error(`Missing component instance mapping for '${componentName}'.`);
            }
            
            const entityComponents = this.instances[componentName];
            return entityComponents[entityId] || null;
        }
        
        /**
         * Checks whether the entity has the component.
         * 
         * @param {String} componentName The name of the target component.
         * @param {EntityId} entityId The id of the entity to look in.
         * @returns {Boolean} Whether the component exists for the entity.
         */
        has(componentName, entityId)
        {
            return componentName in this.instances && Boolean(this.instances[componentName][entityId]);
        }

        clear(componentName)
        {
            if (!(componentName in this.factoryMap))
            {
                if (this.strictMode)
                {
                    throw new Error(`Missing component factory for '${componentName}'.`);
                }
                else
                {
                    return;
                }
            }

            if (!(componentName in this.instances))
            {
                throw new Error(`Missing component instance mapping for '${componentName}'.`);
            }

            let entityComponents = this.instances[componentName];
            const { destroy } = this.factoryMap[componentName];
            if (destroy)
            {
                for(let entityId in entityComponents)
                {
                    let componentValues = entityComponents[entityId];
                    entityComponents[entityId] = null;

                    destroy(componentValues, componentName, entityId, this);
                }
            }
            this.instances[componentName] = {};
        }

        /**
         * Gets all the entity ids.
         * 
         * @returns {Set<EntityId>} The set of entity ids.
         */
        getEntityIds()
        {
            return this.entities;
        }

        getComponentFactory(componentName)
        {
            if (componentName in this.factoryMap)
            {
                return this.factoryMap[componentName].owner;
            }
            else
            {
                return null;
            }
        }

        getComponentNames()
        {
            return Object.keys(this.factoryMap);
        }

        getComponentEntityIds(componentName)
        {
            if (componentName in this.instances)
            {
                return Object.keys(this.instances[componentName]);
            }
            else
            {
                return [];
            }
        }
        
        getComponentInstances(componentName)
        {
            if (componentName in this.instances)
            {
                return Object.values(this.instances[componentName]);
            }
            else
            {
                return [];
            }
        }
    }

    const MAX_DEPTH_LEVEL = 100;

    /**
     * @callback WalkCallback Called for each node, before traversing its children.
     * @param {Object} child The current object.
     * @param {SceneNode} childNode The representative node for the current object.
     * @returns {WalkBackCallback|Boolean} If false, the walk will skip
     * the current node's children. If a function, it will be called after
     * traversing down all of its children.
     * 
     * @callback WalkBackCallback Called if returned by {@link WalkCallback}, after
     * traversing the current node's children.
     * @param {Object} child The current object.
     * @param {SceneNode} childNode The representative node for the current object.
     * 
     * @callback WalkChildrenCallback Called for each level of children, before
     * traversing its children. This is usually used to determine visit order.
     * @param {Array<SceneNode>} childNodes A mutable list of child nodes to be
     * visited.
     * @param {SceneNode} childNode The representative node for the current object.
     * This is also the parent of these children.
     */

    /**
     * A tree-like graph of nodes with n-children.
     */
    class SceneGraph
    {
        /**
         * Constructs an empty scene graph with nodes to be created from the given constructor.
         * 
         * @param {Object} [opts] Any additional options.
         * @param {typeof SceneNode} [opts.nodeConstructor] The scene node constructor that make up the graph.
         */
        constructor(opts = {})
        {
            this.nodeConstructor = opts.nodeConstructor || SceneNode;
            this.nodes = new Map();

            this.rootNodes = [];
        }

        /**
         * Adds an object to the scene graph.
         * 
         * @param {Object} child The child object to add.
         * @param {Object} [parent=null] The parent object to add the child under. If null,
         * the child will be inserted under the root node.
         * @returns {SceneNode} The scene node that represents the added child object.
         */
        add(child, parent = null)
        {
            if (child === null) throw new Error(`Cannot add null as child to scene graph.`);
            if (parent === null || this.nodes.has(parent))
            {
                let parentNode = parent === null ? null : this.nodes.get(parent);
                if (this.nodes.has(child))
                {
                    let childNode = this.nodes.get(child);
                    detach(childNode.parentNode, childNode, this);
                    attach(parentNode, childNode, this);
                    return childNode;
                }
                else
                {
                    let childNode = new (this.nodeConstructor)(this, child, null, []);
                    this.nodes.set(child, childNode);
                    attach(parentNode, childNode, this);
                    return childNode;
                }
            }
            else
            {
                throw new Error(`No node in scene graph exists for parent.`);
            }
        }

        /**
         * Removes an object from the scene graph, along with all
         * of its descendents.
         * 
         * @param {Object} child The child object to remove. If null, will clear
         * the entire graph.
         * @returns {Boolean} Whether any objects were removed from the scene.
         */
        remove(child)
        {
            if (child === null)
            {
                this.clear();
                return true;
            }
            else if (this.nodes.has(child))
            {
                let childNode = this.nodes.get(child);
                let parentNode = childNode.parentNode;
                detach(parentNode, childNode, this);
                walkImpl(this, childNode, 0, descendent => {
                    this.nodes.delete(descendent);
                });
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
         * Replaces the target object with the new child object in the graph,
         * inheriting its parent and children.
         * 
         * @param {Object} target The target object to replace. Cannot be null.
         * @param {Object} child The object to replace with. If null,
         * it will remove the target and the target's parent will adopt
         * its grandchildren.
         */
        replace(target, child)
        {
            if (target === null) throw new Error('Cannot replace null for child in scene graph.');
            if (this.nodes.has(target))
            {
                let targetNode = this.nodes.get(target);
                let targetParent = targetNode.parentNode;
                let targetChildren = [...targetNode.childNodes];

                // Remove target node from the graph
                detach(targetParent, targetNode, this);

                // Begin grafting the grandchildren by first removing...
                targetNode.childNodes.length = 0;

                if (child === null)
                {
                    // Reattach all grandchildren to target parent.
                    if (targetParent === null)
                    {
                        // As root children.
                        this.rootNodes.push(...targetChildren);
                    }
                    else
                    {
                        // As regular children.
                        targetParent.childNodes.push(...targetChildren);
                    }
                }
                else
                {
                    // Reattach all grandchildren to new child.
                    let childNode;
                    if (this.nodes.has(child))
                    {
                        childNode = this.nodes.get(child);

                        // Remove child node from prev parent
                        detach(childNode.parentNode, childNode, this);

                        // ...and graft them back.
                        childNode.childNodes.push(...targetChildren);
                    }
                    else
                    {
                        childNode = new (this.nodeConstructor)(this, child, null, targetChildren);
                        this.nodes.set(child, childNode);
                    }

                    // And reattach target parent to new child.
                    attach(targetParent, childNode, this);
                }
                
                // ...and graft them back.
                for(let targetChild of targetChildren)
                {
                    targetChild.parentNode = targetParent;
                }

                return child;
            }
            else if (target === null)
            {
                return this.replace(this.root.owner, child);
            }
            else
            {
                throw new Error('Cannot find target object to replace in scene graph.');
            }
        }

        /** Removes all nodes from the graph. */
        clear()
        {
            this.nodes.clear();
            this.rootNodes.length = 0;
        }

        /**
         * Gets the scene node for the given object.
         * 
         * @param {Object} child The object to retrieve the node for.
         * @returns {SceneNode} The scene node that represents the object.
         */
        get(child)
        {
            return this.nodes.get(child);
        }

        /**
         * Walks through every child node in the graph for the given
         * object's associated node.
         * 
         * @param {WalkCallback} callback The function called for each node
         * in the graph, in ordered traversal from parent to child.
         * @param {Object} [opts={}] Any additional options.
         * @param {Boolean} [opts.childrenOnly=true] Whether to skip traversing
         * the first node, usually the root, and start from its children instead.
         * @param {Function} [opts.childrenCallback] The function called before
         * walking through the children. This is usually used to determine the
         * visiting order.
         */
        walk(from, callback, opts = {})
        {
            const { childrenOnly = true, childrenCallback } = opts;
            if (from === null)
            {
                sortChildrenForWalk(this.nodes, this.rootNodes, null, childrenCallback);
                for(let childNode of this.rootNodes)
                {
                    walkImpl(this, childNode, 0, callback, childrenCallback);
                }
            }
            else
            {
                const fromNode = this.get(from);
                if (!fromNode)
                {
                    if (childrenOnly)
                    {
                        sortChildrenForWalk(this.nodes, fromNode.childNodes, fromNode, childrenCallback);
                        for(let childNode of fromNode.childNodes)
                        {
                            walkImpl(this, childNode, 0, callback, childrenCallback);
                        }
                    }
                    else
                    {
                        walkImpl(this, fromNode, 0, callback, childrenCallback);
                    }
                }
                else
                {
                    throw new Error(`No node in scene graph exists for walk start.`);
                }
            }
        }
    }

    function attach(parentNode, childNode, sceneGraph)
    {
        if (parentNode === null)
        {
            sceneGraph.rootNodes.push(childNode);
            childNode.parentNode = null;
        }
        else
        {
            parentNode.childNodes.push(childNode);
            childNode.parentNode = parentNode;
        }
    }

    function detach(parentNode, childNode, sceneGraph)
    {
        if (parentNode === null)
        {
            let index = sceneGraph.rootNodes.indexOf(childNode);
            sceneGraph.rootNodes.splice(index, 1);
            childNode.parentNode = undefined;
        }
        else
        {
            let index = parentNode.childNodes.indexOf(childNode);
            parentNode.childNodes.splice(index, 1);
            childNode.parentNode = undefined;
        }
    }

    /**
     * Walk down from the parent and through all its descendents.
     * 
     * @param {SceneNode} parentNode The parent node to start walking from.
     * @param {Number} level The current call depth level. This is used to limit the call stack.
     * @param {WalkCallback} nodeCallback The function called on each visited node.
     * @param {WalkChildrenCallback} [childrenCallback] The function called before
     * walking through the children. This is usually used to determine the visiting order.
     */
    function walkImpl(sceneGraph, parentNode, level, nodeCallback, childrenCallback = undefined)
    {
        if (level >= MAX_DEPTH_LEVEL) return;

        let result = nodeCallback(parentNode.owner, parentNode);
        if (result === false) return;

        let nextNodes = parentNode.childNodes;
        if (childrenCallback)
        {
            sortChildrenForWalk(sceneGraph.nodes, nextNodes, parentNode, childrenCallback);
        }

        for(let childNode of nextNodes)
        {
            walkImpl(childNode, level + 1, nodeCallback);
        }

        if (typeof result === 'function')
        {
            result(parentNode.owner, parentNode);
        }
    }

    function sortChildrenForWalk(nodeMapping, childNodes, parentNode, childrenCallback)
    {
        let nextChildren = childNodes.map(node => node.owner);
        childrenCallback(nextChildren, parentNode);
        for(let i = 0; i < nextChildren.length; ++i)
        {
            childNodes[i] = nodeMapping.get(nextChildren[i]);
        }
        childNodes.length = nextChildren.length;
    }

    /**
     * A representative node to keep relational metadata for any object in
     * the {@link SceneGraph}.
     */
    class SceneNode
    {
        /**
         * Constructs a scene node with the given parent and children. This assumes
         * the given parent and children satisfy the correctness constraints of the
         * graph. In other words, This does not validate nor modify other nodes,
         * such as its parent or children, to maintain correctness. That must be
         * handled externally.
         * 
         * @param {SceneGraph} sceneGraph The scene graph this node belongs to.
         * @param {Object} owner The owner object.
         * @param {SceneNode} parentNode The parent node.
         * @param {Array<SceneNode>} childNodes The list of child nodes.
         */
        constructor(sceneGraph, owner, parentNode, childNodes)
        {
            this.sceneGraph = sceneGraph;
            this.owner = owner;

            this.parentNode = parentNode;
            this.childNodes = childNodes;
        }
    }

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
     * Copy the values from one mat4 to another
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the source matrix
     * @returns {mat4} out
     */

    function copy(out, a) {
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

    function fromTranslation(out, v) {
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
     * Set the components of a vec3 to the given values
     *
     * @param {vec3} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {vec3} out
     */

    function set(out, x, y, z) {
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

    class Camera
    {
        /** @abstract */
        getViewMatrix(out) {}
        
        /** @abstract */
        getProjectionMatrix(out) {}
    }

    class Camera2D extends Camera
    {
        constructor(left = -1, right = 1, top = -1, bottom = 1, near = 0, far = 1)
        {
            super();
            
            this.position = create$2();
            this.rotation = create$4();
            this.scale = fromValues(1, 1, 1);

            this.clippingPlane = {
                left, right, top, bottom, near, far,
            };
        }

        get x() { return this.position[0]; }
        set x(value) { this.position[0] = value; }
        get y() { return this.position[1]; }
        set y(value) { this.position[1] = value; }
        get z() { return this.position[2]; }
        set z(value) { this.position[2] = value; }
        
        moveTo(x, y, z = 0, dt = 1)
        {
            let nextPosition = fromValues(x, y, z);
            lerp(this.position, this.position, nextPosition, Math.max(Math.min(dt, 1), 0));
            return this;
        }

        /** @override */
        getViewMatrix(out)
        {
            let viewX = -Math.round(this.x);
            let viewY = -Math.round(this.y);
            let viewZ = this.z === 0 ? 1 : 1 / this.z;
            let invPosition = fromValues(viewX, viewY, 0);
            let invScale = fromValues(this.scale[0] * viewZ, this.scale[1] * viewZ, 1);
            fromRotationTranslationScale(out, this.rotation, invPosition, invScale);
            return out;
        }

        /** @override */
        getProjectionMatrix(out)
        {
            let { left, right, top, bottom, near, far } = this.clippingPlane;
            ortho(out, left, right, top, bottom, near, far);
            return out;
        }
    }

    class CanvasView2D
    {
        constructor(display, camera = new Camera2D())
        {
            this.display = display;
            this.camera = camera;

            this.viewTransformDOMMatrix = new DOMMatrix();
        }
        
        transformScreenToWorld(screenX, screenY)
        {
            let matrix = create$1();
            this.getViewProjectionMatrix(matrix);
            invert(matrix, matrix);
            let result = vec3.fromValues(screenX, screenY, 0);
            vec3.transformMat4(result, result, matrix);
            return result;
        }
        
        transformCanvas(ctx)
        {
            let domMatrix = this.viewTransformDOMMatrix;
            let matrix = create$1();
            this.getViewProjectionMatrix(matrix);
            setDOMMatrix(domMatrix, matrix);

            const { a, b, c, d, e, f } = domMatrix;
            ctx.transform(a, b, c, d, e, f);
        }

        getViewProjectionMatrix(out)
        {
            const displayWidth = this.display.width;
            const displayHeight = this.display.height;

            let matrix = create$1();
            const projectionMatrix = this.camera.getProjectionMatrix(matrix);
            const viewMatrix = this.camera.getViewMatrix(out);
            multiply(matrix, viewMatrix, projectionMatrix);
            // HACK: This is the correct canvas matrix, but since we simply restore the
            // the aspect ratio by effectively undoing the scaling, we can skip this step
            // all together to achieve the same effect (albeit incorrect).
            /*
            const canvasMatrix = mat4.fromRotationTranslationScale(
                out,
                [0, 0, 0, 1],
                [displayWidth / 2, displayHeight / 2, 0],
                [displayWidth, displayHeight, 0]);
            */
            // HACK: This shouldn't be here. This should really be in the view matrix.
            const canvasMatrix = fromTranslation(
                out,
                [displayWidth / 2, displayHeight / 2, 0]);
            multiply(out, canvasMatrix, matrix);
            return out;
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

    const WORLD_STATIC_INSTANCE = Symbol('worldInstance');
    const WORLD_PROVIDED = Symbol('worldProvided');
    const WORLD_DEPENDENCIES = Symbol('worldDependencies');

    // Should be able to un-provide to allow control over
    // where the globals are used. Maybe have a key that
    // is only passed around in systems.
    class World
    {
        static getWorld(opts = {})
        {
            const { lazy = true } = opts;
            if (!(WORLD_STATIC_INSTANCE in this))
            {
                if (!lazy)
                {
                    throw new Error('Invalid immediate access to uninitialized world. Must call World.provide() before this or be lazily loaded.');
                }

                let world = new (this)(WORLD_STATIC_INSTANCE);
                this[WORLD_STATIC_INSTANCE] = world;
                return world;
            }
            else
            {
                let world = this[WORLD_STATIC_INSTANCE];
                return world;
            }
        }

        static provide(values)
        {
            let world = this.getWorld();
            if (world[WORLD_PROVIDED])
            {
                throw new Error('Can only provide world values once.');
            }

            let required = new Set(world[WORLD_DEPENDENCIES]);
            for(let [key, value] of Object.entries(values))
            {
                world[key] = value;
                if (required.has(key)) required.delete(key);
            }
            world[WORLD_PROVIDED] = true;
            if (required.size <= 0)
            {
                Object.freeze(world);
                return world;
            }
            else
            {
                throw new Error(`Missing required world dependencies: ${Array.from(required)}`);
            }
        }

        static require(...dependencies)
        {
            let world = this.getWorld();
            if (world[WORLD_PROVIDED])
            {
                let missing = [];
                for(let dependency of dependencies)
                {
                    if (!world[WORLD_DEPENDENCIES].has(dependency))
                    {
                        missing.push(dependency);
                    }
                }
                if (missing.length > 0)
                {
                    throw new Error(`Missing required world dependencies: ${missing}`);
                }
            }
            else
            {
                for(let dependency of dependencies)
                {
                    world[WORLD_DEPENDENCIES].add(dependency);
                }
            }
            return this;
        }

        /** @private */
        constructor(init)
        {
            if (init !== WORLD_STATIC_INSTANCE)
            {
                throw new Error('World cannot be instantiated externally.');
            }

            this[WORLD_DEPENDENCIES] = new Set();
            this[WORLD_PROVIDED] = false;
        }
    }

    World.require('sceneGraph');

    const Transform = {
        create(props, entityId)
        {
            const { parentId = undefined, x = 0, y = 0, z = 0} = props;
            const { sceneGraph } = World.getWorld();

            sceneGraph.add(entityId, parentId);
            let result = {
                worldTransformation: create$1(),
                localTransformation: create$1(),
                x, y, z,
                pitch: 0, yaw: 0, roll: 0,
                scaleX: 1, scaleY: 1, scaleZ: 1,
            };
            return result;
        },
        destroy(component, entityId)
        {
            const { sceneGraph } = World.getWorld();
            sceneGraph.remove(entityId);
        }
    };

    const Renderable = {
        create(props)
        {
            const { renderType, ...otherProps } = props;
            if (!renderType) throw new Error(`Component instantiation is missing required prop 'renderType'.`);
            return {
                renderType,
                ...otherProps,
            };
        }
    };

    World.require('aabbGraph');

    const Collidable = {
        create(props, entityId)
        {
            const { aabbGraph } = World.getWorld();
            const { masks } = props;
            for(let maskName in masks)
            {
                aabbGraph.add(entityId, maskName, masks[maskName]);
            }
            return {
                masks,
                collided: false,
            };
        },
        destroy(component, entityId)
        {
            const { aabbGraph } = World.getWorld();
            const { masks } = component;
            for(let maskName in masks)
            {
                aabbGraph.remove(entityId, maskName);
            }
        }
    };

    const Motion = {
        create(props)
        {
            const { motionX = 0, motionY = 0, speed = 0.6, friction = 0.25 } = props;
            return {
                motionX,
                motionY,
                speed,
                friction,
                moving: false,
                facing: 1,
            };
        }
    };

    const Sprite = {
        create(props)
        {
            const { textureStrip } = props;
            if (!textureStrip) throw new Error(`Component instantiation is missing required prop 'textureStrip'.`);
            return {
                textureStrip,
                spriteIndex: 0,
                dt: 0,
            };
        },
        draw(ctx, sprite)
        {
            const spriteWidth = sprite.textureStrip.unitWidth;
            const spriteHeight = sprite.textureStrip.unitHeight;
            sprite.textureStrip.unitDraw(ctx, -spriteWidth / 2, -spriteHeight / 2, sprite.spriteIndex);
        },
        next(sprite, dt = 1)
        {
            sprite.dt += dt;
            const amount = Math.floor(sprite.dt);
            sprite.dt -= amount;
            sprite.spriteIndex = (sprite.spriteIndex + amount) % sprite.textureStrip.length;
        }
    };

    const Solid = {
        create(props)
        {
            const { masks } = props;
            if (!masks) throw new Error(`Component instantiation is missing required prop 'masks'.`);
            return {
                masks,
            };
        }
    };

    var moveUp = [
    	{
    		key: "keyboard:ArrowUp",
    		scale: 1
    	},
    	{
    		key: "keyboard:KeyW",
    		scale: 1
    	}
    ];
    var moveDown = [
    	{
    		key: "keyboard:ArrowDown",
    		scale: 1
    	},
    	{
    		key: "keyboard:KeyS",
    		scale: 1
    	}
    ];
    var moveLeft = [
    	{
    		key: "keyboard:ArrowLeft",
    		scale: 1
    	},
    	{
    		key: "keyboard:KeyA",
    		scale: 1
    	}
    ];
    var moveRight = [
    	{
    		key: "keyboard:ArrowRight",
    		scale: 1
    	},
    	{
    		key: "keyboard:KeyD",
    		scale: 1
    	}
    ];
    var mainAction = [
    	{
    		key: "keyboard:KeyE",
    		scale: 1
    	},
    	{
    		key: "keyboard:Space",
    		scale: 1
    	}
    ];
    var inventory = [
    	{
    		key: "keyboard:KeyF",
    		event: "up"
    	},
    	{
    		key: "keyboard:KeyI",
    		event: "up"
    	}
    ];
    var sprint = [
    	{
    		key: "keyboard:ShiftLeft",
    		scale: 1
    	},
    	{
    		key: "keyboard:ShiftRight",
    		scale: 1
    	}
    ];
    var sneak = [
    	{
    		key: "keyboard:ControlLeft",
    		scale: 1
    	},
    	{
    		key: "keyboard:ControlRight",
    		scale: 1
    	}
    ];
    var INPUT_MAP = {
    	moveUp: moveUp,
    	moveDown: moveDown,
    	moveLeft: moveLeft,
    	moveRight: moveRight,
    	mainAction: mainAction,
    	inventory: inventory,
    	sprint: sprint,
    	sneak: sneak
    };

    var dungeon = {
    	src: "atlas:dungeon/dungeon.atlas"
    };
    var ASSET_MAP = {
    	dungeon: dungeon
    };

    World.require('entityManager');

    class GameObject
    {
        static getGameObjectById(entityManager, entityId)
        {
            /**
             * # The Singleton Approach
             * function(entityId):
             *   const {entityManager} = World.getWorld();
             *   return entityManager.get('GameObject', entityId);
             * 
             * ## Concerns
             * - What if there are multiple entityManagers?
             * - What if the original object was created with a different manager?
             * - What if this is called after a destroy? Or before a create?
             * - What if this was called outside of this thread (WebWorker)?
             */
            return entityManager.get('GameObject', entityId);
        }

        static create(props, entityId, entityManager)
        {
            if (props instanceof GameObject)
            {
                if (props.entityId === undefined && props.entityManager === undefined)
                {
                    return props;
                }
                else
                {
                    throw new Error('Cannot allocate multiple entity ids for a GameObject.');
                }
            }
            else
            {
                throw new Error('Cannot create GameObject component without GameObject instance.');
            }
        }

        static destroy(component, entityId, entityManager)
        {
            component.onDestroy();
        }

        constructor()
        {
            const { entityManager } = World.getWorld();
            const entityId = entityManager.create();
            entityManager.add('GameObject', entityId, this);

            this.entityId = entityId;
            this.entityManager = entityManager;
        }

        /** @abstract */
        onDestroy() {}

        get(componentName)
        {
            return this.entityManager.get(componentName, this.entityId);
        }
        
        has(componentName)
        {
            return this.entityManager.has(componentName, this.entityId);
        }

        add(componentName, props = undefined)
        {
            this.entityManager.add(componentName, this.entityId, props);
        }

        remove(componentName)
        {
            this.entityManager.remove(componentName, this.entityId);
        }
    }

    World.require('entityManager');

    const RENDERABLE_OPTIONS = { renderType: 'sprite' };
    class Player extends GameObject
    {
        constructor()
        {
            super();
            
            const { assets } = World.getWorld();
            this.add('Transform');
            this.add('Motion');
            this.add('Renderable', RENDERABLE_OPTIONS);
            this.add('PlayerControlled', true);
            this.add('Collidable', Player.maskProps);
            this.add('Sprite', {
                textureStrip: assets.dungeon.getSubTexture('elf_m_run_anim')
            });
        }
    }
    Player.maskProps = {
        masks: {
            main: {
                rx: 8, ry: 8,
                get(aabb, owner)
                {
                    const { entityManager } = World.getWorld();
                    const transform = entityManager.get('Transform', owner);
                    aabb.x = transform.x;
                    aabb.y = transform.y + 8;
                }
            }
        }
    };

    class Wall extends GameObject
    {
        constructor(left = 0, top = 0, right = left + 10, bottom = top + 10)
        {
            super();

            const width = right - left;
            const height = bottom - top;
            const rx = width / 2;
            const ry = height / 2;
            const x = left + rx;
            const y = top + ry;

            this.add('Transform', { x, y });
            this.add('Renderable', { renderType: 'wall', width, height });
            this.add('Collidable', { masks: { main: { x, y, rx, ry } } });
            this.add('Solid', { masks: ['main']});
        }
    }

    class MotionSystem
    {
        constructor(entityManager, input)
        {
            this.entityManager = entityManager;
            this.input = input;
        }

        update(dt)
        {
            const { entityManager, input } = this;
            
            for(let entityId of entityManager.getComponentEntityIds('Motion'))
            {
                let motion = entityManager.get('Motion', entityId);

                if (entityManager.has('PlayerControlled', entityId))
                {
                    let dx = input.getInputValue('moveRight') - input.getInputValue('moveLeft');
                    let dy = input.getInputValue('moveDown') - input.getInputValue('moveUp');
                    if (dx || dy)
                    {
                        let dr = Math.atan2(dy, dx);
                        let cdr = Math.cos(dr);
                        let sdr = Math.sin(dr);
                        motion.motionX += cdr * motion.speed;
                        motion.motionY += sdr * motion.speed;
                        motion.moving = true;
                        motion.facing = Math.sign(cdr);
                    }
                    else
                    {
                        motion.moving = false;
                    }
                }

                let invFriction = 1 - motion.friction;
                motion.motionX *= invFriction;
                motion.motionY *= invFriction;

                if (entityManager.has('Transform', entityId))
                {
                    let transform = entityManager.get('Transform', entityId);
                    transform.x += motion.motionX;
                    transform.y += motion.motionY;
                }
            }
        }
    }

    class CameraSystem
    {
        constructor(entityManager, view, cameraSpeed = 1)
        {
            this.entityManager = entityManager;
            this.view = view;
            this.cameraSpeed = cameraSpeed;
        }

        update(dt)
        {
            const { entityManager, view } = this;
            let controlledEntity = entityManager.getComponentEntityIds('PlayerControlled')[0];
            let controlledTransform = entityManager.get('Transform', controlledEntity);
            view.camera.moveTo(controlledTransform.x, controlledTransform.y, 0, dt * this.cameraSpeed);
        }
    }

    class PhysicsSystem
    {
        constructor(entityManager, aabbGraph)
        {
            this.entityManager = entityManager;
            this.aabbGraph = aabbGraph;
        }

        update(dt)
        {
            const { entityManager, aabbGraph } = this;

            for(let collidable of entityManager.getComponentInstances('Collidable'))
            {
                collidable.collided = false;
            }
            let collisions = aabbGraph.solve(entityManager.getComponentEntityIds('Motion'));
            for(let collision of collisions)
            {
                {
                    let entityId = collision.box.owner;
                    let collidable = entityManager.get('Collidable', entityId);
                    collidable.collided = true;
                }
                {
                    let entityId = collision.otherBox.owner;
                    let collidable = entityManager.get('Collidable', entityId);
                    collidable.collided = true;
                }
                {
                    let entityId = collision.mask.owner;
                    let otherId = collision.otherMask.owner;
                    if (entityManager.has('Motion', entityId) && entityManager.has('Transform', entityId))
                    {
                        if (entityManager.has('Solid', otherId))
                        {
                            let solid = entityManager.get('Solid', otherId);
                            if (solid.masks.includes(collision.otherBox.maskName))
                            {
                                let motion = entityManager.get('Motion', entityId);
                                let transform = entityManager.get('Transform', entityId);
                                transform.x -= collision.hit.dx;
                                transform.y -= collision.hit.dy;
                                if (collision.hit.nx && Math.sign(collision.hit.nx) === Math.sign(motion.motionX))
                                {
                                    motion.motionX = 0;
                                }
                                if (collision.hit.ny && Math.sign(collision.hit.ny) === Math.sign(motion.motionY))
                                {
                                    motion.motionY = 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    class Texture
    {
        constructor(image)
        {
            this.source = image;
            this.width = image.width;
            this.height = image.height;
        }

        draw(ctx, x, y)
        {
            this.subDraw(ctx, x, y, 0, 0, this.width, this.height);
        }

        subDraw(ctx, x, y, u, v, width, height)
        {
            ctx.drawImage(this.source, u, v, width, height, x, y, width, height);
        }
    }

    class TextureAtlas extends Texture
    {
        constructor(image)
        {
            super(image);
            this.textures = {};
        }

        addSubTexture(name, u, v, width, height, cols = 1, rows = 1)
        {
            this.textures[name] = new SubTexture(this.source, u, v, width, height, cols, rows);
            return this;
        }

        remove(name)
        {
            delete this.textures[name];
            return this;
        }

        clear()
        {
            this.textures = {};
            return this;
        }

        /** @returns {SubTexture} The mapped texture for the given name. */
        getSubTexture(name)
        {
            let result = this.textures[name];
            if (result)
            {
                return result;
            }
            else
            {
                throw new Error(`Textue '${name}' does not exist in texture atlas.`);
            }
        }
    }

    class SubTexture extends Texture
    {
        constructor(image, u = 0, v = 0, unitWidth = image.width, unitHeight = image.height, cols = 1, rows = 1)
        {
            super(image);
            this.length = cols * rows;
            this.width = unitWidth * cols;
            this.height = unitHeight * rows;
            this.unitWidth = unitWidth;
            this.unitHeight = unitHeight;

            this.u = u;
            this.v = v;
        }

        /** @override */
        subDraw(ctx, x, y, u, v, width, height)
        {
            ctx.drawImage(this.source, this.u + u, this.v + v, width, height, x, y, width, height);
        }

        unitDraw(ctx, x, y, index)
        {
            const { unitWidth: uw, unitHeight: uh, length } = this;
            index = Math.abs(index % length);
            let u = (index % uw) * uw;
            let v = Math.floor(index / uw) * uh;
            this.subDraw(ctx, x, y, u, v, uw, uh);
        }
    }

    async function loadTextureAtlas(filePath, opts)
    {
        let atlasFile = await fetch(filePath);
        let atlasText = await atlasFile.text();

        const sourcePath = filePath.substring(0, filePath.lastIndexOf('.')) + '.png';
        let sourceImage = await ImageLoader.loadImage(sourcePath);
        
        return parseAtlasFromFile(sourceImage, atlasText);
    }

    function parseAtlasFromFile(sourceImage, atlasText)
    {
        let textureAtlas = new TextureAtlas(sourceImage);
        for(let line of atlasText.split('\n'))
        {
            line = line.trim();
            if (line.length <= 0) continue;
            if (line.startsWith('//')) continue;
            if (line.startsWith('#')) continue;

            let [name, u, v, w, h, cols, rows] = line.split(/\s+/);
            u = Number(u);
            v = Number(v);
            w = Number(w);
            h = Number(h);
            cols = typeof cols !== 'undefined' ? Number(cols) : 1;
            rows = typeof rows !== 'undefined' ? Number(rows) : 1;
            textureAtlas.addSubTexture(name, u, v, w, h, cols, rows);
        }
        return textureAtlas;
    }

    class RenderSystem
    {
        constructor(entityManager, sceneGraph, aabbGraph, view)
        {
            this.entityManager = entityManager;
            this.sceneGraph = sceneGraph;
            this.aabbGraph = aabbGraph;
            this.view = view;
            this.renderers = {};

            this.renderScene = this.renderScene.bind(this);
            this.renderNode = this.renderNode.bind(this);
        }

        registerRenderer(renderType, renderer)
        {
            this.renderers[renderType] = renderer;
            return this;
        }

        unregisterRenderer(renderType)
        {
            delete this.renderers[renderType];
            return this;
        }

        render(ctx)
        {
            renderView(ctx, this.view, this.renderScene);
        }

        renderScene(ctx)
        {
            // Render scene objects...
            const { entityManager, sceneGraph, aabbGraph } = this;
            renderSceneGraph(ctx, sceneGraph, entityManager, this.renderNode);
            
            // Render collision masks...
            // renderAxisAlignedBoundingBoxGraph(ctx, aabbGraph, entityManager);
        }

        renderNode(ctx, owner)
        {
            const { entityManager } = this;
            if (entityManager.has('Renderable', owner))
            {
                const { renderType } = entityManager.get('Renderable', owner);
                if (renderType in this.renderers)
                {
                    this.renderers[renderType](ctx, owner, entityManager);
                }
            }
            else
            {
                ctx.fillStyle = 'red';
                ctx.fillRect(-1, -1, 2, 2);
            }
        }
    }

    function renderView(ctx, view, renderCallback)
    {
        let viewProjectionMatrix = view.getViewProjectionMatrix(create$1());
        let domMatrix = new DOMMatrix();
        setDOMMatrix(domMatrix, viewProjectionMatrix);
        let prevMatrix = ctx.getTransform();
        ctx.setTransform(domMatrix);
        {
            renderCallback(ctx);
        }
        ctx.setTransform(prevMatrix);
    }

    function renderSceneGraph(ctx, sceneGraph, entityManager, renderCallback)
    {
        let q = create$4();
        let v = create$2();
        let s = create$2();
        let domMatrix = new DOMMatrix();
        sceneGraph.walk(null,
            (child, childNode) => {
                let transform = entityManager.get('Transform', child);
                let { localTransformation, worldTransformation } = transform;
                fromEuler(q, transform.pitch, transform.yaw, transform.roll);
                set(v, transform.x, transform.y, transform.z);
                set(s, transform.scaleX, transform.scaleY, transform.scaleZ);
                fromRotationTranslationScale(localTransformation, q, v, s);

                if (childNode.parentNode)
                {
                    let parent = childNode.parentNode.owner;
                    let { worldTransformation: parentWorldTransformation } = entityManager.get('Transform', parent);
                    multiply(worldTransformation, parentWorldTransformation, localTransformation);
                }
                else
                {
                    copy(worldTransformation, localTransformation);
                }

                setDOMMatrix(domMatrix, worldTransformation);

                let prevMatrix = ctx.getTransform();
                ctx.transform(domMatrix.a, domMatrix.b, domMatrix.c, domMatrix.d, domMatrix.e, domMatrix.f);
                {
                    renderCallback(ctx, child, childNode);
                }
                ctx.setTransform(prevMatrix);
            },
            {
                childrenCallback(children, node)
                {
                    children.sort((a, b) => {
                        let at = entityManager.get('Transform', a);
                        let bt = entityManager.get('Transform', b);
                        let dz = Math.floor(at.z - bt.z);
                        return dz || at.y - bt.y;
                    });
                }
            });
    }

    const Sprite$1 = {
        create(props)
        {
            const { textureStrip } = props;
            if (!textureStrip) throw new Error(`Component instantiation is missing required prop 'textureStrip'.`);
            return {
                textureStrip,
                spriteIndex: 0,
                dt: 0,
            };
        },
        draw(ctx, sprite)
        {
            const spriteWidth = sprite.textureStrip.unitWidth;
            const spriteHeight = sprite.textureStrip.unitHeight;
            sprite.textureStrip.unitDraw(ctx, -spriteWidth / 2, -spriteHeight / 2, sprite.spriteIndex);
        },
        next(sprite, dt = 1)
        {
            sprite.dt += dt;
            const amount = Math.floor(sprite.dt);
            sprite.dt -= amount;
            sprite.spriteIndex = (sprite.spriteIndex + amount) % sprite.textureStrip.length;
        }
    };

    function SpriteRenderer(ctx, owner, entityManager)
    {
        let sprite = entityManager.get('Sprite', owner);
        let scaleX = 1;
        let speed = 0;
        if (entityManager.has('Motion', owner))
        {
            let motion = entityManager.get('Motion', owner);
            speed = motion.moving ? 0.2 : 0;
            scaleX = motion.facing <= 0 ? -1 : 1;
        }
        ctx.scale(scaleX, 1);
        {
            if (speed)
            {
                Sprite$1.next(sprite, speed);
                Sprite$1.draw(ctx, sprite);
            }
            else
            {
                sprite.textureStrip.unitDraw(ctx, -sprite.textureStrip.unitWidth / 2, -sprite.textureStrip.unitHeight / 2, 0);
            }
        }
        ctx.scale(-scaleX, 1);
    }

    function WallRenderer(ctx, owner, entityManager)
    {
        const renderable = entityManager.get('Renderable', owner);
        ctx.fillStyle = 'white';
        let halfWidth = renderable.width / 2;
        let halfHeight = renderable.height / 2;
        ctx.fillRect(-halfWidth, -halfHeight, renderable.width, renderable.height);
    }

    World.require('assets');

    class Door extends GameObject
    {
        constructor(x = 0, y = 0)
        {
            super();

            const { assets } = World.getWorld();
            this.add('Transform', { x, y });
            this.add('Renderable', { renderType: 'sprite' });
            this.add('Sprite', { textureStrip: assets.dungeon.getSubTexture('doors_all') });
            this.add('Collidable', { masks: {
                main: { x, y: y + 4, rx: 32, ry: 4 },
                activate: { x, y, rx: 16, ry: 16 },
            }});
            this.add('Solid', { masks: ['main'] });
        }
    }

    document.addEventListener('DOMContentLoaded', main);

    const PlayerControlled = {};

    const ENTITY_COMPONENT_FACTORY_MAP = {
        Transform,
        Renderable,
        Motion,
        PlayerControlled,
        Collidable,
        GameObject,
        Sprite,
        Solid,
    };

    async function setup()
    {
        const display = document.querySelector('display-port');
        const input = new InputContext(INPUT_MAP);
        document.body.appendChild(input);
        const view = new CanvasView2D(display);

        const sceneGraph = new SceneGraph();
        const aabbGraph = new AxisAlignedBoundingBoxGraph();
        const entityManager = new EntityManager({
            componentFactoryMap: ENTITY_COMPONENT_FACTORY_MAP,
        });
        AssetLoader.defineAssetLoader('atlas', loadTextureAtlas);
        const assets = await AssetLoader.loadAssetMap(ASSET_MAP);

        return {
            display,
            input,
            view,
            sceneGraph,
            aabbGraph,
            entityManager,
            assets,
        };
    }

    async function main()
    {
        const world = World.provide(await setup());

        const {
            entityManager,
            sceneGraph,
            aabbGraph,
            input,
            display,
            view,
            assets,
        } = world;
        const systems = [
            new MotionSystem(entityManager, input),
            new CameraSystem(entityManager, view, 4),
            new PhysicsSystem(entityManager, aabbGraph),
            new RenderSystem(entityManager, sceneGraph, aabbGraph, view)
                .registerRenderer('sprite', SpriteRenderer)
                .registerRenderer('wall', WallRenderer),
        ];

        const walls = [
            new Wall(0, 0, 8, 64),
            new Wall(0, 0, 64, 8),
            new Wall(64, 0, 72, 16),
        ];
        const door = [
            new Door(32, 64),
        ];
        const player = new Player();

        display.addEventListener('frame', e => {
            // Update
            {
                const dt = e.detail.deltaTime / 1000;
                input.poll();

                for(let system of systems)
                {
                    if ('update' in system)
                    {
                        system.update(dt);
                    }
                }
            }

            // Render
            {
                const ctx = e.detail.context;
                ctx.clearRect(0, 0, display.width, display.height);

                for(let system of systems)
                {
                    if ('render' in system)
                    {
                        system.render(ctx);
                    }
                }
            }
        });
    }

}());
//# sourceMappingURL=index.js.map
