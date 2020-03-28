const ANY = Symbol('any');

class EventKey
{
    static parse(eventKeyString)
    {
        let startCodeIndex = eventKeyString.indexOf('[');
        let endCodeIndex = eventKeyString.indexOf(']');
        let modeIndex = eventKeyString.indexOf('.');
    
        let source = null;
        let code = null;
        let mode = null;
    
        // For ANY source, use `[code].mode` or `.mode`
        // For ONLY codes and modes from source, use `source`
        if (startCodeIndex <= 0 || modeIndex === 0) source = ANY;
        else source = eventKeyString.substring(0, startCodeIndex);
    
        // For ANY code, use `source.mode` or `source[].mode`
        // For ONLY sources and modes for code, use `[code]`
        if (startCodeIndex < 0 || endCodeIndex < 0 || startCodeIndex + 1 === endCodeIndex) code = ANY;
        else code = eventKeyString.substring(startCodeIndex + 1, endCodeIndex);
    
        // For ANY mode, use `source[code]` or `source[code].`
        // For ONLY sources and codes for mode, use `.mode`
        if (modeIndex < 0 || eventKeyString.trim().endsWith('.')) mode = ANY;
        else mode = eventKeyString.substring(modeIndex + 1);
    
        return new EventKey(
            source,
            code,
            mode
        );
    }

    constructor(source, code, mode)
    {
        this.source = source;
        this.code = code;
        this.mode = mode;

        this.string = `${this.source.toString()}[${this.code.toString()}].${this.mode.toString()}`;
    }

    matches(eventKey)
    {
        if (this.source === ANY || eventKey.source === ANY || this.source === eventKey.source)
        {
            if (this.code === ANY || eventKey.code === ANY || this.code === eventKey.code)
            {
                if (this.mode === ANY || eventKey.mode === ANY || this.mode === eventKey.mode)
                {
                    return true;
                }
            }
        }
        return false;
    }

    /** @override */
    toString() { return this.string; }
}
// NOTE: Exported as a static variable of EventKey
EventKey.ANY = ANY;

class AbstractInputAdapter
{
    constructor(defaultValue)
    {
        this.prev = defaultValue;
        this.value = defaultValue;
        this.next = defaultValue;
    }

    update(eventKey, value) { return false; }
    consume() { return this.next; }

    poll()
    {
        this.prev = this.value;
        this.value = this.next;
        this.next = this.consume();
        return this;
    }
}

class ActionInputAdapter extends AbstractInputAdapter
{
    constructor(eventKeyStrings)
    {
        super(false);

        this.eventKeys = [];
        for(let eventKeyString of eventKeyStrings)
        {
            this.eventKeys.push(EventKey.parse(eventKeyString));
        }
    }

    /** @override */
    consume() { return false; }

    /** @override */
    update(eventKey, value = true)
    {
        for(let targetEventKey of this.eventKeys)
        {
            if (targetEventKey.matches(eventKey))
            {
                this.next = value;
                return true;
            }
        }
        return false;
    }
}

class RangeInputAdapter extends AbstractInputAdapter
{
    constructor(eventKeyString)
    {
        super(0);

        this.eventKey = EventKey.parse(eventKeyString);
    }

    /** @override */
    consume()
    {
        switch(this.eventKey.string)
        {
            case 'mouse[pos].dx':
            case 'mouse[pos].dy':
                return 0;
            case 'mouse[pos].x':
            case 'mouse[pos].y':
            default:
                return this.next;
        }
    }

    /** @override */
    update(eventKey, value = 1)
    {
        if (this.eventKey.matches(eventKey))
        {
            this.next = value;
            return true;
        }
        return false;
    }
}

class StateInputAdapter extends AbstractInputAdapter
{
    constructor(eventKeyMap)
    {
        super(0);
        
        this.eventKeyEntries = [];
        for(let eventKey of Object.keys(eventKeyMap))
        {
            this.eventKeyEntries.push({
                key: EventKey.parse(eventKey),
                value: eventKeyMap[eventKey]
            });
        }
    }

    /** @override */
    update(eventKey, value = true)
    {
        if (value)
        {
            for(let eventKeyEntry of this.eventKeyEntries)
            {
                if (eventKeyEntry.key.matches(eventKey))
                {
                    this.next = eventKeyEntry.value;
                    return true;
                }
            }
        }
        return false;
    }
}

const MIN_CONTEXT_PRIORITY = -100;
const MAX_CONTEXT_PRIORITY = 100;

function createContext()
{
    return {
        _source: null,
        _priority: 0,
        _active: true,
        inputs: new Map(),
        get active() { return this._active; },
        get source() { return this._source; },
        get priority() { return this._priority; },
        attach(inputSource)
        {
            this._source = inputSource;
            this._source.addContext(this);
            return this;
        },
        detach()
        {
            this._source.removeContext(this);
            this._source = null;
            return this;
        },
        setPriority(priority)
        {
            if (priority > MAX_CONTEXT_PRIORITY || priority < MIN_CONTEXT_PRIORITY)
            {
                throw new Error(`Context priority must be between [${MIN_CONTEXT_PRIORITY}, ${MAX_CONTEXT_PRIORITY}].`);
            }
            
            if (this._priority !== priority)
            {
                if (this._source)
                {
                    this._source.removeContext(this);
                    this._priority = priority;
                    this._source.addContext(this);
                }
                else
                {
                    this._priority = priority;
                }
            }
            return this;
        },
        registerInput(name, adapter)
        {
            this.inputs.set(name, adapter);
            return adapter;
        },
        registerAction(name, ...eventKeyStrings)
        {
            return this.registerInput(name, new ActionInputAdapter(eventKeyStrings));
        },
        registerRange(name, eventKeyString)
        {
            return this.registerInput(name, new RangeInputAdapter(eventKeyString));
        },
        registerState(name, eventKeyMap)
        {
            return this.registerInput(name, new StateInputAdapter(eventKeyMap));
        },
        toggle(force = undefined)
        {
            if (typeof force === 'undefined') force = !this._active;
            this._active = force;
            return this;
        },
        enable() { return this.toggle(true); },
        disable() { return this.toggle(false); },
        poll()
        {
            for(let adapter of this.inputs.values())
            {
                adapter.poll();
            }
        },
        update(eventKey, value)
        {
            let result;
            for(let adapter of this.inputs.values())
            {
                result |= adapter.update(eventKey, value);
            }
            return result;
        }
    };
}

var InputContext = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MIN_CONTEXT_PRIORITY: MIN_CONTEXT_PRIORITY,
    MAX_CONTEXT_PRIORITY: MAX_CONTEXT_PRIORITY,
    createContext: createContext
});

class Mouse
{
    constructor()
    {
        this.sourceElement = null;
        this.eventHandler = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    attach(sourceElement = document)
    {
        this.sourceElement = sourceElement;
        this.sourceElement.addEventListener('mousedown', this.onMouseDown);
        this.sourceElement.addEventListener('mouseup', this.onMouseUp);
        this.sourceElement.addEventListener('contextmenu', this.onContextMenu);
        document.addEventListener('mousemove', this.onMouseMove);
        return this;
    }

    detach()
    {
        this.sourceElement.removeEventListener('mousedown', this.onMouseDown);
        this.sourceElement.removeEventListener('mouseup', this.onMouseUp);
        this.sourceElement.removeEventListener('contextmenu', this.onContextMenu);
        document.removeEventListener('mousemove', this.onMouseMove);
        this.sourceElement = null;
        return this;
    }

    setEventHandler(eventHandler)
    {
        this.eventHandler = eventHandler;
        return this;
    }

    onMouseDown(e)
    {
        if (!this.eventHandler) return;

        let result;
        result = this.eventHandler.call(this, `mouse[${e.button}].down`, true);

        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    onMouseUp(e)
    {
        if (!this.eventHandler) return;

        e.preventDefault();
        e.stopPropagation();
        
        this.eventHandler.call(this, `mouse[${e.button}].up`, true);
    }

    onMouseMove(e)
    {
        if (!this.eventHandler) return;

        const clientCanvas = this.sourceElement;
        const clientWidth = clientCanvas.clientWidth;
        const clientHeight = clientCanvas.clientHeight;
        
        this.eventHandler.call(this, 'mouse[pos].x', (e.pageX - clientCanvas.offsetLeft) / clientWidth);
        this.eventHandler.call(this, 'mouse[pos].y', (e.pageY - clientCanvas.offsetTop) / clientHeight);
        this.eventHandler.call(this, 'mouse[pos].dx', e.movementX / clientWidth);
        this.eventHandler.call(this, 'mouse[pos].dy', e.movementY / clientHeight);
    }

    onContextMenu(e)
    {
        e.preventDefault();
        e.stopPropagation();
    }
}

class Keyboard
{
    constructor()
    {
        this.sourceElement = null;
        this.eventHandler = null;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    attach(sourceElement = document)
    {
        this.sourceElement = sourceElement;
        this.sourceElement.addEventListener('keydown', this.onKeyDown);
        this.sourceElement.addEventListener('keyup', this.onKeyUp);
        return this;
    }

    detach()
    {
        this.sourceElement.removeEventListener('keydown', this.onKeyDown);
        this.sourceElement.removeEventListener('keyup', this.onKeyUp);
        this.sourceElement = null;
        return this;
    }

    setEventHandler(eventHandler)
    {
        this.eventHandler = eventHandler;
        return this;
    }

    onKeyDown(e)
    {
        if (!this.eventHandler) return;

        let result;
        if (e.repeat)
        {
            result = this.eventHandler.call(this, `key[${e.key}].repeat`, true);
        }
        else
        {
            result = this.eventHandler.call(this, `key[${e.key}].down`, true);
        }

        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    onKeyUp(e)
    {
        if (!this.eventHandler) return;

        let result;
        result = this.eventHandler.call(this, `key[${e.key}].up`, true);
        
        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}

/**
 * @module InputSource
 */

function createSource()
{
    let result = {
        _contexts: new Array(MAX_CONTEXT_PRIORITY - MIN_CONTEXT_PRIORITY),
        element: null,
        keyboard: new Keyboard(),
        mouse: new Mouse(),
        attach(element)
        {
            this.element = element;
            this.keyboard.attach();
            this.mouse.attach(element);
            return this;
        },
        detach()
        {
            this.element = null;
            this.keyboard.detach();
            this.mouse.detach();
            return this;
        },
        addContext(context)
        {
            const priority = context.priority - MIN_CONTEXT_PRIORITY;
            if (!this._contexts[priority]) this._contexts[priority] = [];
            this._contexts[priority].push(context);
            return this;
        },
        removeContext(context)
        {
            const priority = context.priority - MIN_CONTEXT_PRIORITY;
            let contexts = this._contexts[priority];
            if (contexts)
            {
                contexts.splice(contexts.indexOf(context), 1);
            }
            return this;
        },
        poll()
        {
            for(let contexts of this._contexts)
            {
                if (contexts)
                {
                    for(let context of contexts)
                    {
                        if (context.active)
                        {
                            context.poll();
                        }
                    }
                }
            }
        },
        handleEvent(eventKeyString, value)
        {
            const eventKey = EventKey.parse(eventKeyString);
            for(let contexts of this._contexts)
            {
                if (contexts)
                {
                    for(let context of contexts)
                    {
                        if (context.active)
                        {
                            let result;
                            result = context.update(eventKey, value);
                            if (result)
                            {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
    };
    result.handleEvent = result.handleEvent.bind(result);
    result.keyboard.setEventHandler(result.handleEvent);
    result.mouse.setEventHandler(result.handleEvent);
    return result;
}

var InputSource = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createSource: createSource
});

let DOUBLE_ACTION_TIME = 300;

class DoubleActionInputAdapter extends ActionInputAdapter
{
    constructor(eventKeyStrings)
    {
        super(eventKeyStrings);

        this.actionTime = 0;
    }

    /** @override */
    update(eventKey, value = true)
    {
        let currentTime = Date.now();
        for(let targetEventKey of this.eventKeys)
        {
            if (targetEventKey.matches(eventKey))
            {
                if (value)
                {
                    if (currentTime - this.actionTime <= DOUBLE_ACTION_TIME)
                    {
                        this.actionTime = 0;
                        this.next = true;
                        return true;
                    }
                    else
                    {
                        this.actionTime = currentTime;
                        return false;
                    }
                }
                else
                {
                    this.next = false;
                    return true;
                }
            }
        }
        return false;
    }
}

/**
 * @module Input
 */

var source = createSource();
var context = createContext().attach(source);

// Default setup...
window.addEventListener('DOMContentLoaded', () => {
    if (!source.element)
    {
        let canvasElement = null;

        // Try resolve to <display-port> if exists...
        let displayElement = document.querySelector('display-port');
        if (displayElement)
        {
            canvasElement = displayElement.getCanvas();
        }
        // Otherwise, find a <canvas> element...
        else
        {
            canvasElement = document.querySelector('canvas');
        }

        if (canvasElement)
        {
            attachCanvas(canvasElement);
        }
    }
});

function attachCanvas(canvasElement)
{
    if (source.element) source.detach();
    return source.attach(canvasElement);
}

function createContext$1(priority = 0, active = true)
{
    return createContext().setPriority(priority).toggle(active).attach(source);
}

function createInput(adapter)
{
    return context.registerInput(getNextInputName(), adapter);
}

function createAction(...eventKeyStrings)
{
    return context.registerAction(getNextInputName(), ...eventKeyStrings);
}

function createRange(eventKeyString)
{
    return context.registerRange(getNextInputName(), eventKeyString);
}

function createState(eventKeyMap)
{
    return context.registerState(getNextInputName(), eventKeyMap);
}

function poll()
{
    return source.poll();
}

function handleEvent(eventKeyString, value)
{
    return source.handleEvent(eventKeyString, value);
}

var nextInputNameId = 1;
function getNextInputName()
{
    return `__input#${nextInputNameId++}`;
}

var _default = /*#__PURE__*/Object.freeze({
    __proto__: null,
    attachCanvas: attachCanvas,
    createContext: createContext$1,
    createInput: createInput,
    createAction: createAction,
    createRange: createRange,
    createState: createState,
    poll: poll,
    handleEvent: handleEvent
});

export { AbstractInputAdapter, ActionInputAdapter, DOUBLE_ACTION_TIME, DoubleActionInputAdapter, EventKey, _default as Input, InputContext, InputSource, Keyboard, Mouse, RangeInputAdapter, StateInputAdapter };
