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
     * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
     * @module mat4
     */

    /**
     * Creates a new identity mat4
     *
     * @returns {mat4} a new 4x4 matrix
     */

    function create() {
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

    function fromRotation(out, rad, axis) {
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
     * 3 Dimensional Vector
     * @module vec3
     */

    /**
     * Creates a new, empty vec3
     *
     * @returns {vec3} a new 3D vector
     */

    function create$1() {
      var out = new ARRAY_TYPE(3);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }

      return out;
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
      var vec = create$1();
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

    let TYPE_INFO = null;

    function getTypeInfo(gl, type) {
        if (!TYPE_INFO) {
            TYPE_INFO = createTypeInfo(gl);
        }
        return TYPE_INFO[type];
    }

    /** Whether the type should be a uniform sampler. */
    function isUniformSamplerType(gl, type) {
        let typeInfo = getTypeInfo(gl, type);
        return 'sampler' in typeInfo;
    }

    /** Get the element type if the passed-in type is a vector type. Otherwise, returns the same type. */
    function getVectorElementType(gl, type)
    {
        let typeInfo = getTypeInfo(gl, type);
        if ('arrayType' in typeInfo)
        {
            return typeInfo.arrayType;
        }
        else
        {
            return type;
        }
    }

    function getUniformFunction(gl, type) {
        let typeInfo = getTypeInfo(gl, type);
        return typeInfo.uniform;
    }

    function getUniformSamplerFunction(gl, samplerType, textureUnit) {
        let typeInfo = getTypeInfo(gl, samplerType);
        return typeInfo.sampler(typeInfo.bindPoint, textureUnit);
    }

    function createTypeInfo(gl) {
        let result = {};

        if (gl instanceof WebGLRenderingContext)
        {
            result[gl.FLOAT]                         = { TypedArray: Float32Array, size:  4, uniform: gl.uniform1f,     arrayUniform: gl.uniform1fv, };
            result[gl.FLOAT_VEC2]                    = { TypedArray: Float32Array, size:  8, uniform: gl.uniform2fv,    arrayType: gl.FLOAT };
            result[gl.FLOAT_VEC3]                    = { TypedArray: Float32Array, size: 12, uniform: gl.uniform3fv,    arrayType: gl.FLOAT };
            result[gl.FLOAT_VEC4]                    = { TypedArray: Float32Array, size: 16, uniform: gl.uniform4fv,    arrayType: gl.FLOAT };
            result[gl.INT]                           = { TypedArray: Int32Array,   size:  4, uniform: gl.uniform1i,     arrayUniform: gl.uniform1iv, };
            result[gl.INT_VEC2]                      = { TypedArray: Int32Array,   size:  8, uniform: gl.uniform2iv,    arrayType: gl.INT };
            result[gl.INT_VEC3]                      = { TypedArray: Int32Array,   size: 12, uniform: gl.uniform3iv,    arrayType: gl.INT};
            result[gl.INT_VEC4]                      = { TypedArray: Int32Array,   size: 16, uniform: gl.uniform4iv,    arrayType: gl.INT};
            result[gl.UNSIGNED_INT]                  = { TypedArray: Uint32Array,  size:  4, uniform: gl.uniform1ui,    arrayUniform: gl.uniform1uiv, };
            result[gl.UNSIGNED_INT_VEC2]             = { TypedArray: Uint32Array,  size:  8, uniform: gl.uniform2uiv,   arrayType: gl.UNSIGNED_INT };
            result[gl.UNSIGNED_INT_VEC3]             = { TypedArray: Uint32Array,  size: 12, uniform: gl.uniform3uiv,   arrayType: gl.UNSIGNED_INT };
            result[gl.UNSIGNED_INT_VEC4]             = { TypedArray: Uint32Array,  size: 16, uniform: gl.uniform4uiv,   arrayType: gl.UNSIGNED_INT };
            result[gl.BOOL]                          = { TypedArray: Uint32Array,  size:  4, uniform: gl.uniform1i,     arrayUniform: gl.uniform1iv, };
            result[gl.BOOL_VEC2]                     = { TypedArray: Uint32Array,  size:  8, uniform: gl.uniform2iv,    arrayType: gl.BOOL };
            result[gl.BOOL_VEC3]                     = { TypedArray: Uint32Array,  size: 12, uniform: gl.uniform3iv,    arrayType: gl.BOOL };
            result[gl.BOOL_VEC4]                     = { TypedArray: Uint32Array,  size: 16, uniform: gl.uniform4iv,    arrayType: gl.BOOL };
            result[gl.FLOAT_MAT2]                    = { TypedArray: Float32Array, size: 16, uniform: _uniformMatrix2fv,  arrayType: gl.FLOAT };
            result[gl.FLOAT_MAT3]                    = { TypedArray: Float32Array, size: 36, uniform: _uniformMatrix3fv,  arrayType: gl.FLOAT };
            result[gl.FLOAT_MAT4]                    = { TypedArray: Float32Array, size: 64, uniform: _uniformMatrix4fv,  arrayType: gl.FLOAT };

            result[gl.UNSIGNED_BYTE]                 = { TypedArray: Uint8Array,   size: 1 };
            result[gl.UNSIGNED_SHORT]                = { TypedArray: Uint16Array,  size: 2 };
        }
        else
        {
            throw new Error('Unknown gl context provided.');
        }

        if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext)
        {
            result[gl.FLOAT_MAT2x3]                  = { TypedArray: Float32Array, size: 24, uniform: _uniformMatrix2x3fv, arrayType: gl.FLOAT };
            result[gl.FLOAT_MAT2x4]                  = { TypedArray: Float32Array, size: 32, uniform: _uniformMatrix2x4fv, arrayType: gl.FLOAT };
            result[gl.FLOAT_MAT3x2]                  = { TypedArray: Float32Array, size: 24, uniform: _uniformMatrix3x2fv, arrayType: gl.FLOAT };
            result[gl.FLOAT_MAT3x4]                  = { TypedArray: Float32Array, size: 48, uniform: _uniformMatrix3x4fv, arrayType: gl.FLOAT };
            result[gl.FLOAT_MAT4x2]                  = { TypedArray: Float32Array, size: 32, uniform: _uniformMatrix4x2fv, arrayType: gl.FLOAT };
            result[gl.FLOAT_MAT4x3]                  = { TypedArray: Float32Array, size: 48, uniform: _uniformMatrix4x3fv, arrayType: gl.FLOAT };
            loadSamplerTypeInfos(gl, result, _uniformSamplerWebGL2, _uniformSamplerArrayWebGL2);
        }
        else
        {
            loadSamplerTypeInfos(gl, result, _uniformSamplerWebGL1, _uniformSamplerArrayWebGL1);
        }

        return result;
    }

    function loadSamplerTypeInfos(gl, result, samplerSetter, samplerArraySetter) {
        result[gl.SAMPLER_2D]                    = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D,       };
        result[gl.SAMPLER_CUBE]                  = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_CUBE_MAP, };
        result[gl.SAMPLER_3D]                    = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_3D,       };
        result[gl.SAMPLER_2D_SHADOW]             = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D,       };
        result[gl.SAMPLER_2D_ARRAY]              = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D_ARRAY, };
        result[gl.SAMPLER_2D_ARRAY_SHADOW]       = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D_ARRAY, };
        result[gl.SAMPLER_CUBE_SHADOW]           = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_CUBE_MAP, };
        result[gl.INT_SAMPLER_2D]                = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D,       };
        result[gl.INT_SAMPLER_3D]                = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_3D,       };
        result[gl.INT_SAMPLER_CUBE]              = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_CUBE_MAP, };
        result[gl.INT_SAMPLER_2D_ARRAY]          = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D_ARRAY, };
        result[gl.UNSIGNED_INT_SAMPLER_2D]       = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D,       };
        result[gl.UNSIGNED_INT_SAMPLER_3D]       = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_3D,       };
        result[gl.UNSIGNED_INT_SAMPLER_CUBE]     = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_CUBE_MAP, };
        result[gl.UNSIGNED_INT_SAMPLER_2D_ARRAY] = { TypedArray: null,         size:  0, sampler: samplerSetter, arraySampler: samplerArraySetter, bindPoint: gl.TEXTURE_2D_ARRAY, };
        return result;
    }

    function _uniformMatrix2fv(location, v) {
        this.uniformMatrix2fv(location, false, v);
    }

    function _uniformMatrix3fv(location, v) {
        this.uniformMatrix3fv(location, false, v);
    }

    function _uniformMatrix4fv(location, v) {
        this.uniformMatrix4fv(location, false, v);
    }

    function _uniformMatrix2x3fv(location, v) {
        this.uniformMatrix2x3fv(location, false, v);
    }

    function _uniformMatrix3x2fv(location, v) {
        this.uniformMatrix3x2fv(location, false, v);
    }

    function _uniformMatrix2x4fv(location, v) {
        this.uniformMatrix2x4fv(location, false, v);
    }

    function _uniformMatrix4x2fv(location, v) {
        this.uniformMatrix4x2fv(location, false, v);
    }

    function _uniformMatrix3x4fv(location, v) {
        this.uniformMatrix3x4fv(location, false, v);
    }

    function _uniformMatrix4x3fv(location, v) {
        this.uniformMatrix4x3fv(location, false, v);
    }

    function _uniformSamplerWebGL1(bindPoint, unit) {
        return function (location, texture) {
            this.uniform1i(location, unit);
            this.activeTexture(this.TEXTURE0 + unit);
            this.bindTexture(bindPoint, texture);
        };
    }

    function _uniformSamplerArrayWebGL1(bindPoint, unit, size) {
        const units = new Int32Array(size);
        for (let ii = 0; ii < size; ++ii) {
            units[ii] = unit + ii;
        }
        return function (location, textures) {
            this.uniform1iv(location, units);
            textures.forEach(function (texture, index) {
                this.activeTexture(this.TEXTURE0 + units[index]);
                this.bindTexture(bindPoint, texture);
            });
        };
    }

    function _uniformSamplerWebGL2(bindPoint, unit) {
        return function (location, textureOrPair) {
            let texture;
            let sampler;
            if (textureOrPair instanceof WebGLTexture) {
                texture = textureOrPair;
                sampler = null;
            } else {
                texture = textureOrPair.texture;
                sampler = textureOrPair.sampler;
            }
            this.uniform1i(location, unit);
            this.activeTexture(this.TEXTURE0 + unit);
            this.bindTexture(bindPoint, texture);
            this.bindSampler(unit, sampler);
        };
    }

    function _uniformSamplerArrayWebGL2(bindPoint, unit, size) {
        const units = new Int32Array(size);
        for (let ii = 0; ii < size; ++ii) {
            units[ii] = unit + ii;
        }
        return function (location, textures) {
            this.uniform1iv(location, units);
            textures.forEach(function (textureOrPair, index) {
                this.activeTexture(this.TEXTURE0 + units[index]);
                let texture;
                let sampler;
                if (textureOrPair instanceof WebGLTexture) {
                    texture = textureOrPair;
                    sampler = null;
                } else {
                    texture = textureOrPair.texture;
                    sampler = textureOrPair.sampler;
                }
                this.bindSampler(unit, sampler);
                this.bindTexture(bindPoint, texture);
            });
        };
    }

    function createArrayBuffer(gl, type, usage, data = [])
    {
        const { TypedArray } = getTypeInfo(gl, type);
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        if (data instanceof TypedArray)
        {
            gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        }
        else
        {
            gl.bufferData(gl.ARRAY_BUFFER, new TypedArray(data), usage);
        }
        return {
            handle: buffer,
            type,
            target: gl.ARRAY_BUFFER,
            length: data.length,
        };
    }

    function createElementArrayBuffer(gl, type, usage, data = [])
    {
        const { TypedArray } = getTypeInfo(gl, type);
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        if (data instanceof TypedArray)
        {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, usage);
        }
        else
        {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new TypedArray(data), usage);
        }
        return {
            handle: buffer,
            type,
            target: gl.ELEMENT_ARRAY_BUFFER,
            length: data.length,
        };
    }

    function draw(gl, mode, offset, count, elements = null)
    {
        if (elements)
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements.handle);
            gl.drawElements(mode, count, elements.type, offset);
        }
        else
        {
            gl.drawArrays(mode, offset, count);
        }
    }

    class ProgramBuilder
    {
        constructor(gl)
        {
            this.handle = gl.createProgram();
            this.shaders = [];
            this.gl = gl;
        }

        shader(type, shaderSource)
        {
            const gl = this.gl;
            let shader = createShader(gl, type, shaderSource);
            this.shaders.push(shader);
            return this;
        }

        link(gl)
        {
            createShaderProgram(gl, this.handle, this.shaders);
            this.shaders.length = 0;
            return this.handle;
        }
    }

    /**
     * Get object mapping of all active uniforms to their info.
     * @param {WebGLRenderingContext} gl The current webgl context.
     * @param {WebGLProgram} program The program to get active uniforms from.
     * @returns {Object} An object mapping of uniform names to info.
     */
    function findActiveUniforms(gl, program)
    {
        let result = {};
        let activeUniformInfos = getActiveUniformInfos(gl, program);
        for(let uniformInfo of activeUniformInfos)
        {
            let uniformType = uniformInfo.type;
            let uniformName = uniformInfo.name;
            let uniformSize = uniformInfo.size;
            let uniformLocation = gl.getUniformLocation(program, uniformName);

            let uniformSetter;
            if (isUniformSamplerType(gl, uniformType))
            {
                let textureUnit = 0;
                let func = getUniformSamplerFunction(gl, uniformType, textureUnit);
                uniformSetter = function(gl, location, value) {
                    func.call(gl, location, value);
                };

                throw new Error('Samplers are not yet supported.');
            }
            else
            {
                let func = getUniformFunction(gl, uniformType);
                uniformSetter = function(gl, location, value) {
                    func.call(gl, location, value);
                };
            }

            result[uniformName] = {
                type: uniformType,
                length: uniformSize,
                location: uniformLocation,
                set: uniformSetter,
            };
        }
        return result;
    }

    /**
     * Get object mapping of all active attributes to their info.
     * @param {WebGLRenderingContext} gl The current webgl context.
     * @param {WebGLProgram} program The program to get active attributes from.
     * @returns {Object} An object mapping of attribute names to info.
     */
    function findActiveAttributes(gl, program)
    {
        let result = {};
        let attributeInfos = getActiveAttributeInfos(gl, program);
        for(let attributeInfo of attributeInfos)
        {
            let attributeType = attributeInfo.type;
            let attributeName = attributeInfo.name;
            let attributeSize = attributeInfo.size;
            let attributeLocation = gl.getAttribLocation(program, attributeName);

            result[attributeName] = {
                type: attributeType,
                length: attributeSize,
                location: attributeLocation,
            };
        }
        return result;
    }

    function createShader(gl, type, shaderSource)
    {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (status)
        {
            return shader;
        }

        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    function createShaderProgram(gl, program, shaders)
    {
        // Attach to the program.
        for(let shader of shaders)
        {
            gl.attachShader(program, shader);
        }

        // Link'em!
        gl.linkProgram(program);

        // Don't forget to clean up the shaders! It's no longer needed.
        for(let shader of shaders)
        {
            gl.detachShader(program, shader);
            gl.deleteShader(shader);
        }

        let status = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (status)
        {
            return program;
        }
        
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    /**
     * Get info for all active attributes in program.
     * @param {WebGLRenderingContext} gl The current webgl context.
     * @param {WebGLProgram} program The program to get the active attributes from.
     * @returns {Array<WebGLActiveInfo>} An array of active attributes.
     */
    function getActiveAttributeInfos(gl, program)
    {
        let result = [];
        const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for(let i = 0; i < attributeCount; ++i)
        {
            let attributeInfo = gl.getActiveAttrib(program, i);
            if (!attributeInfo) continue;
            result.push(attributeInfo);
        }
        return result;
    }

    /**
     * Get info for all active uniforms in program.
     * @param {WebGLRenderingContext} gl The current webgl context.
     * @param {WebGLProgram} program The program to get the active uniforms from.
     * @returns {Array<WebGLActiveInfo>} An array of active uniforms.
     */
    function getActiveUniformInfos(gl, program)
    {
        let result = [];
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for(let i = 0; i < uniformCount; ++i)
        {
            let uniformInfo = gl.getActiveUniform(program, i);
            if (!uniformInfo) break;
            result.push(uniformInfo);
        }
        return result;
    }

    function createProgramInfo(gl)
    {
        return new ProgramInfoBuilder(gl);
    }

    class ProgramInfoBuilder extends ProgramBuilder
    {
        /** @override */
        link(gl)
        {
            super.link(gl);
            return new ProgramInfo(gl, this.handle);
        }
    }

    class ProgramInfo
    {
        constructor(gl, program)
        {
            this.handle = program;

            this.activeUniforms = findActiveUniforms(gl, program);
            this.activeAttributes = findActiveAttributes(gl, program);

            this.drawContext = new ProgramInfoDrawContext(this);
        }

        bind(gl)
        {
            gl.useProgram(this.handle);

            this.drawContext.gl = gl;
            return this.drawContext;
        }
    }

    class ProgramInfoDrawContext
    {
        constructor(programInfo)
        {
            this.parent = programInfo;

            // Must be set by parent.
            this.gl = null;
        }
        
        uniform(uniformName, value)
        {
            const gl = this.gl;
            const activeUniforms = this.parent.activeUniforms;
            if (uniformName in activeUniforms)
            {
                let uniform = activeUniforms[uniformName];
                let location = uniform.location;
                uniform.set(gl, location, value);
            }
            return this;
        }

        attribute(attributeName, buffer, size, normalize = false, stride = 0, offset = 0)
        {
            const gl = this.gl;
            const activeAttributes = this.parent.activeAttributes;
            if (attributeName in activeAttributes)
            {
                let attribute = activeAttributes[attributeName];
                let location = attribute.location;
                if (buffer)
                {
                    let type = getVectorElementType(gl, attribute.type);
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
                    gl.enableVertexAttribArray(location);
                }
                else
                {
                    gl.disableVertexAttribArray(location);
                }
            }
            return this;
        }

        draw(gl, offset, count, elements = null)
        {
            draw(gl, gl.TRIANGLES, offset, count, elements);
            return this.parent;
        }
    }

    document.addEventListener('DOMContentLoaded', main);

    async function main()
    {
        const display = document.querySelector('display-port');
        
        const gl = display.canvas.getContext('webgl');
        if (!gl) throw new Error('Your browser does not support webgl.');

        gl.enable(gl.DEPTH_TEST);

        // 1. Create the program.
        const vertexShaderSource = await AssetLoader.loadAsset('text:main.vert');
        const fragmentShaderSource = await AssetLoader.loadAsset('text:main.frag');
        const programInfo = createProgramInfo(gl)
            .shader(gl.VERTEX_SHADER, vertexShaderSource)
            .shader(gl.FRAGMENT_SHADER, fragmentShaderSource)
            .link(gl);

        // 2. Prepare the data.
        const cubeGeometryData = await AssetLoader.loadAsset('obj:webgl/cube.obj');
        const positionBuffer = createArrayBuffer(gl, gl.FLOAT, gl.STATIC_DRAW, cubeGeometryData.positions);
        const texcoordBuffer = createArrayBuffer(gl, gl.FLOAT, gl.STATIC_DRAW, cubeGeometryData.texcoords);
        const normalBuffer = createArrayBuffer(gl, gl.FLOAT, gl.STATIC_DRAW, cubeGeometryData.normals);
        const indexBuffer = createElementArrayBuffer(gl, gl.UNSIGNED_SHORT, gl.STATIC_DRAW, cubeGeometryData.indices);

        const projectionMatrix = perspective(create(), Math.PI * 40 / 180, gl.canvas.width / gl.canvas.height, 0.1, 1000);
        const viewMatrix = fromTranslation(create(), fromValues(0, 0, -5));
        const modelMatrix = fromRotation(create(), Math.PI / 2, fromValues(0, 1, 1));

        // Draw it.
        display.addEventListener('frame', e => {
            const dt = (e.detail.deltaTime / 1000) * 60;

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            clear(gl);

            // 3. Use the program.
            programInfo.bind(gl)
                .uniform('u_projection', projectionMatrix)
                .uniform('u_view', viewMatrix)
                .uniform('u_model', modelMatrix)
                .uniform('u_color', [1, 0, 0.5, 1])
                .attribute('a_position', positionBuffer.handle, 3)
                .attribute('a_texcoord', texcoordBuffer.handle, 2)
                .attribute('a_normal', normalBuffer.handle, 3)
                .draw(gl, 0, indexBuffer.length, indexBuffer);
        });
    }

    function clear(gl)
    {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

}());
//# sourceMappingURL=index.js.map
