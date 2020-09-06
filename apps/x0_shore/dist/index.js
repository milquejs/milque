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

    // Bresenham's Line Algorithm

    function clamp$1(value, min, max)
    {
        return Math.min(max, Math.max(min, value));
    }

    const MAX_DEPTH_LEVEL = 100;

    /**
     * @callback WalkCallback Called for each node, before traversing its children.
     * @param {Object} object The current object.
     * @param {SceneNode} node The representative node for the current object.
     * @returns {WalkBackCallback|Boolean} If false, the walk will skip
     * the current node's children. If a function, it will be called after
     * traversing down all of its children.
     * 
     * @callback WalkBackCallback Called if returned by {@link WalkCallback}, after
     * traversing the current node's children.
     * @param {Object} object The current object.
     * @param {SceneNode} node The representative node for the current object.
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
         * @param {Object} [opts.root] The root owner, otherwise it is an empty object.
         */
        constructor(opts = {})
        {
            this.nodeConstructor = opts.nodeConstructor || SceneNode;
            this.nodes = new Map();
            
            const rootOwner = opts.root || {};
            this.root = new (this.nodeConstructor)(this, rootOwner, null, []);
            this.nodes.set(rootOwner, this.root);
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
            if (this.nodes.has(parent))
            {
                let parentNode = this.nodes.get(parent);
                if (this.nodes.has(child))
                {
                    let childNode = this.nodes.get(child);
                    detach(childNode.parent, childNode);
                    attach(parentNode, childNode);
                    return childNode;
                }
                else
                {
                    let childNode = new (this.nodeConstructor)(this, child, null, []);
                    this.nodes.set(child, childNode);
                    attach(parentNode, childNode);
                    return childNode;
                }
            }
            else if (parent === null)
            {
                return this.add(child, this.root.owner);
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
            if (this.nodes.has(child))
            {
                let childNode = this.nodes.get(child);
                let parentNode = childNode.parent;
                detach(parentNode, childNode);
                this.nodeConstructor.walk(childNode, 0, descendent => {
                    this.nodes.delete(descendent);
                });
                return true;
            }
            else if (child === null)
            {
                this.clear();
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
         * @param {Object} target The target object to replace. If null,
         * it will replace the root node.
         * @param {Object} child The object to replace with. If null,
         * it will remove the target and the target's parent will adopt
         * its grandchildren.
         */
        replace(target, child)
        {
            if (this.nodes.has(target))
            {
                let targetNode = this.nodes.get(target);
                let targetParent = targetNode.parent;
                let targetChildren = [...targetNode.children];

                // Remove target node from the graph
                detach(targetParent, targetNode);

                // Begin grafting the grandchildren by first removing...
                targetNode.children.length = 0;

                if (child === null)
                {
                    // Reattach all grandchildren to target parent.
                    targetParent.children.push(...targetChildren);
                }
                else
                {
                    // Reattach all grandchildren to new child.
                    let childNode;
                    if (this.nodes.has(child))
                    {
                        childNode = this.nodes.get(child);

                        // Remove child node from prev parent
                        detach(childNode.parent, childNode);

                        // ...and graft them back.
                        childNode.children.push(...targetChildren);
                    }
                    else
                    {
                        childNode = new (this.nodeConstructor)(this, child, null, targetChildren);
                        this.nodes.set(child, childNode);
                    }

                    // And reattach target parent to new child.
                    attach(targetParent, childNode);
                }
                
                // ...and graft them back.
                for(let targetChild of targetChildren)
                {
                    targetChild.parent = targetParent;
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

            // Reset the graph.
            const rootOwner = {};
            this.root = new (this.nodeConstructor)(this, rootOwner, null, []);
            this.nodes.set(rootOwner, this.root);
        }

        /**
         * Gets the scene node for the given object.
         * 
         * @param {Object} owner The object to retreive the node for.
         * @returns {SceneNode} The scene node that represents the object.
         */
        get(child)
        {
            if (child === null)
            {
                return this.root;
            }
            else
            {
                return this.nodes.get(child);
            }
        }

        /**
         * Walks through every node in the graph starting from the root and
         * down to its children.
         * 
         * @param {WalkCallback} callback The function called for each node
         * in the graph, in ordered traversal from parent to child.
         * @param {Object} [opts] Any additional options.
         * @param {Boolean} [opts.skipRoot] Whether to skip traversing the root
         * and start from its children instead.
         */
        forEach(callback, opts = {})
        {
            if (opts.skipRoot)
            {
                for(let childNode of this.root.children)
                {
                    this.nodeConstructor.walk(childNode, 1, callback);
                }
            }
            else
            {
                this.nodeConstructor.walk(this.root, 0, callback);
            }
        }
    }

    function attach(parentNode, childNode)
    {
        parentNode.children.push(childNode);
        childNode.parent = parentNode;
    }

    function detach(parentNode, childNode)
    {
        let index = parentNode.children.indexOf(childNode);
        parentNode.children.splice(index, 1);
        childNode.parent = null;
    }

    /**
     * A representative node to keep relational metadata for any object in
     * the {@link SceneGraph}.
     */
    class SceneNode
    {
        /**
         * Walk down from the parent and through all its descendents.
         * 
         * @param {SceneNode} parentNode The parent node to start walking from.
         * @param {Number} level The current call depth level. This is used to limit the call stack.
         * @param {WalkCallback} callback The function called on each visited node.
         */
        static walk(parentNode, level, callback)
        {
            if (level >= MAX_DEPTH_LEVEL) return;

            let result = callback(parentNode.owner, parentNode);
            if (result === false) return;

            for(let childNode of parentNode.children)
            {
                this.walk(childNode, level + 1, callback);
            }

            if (typeof result === 'function')
            {
                result(parentNode.owner, parentNode);
            }
        }

        /**
         * Constructs a scene node with the given parent and children. This assumes
         * the given parent and children satisfy the correctness constraints of the
         * graph. In other words, This does not validate nor modify other nodes,
         * such as its parent or children, to maintain correctness. That must be
         * handled externally.
         * 
         * @param {SceneGraph} sceneGraph The scene graph this node belongs to.
         * @param {Object} owner The owner object.
         * @param {SceneNode} parent The parent node.
         * @param {Array<SceneNode>} children The list of child nodes.
         */
        constructor(sceneGraph, owner, parent, children)
        {
            this.sceneGraph = sceneGraph;
            this.owner = owner;

            this.parent = parent;
            this.children = children;
        }
    }

    class Camera2D
    {
        constructor(left = -1, right = 1, top = -1, bottom = 1, near = 0, far = 1)
        {
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
            lerp(this.position, this.position, nextPosition, clamp$1(dt, 0, 1));
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

    class EntityManager
    {
        constructor(opts = {})
        {
            const { componentFactoryMap = {}, strictMode = false } = opts;
            let factoryMap = {};
            let instances = {};
            for(let componentName in componentFactoryMap)
            {
                let factoryOption = componentFactoryMap[componentName];
                let create, destroy;
                if (typeof factoryOption === 'function')
                {
                    create = factoryOption;
                    destroy = null;
                }
                else if (typeof factoryOption === 'object')
                {
                    create = factoryOption.create || null;
                    destroy = factoryOption.destroy || null;
                }
                else
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

        create(entityTemplate = undefined)
        {
            let entityId = this.nextAvailableEntityId++;
            this.entities.add(entityId);
            if (entityTemplate)
            {
                if (Array.isArray(entityTemplate))
                {
                    for(let componentName of entityTemplate)
                    {
                        this.add(componentName, entityId);
                    }
                }
                else if (typeof entityTemplate === 'object')
                {
                    for(let componentName in entityTemplate)
                    {
                        this.add(componentName, entityId, entityTemplate[componentName]);
                    }
                }
                else
                {
                    throw new Error('Invalid component options.');
                }
            }
            return entityId;
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
                ? create(props, componentName, entityId, this)
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
                if (destroy) destroy(componentValues, componentName, entityId, this);
            }
        }

        get(componentName, entityId)
        {
            if (!(componentName in this.instances))
            {
                throw new Error(`Missing component instance mapping for '${componentName}'.`);
            }
            
            const entityComponents = this.instances[componentName];
            return entityComponents[entityId] || null;
        }
        
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

    document.addEventListener('DOMContentLoaded', main);

    // TODO: Should print the key code of any key somewhere, so we know what to use.
    // NOTE: https://keycode.info/
    const INPUT_MAPPING = {
        moveUp: [{key: 'keyboard:ArrowUp', scale: 1}, {key: 'keyboard:KeyW', scale: 1}],
        moveDown: [{key: 'keyboard:ArrowDown', scale: 1}, {key: 'keyboard:KeyS', scale: 1}],
        moveLeft: [{key: 'keyboard:ArrowLeft', scale: 1}, {key: 'keyboard:KeyA', scale: 1}],
        moveRight: [{key: 'keyboard:ArrowRight', scale: 1}, {key: 'keyboard:KeyD', scale: 1}],
        mainAction: [{key: 'keyboard:KeyE', scale: 1}, {key: 'keyboard:Space', scale: 1}],
        inventory: [{key: 'keyboard:KeyF', event: 'up' }, {key: 'keyboard:KeyI', event: 'up'}],
        sprint: [{key: 'keyboard:ShiftLeft', scale: 1}, {key: 'keyboard:ShiftRight', scale: 1}],
        sneak: [{key: 'keyboard:ControlLeft', scale: 1}, {key: 'keyboard:ControlRight', scale: 1}],
    };

    class SceneTransformNode extends SceneNode
    {
        constructor(sceneGraph, owner, parent, children)
        {
            super(sceneGraph, owner, parent, children);

            this.x = 0;
            this.y = 0;
            this.z = 0;

            this.pitch = 0;
            this.yaw = 0;
            this.roll = 0;

            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;

            this.worldTransformation = create$1();
            this.localTransformation = create$1();
        }
    }

    const Transform = {
        create(props, componentName, entityId, entityManager)
        {
            const { sceneGraph, parent = undefined, x = 0, y = 0, z = 0} = props;
            if (!sceneGraph) throw new Error(`Component instantiation is missing required prop 'sceneGraph'.`);
            let node = sceneGraph.add(entityId, parent);
            node.x = x;
            node.y = y;
            node.z = z;
            return node;
        },
        destroy(component, componentName, entityId, entityManager)
        {
            component.sceneGraph.remove(entityId);
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

    const Motion = {
        create(props)
        {
            return {
                motionX: 0,
                motionY: 0,
                speed: 0.6,
                friction: 0.25,
                ...props
            };
        }
    };

    const PlayerControlled = {};

    const ENTITY_COMPONENT_FACTORY_MAP = {
        Transform,
        Renderable,
        Motion,
        PlayerControlled,
    };

    async function main()
    {
        const display = document.querySelector('display-port');
        const input = new InputContext(INPUT_MAPPING);
        document.body.appendChild(input);

        const ctx = display.canvas.getContext('2d');
        const view = new CanvasView2D(display);
        const cameraSpeed = 4;

        const scene = new SceneGraph({
            nodeConstructor: SceneTransformNode
        });
        const entityManager = new EntityManager({
            componentFactoryMap: ENTITY_COMPONENT_FACTORY_MAP,
        });

        const player = entityManager.create({
            Transform: { sceneGraph: scene },
            Renderable: { renderType: 'player' },
            Motion: {},
            PlayerControlled: true,
        });
        const playerAABB = IntersectionHelper.createAABB(0, 0, 8, 8);
        scene.add(playerAABB, player);

        const walls = [
            entityManager.create({
                Transform: { sceneGraph: scene, x: 0, y: 0 },
                Renderable: { renderType: 'wall', width: 4, height: 64 },
            }),
            entityManager.create({
                Transform: { sceneGraph: scene, x: 0, y: 0 },
                Renderable: { renderType: 'wall', width: 64, height: 4 },
            }),
            entityManager.create({
                Transform: { sceneGraph: scene, x: 64, y: 0 },
                Renderable: { renderType: 'wall', width: 4, height: 16 },
            }),
        ];
        walls.forEach(wall => scene.add(wall));
        const statics = [...walls.map(wall => wall.mask)];

        display.addEventListener('frame', e => {
            // Update
            {
                const dt = e.detail.deltaTime / 1000;
                input.poll();

                // Player
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
                            motion.motionX += Math.cos(dr) * motion.speed;
                            motion.motionY += Math.sin(dr) * motion.speed;
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
                
                // Camera
                let controlledEntity = entityManager.getComponentEntityIds('PlayerControlled')[0];
                let controlledTransform = entityManager.get('Transform', controlledEntity);
                view.camera.moveTo(controlledTransform.x, controlledTransform.y, 0, dt * cameraSpeed);

                // Physics
                // IntersectionResolver.resolveIntersections(dynamics, statics, dt);
            }

            // Render
            {
                ctx.clearRect(0, 0, display.width, display.height);

                renderSceneGraph(ctx, scene, view,
                    (node) => {
                        return node;
                    },
                    (ctx, child, node) => {
                        if (entityManager.has('Renderable', child))
                        {
                            const renderable = entityManager.get('Renderable', child);
                            switch(renderable.renderType)
                            {
                                case 'player':
                                    ctx.fillStyle = 'blue';
                                    ctx.fillRect(-8, -8, 16, 16);
                                    break;
                                case 'wall':
                                    ctx.fillStyle = 'white';
                                    ctx.fillRect(0, 0, renderable.width, renderable.height);
                                    break;
                            }
                        }
                        else
                        {
                            ctx.fillStyle = 'red';
                            ctx.fillRect(-1, -1, 2, 2);
                        }
                    });
            }
        });
    }

    function renderSceneGraph(ctx, sceneGraph, view, transformCallback, renderer)
    {
        let rootNode = sceneGraph.get(null);
        let {
            localTransformation: rootLocalTransformation,
            worldTransformation: rootWorldTransformation
        } = transformCallback(rootNode);
        view.getViewProjectionMatrix(rootLocalTransformation);
        copy(rootWorldTransformation, rootLocalTransformation);

        let domMatrix = new DOMMatrix();
        sceneGraph.forEach((child, node) => {
            let { parent } = node;
            let parentTransform = transformCallback(parent);
            let childTransform = transformCallback(node);

            let { localTransformation, worldTransformation } = childTransform;
            const { worldTransformation: parentWorldTransformation } = parentTransform;

            fromTranslation(localTransformation, [childTransform.x, childTransform.y, childTransform.z]);
            multiply(worldTransformation, parentWorldTransformation, localTransformation);
            
            setDOMMatrix(domMatrix, worldTransformation);
            ctx.setTransform(domMatrix);

            renderer(ctx, child, node);
        },
        { skipRoot: true });

        ctx.setTransform();
    }

}());
//# sourceMappingURL=index.js.map
