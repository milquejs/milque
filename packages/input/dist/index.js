(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Input = {}));
}(this, (function (exports) { 'use strict';

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

    const INNER_HTML = `
<kbd></kbd>`;
    const INNER_STYLE = `
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

    const TEMPLATE_KEY = Symbol('template');
    const STYLE_KEY = Symbol('style');

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
            this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));
            this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

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

    // TODO: Maybe this should be InputMap.getContext()?

    const INNER_HTML$1 = `
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
    const INNER_STYLE$1 = `
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

    const TEMPLATE_KEY$1 = Symbol('template');
    const STYLE_KEY$1 = Symbol('style');

    const POLL_WARNING_TIME = 3000;

    class InputContext extends HTMLElement
    {
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
            this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY$1].content.cloneNode(true));
            this.shadowRoot.appendChild(this.constructor[STYLE_KEY$1].cloneNode(true));

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

    exports.InputContext = InputContext;
    exports.InputKey = InputKey;
    exports.Keyboard = Keyboard;
    exports.Mouse = Mouse;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
