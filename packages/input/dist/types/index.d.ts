/**
 * @typedef {number} BindingIndex
 *
 * @typedef BindingOptions
 * @property {boolean} inverted
 *
 * @typedef InputReadOnly
 * @property {number} value
 * @property {boolean} polling
 */
declare class InputBase$2 {
    /**
     * @abstract
     * @param {number} size The initial binding state size.
     */
    constructor(size: number);
    get polling(): boolean;
    /** @abstract */
    get value(): number;
    /** @protected */
    protected get size(): number;
    /** @private */
    private _size;
    /** @private */
    private _lastPollingTime;
    /**
     * Called to internally resize to accomodate more/less
     * binding states.
     *
     * @protected
     * @param {number} newSize
     */
    protected resize(newSize: number): void;
    /**
     * @abstract
     * @param {BindingIndex} code
     * @returns {number}
     */
    getState(code: BindingIndex$2): number;
    /**
     * @abstract
     * @param {BindingIndex} code
     * @param {number} value
     * @param {number} delta
     */
    onUpdate(code: BindingIndex$2, value: number, delta: number): void;
    /**
     * @abstract
     * @param {BindingIndex} code
     * @param {number} value
     */
    onStatus(code: BindingIndex$2, value: number): void;
    /**
     * Called to poll all bound states.
     *
     * @param {number} now
     */
    onPoll(now: number): void;
    /**
     * Called to bind a state to the given binding code.
     *
     * @param {BindingIndex} code
     * @param {BindingOptions} [opts]
     */
    onBind(code: BindingIndex$2, opts?: BindingOptions$2): void;
    /**
     * Called to unbind all states.
     */
    onUnbind(): void;
}
type BindingIndex$2 = number;
type BindingOptions$2 = {
    inverted: boolean;
};
type InputReadOnly = {
    value: number;
    polling: boolean;
};

/**
 * @typedef {import('./InputBase.js').BindingIndex} BindingIndex The binding index
 * @typedef {import('./InputBase.js').BindingOptions} BindingOptions The binding options
 *
 * @typedef AxisBindingState
 * @property {number} value
 * @property {number} delta
 * @property {boolean} inverted
 *
 * @typedef AxisReadOnly
 * @property {number} value
 * @property {number} delta
 * @property {boolean} polling
 */
declare class Axis extends InputBase$2 {
    /** @returns {AxisBindingState} */
    static createAxisBindingState(): AxisBindingState;
    /**
     * @param {number} [size]
     */
    constructor(size?: number);
    /** @returns {number} */
    get delta(): number;
    /**
     * @private
     * @type {Array<AxisBindingState>}
     */
    private _state;
    /** @private */
    private _value;
    /** @private */
    private _delta;
    /**
     * @protected
     * @param {BindingIndex} code
     * @param {number} x
     * @param {number} dx
     */
    protected onAxisMove(code: BindingIndex$1, x: number, dx: number): void;
    /**
     * @protected
     * @param {BindingIndex} code
     * @param {number} dx
     */
    protected onAxisChange(code: BindingIndex$1, dx: number): void;
    /**
     * @protected
     * @param {BindingIndex} code
     * @param {number} x
     */
    protected onAxisStatus(code: BindingIndex$1, x: number): void;
}
/**
 * The binding index
 */
type BindingIndex$1 = BindingIndex$2;
type AxisBindingState = {
    value: number;
    delta: number;
    inverted: boolean;
};
type AxisReadOnly$1 = {
    value: number;
    delta: number;
    polling: boolean;
};

/**
 * @typedef {import('./InputBase.js').BindingIndex} BindingIndex
 * @typedef {import('./InputBase.js').BindingOptions} BindingOptions
 *
 * @typedef ButtonReadOnly
 * @property {number} value
 * @property {boolean} pressed
 * @property {boolean} repeated
 * @property {boolean} released
 * @property {boolean} down
 * @property {boolean} polling
 */
declare const CLEAR_POLL_BITS: 241;
declare const CLEAR_DOWN_STATE_BITS: 254;
declare const CLEAR_INVERTED_MODIFIER_BITS: 239;
declare const DOWN_STATE_BIT: 1;
declare const PRESSED_STATE_BIT: 2;
declare const REPEATED_STATE_BIT: 4;
declare const RELEASED_STATE_BIT: 8;
declare const INVERTED_MODIFIER_BIT: 16;
declare class Button extends InputBase$2 {
    /**
     * @param {number} [size]
     */
    constructor(size?: number);
    /** @returns {boolean} */
    get pressed(): boolean;
    /** @returns {boolean} */
    get repeated(): boolean;
    /** @returns {boolean} */
    get released(): boolean;
    /** @returns {boolean} */
    get down(): boolean;
    /** @private */
    private _state;
    /** @private */
    private _value;
    /** @private */
    private _down;
    /** @private */
    private _pressed;
    /** @private */
    private _repeated;
    /** @private */
    private _released;
    /**
     * @protected
     * @param {BindingIndex} code
     */
    protected onButtonPressed(code: BindingIndex): void;
    /**
     * @protected
     * @param {BindingIndex} code
     */
    protected onButtonReleased(code: BindingIndex): void;
    /**
     * @protected
     * @param {BindingIndex} code
     * @param {boolean} isDown
     */
    protected onButtonStatus(code: BindingIndex, isDown: boolean): void;
}
type BindingIndex = BindingIndex$2;
type ButtonReadOnly$2 = {
    value: number;
    pressed: boolean;
    repeated: boolean;
    released: boolean;
    down: boolean;
    polling: boolean;
};

/**
 * @typedef InputDeviceEvent
 * @property {EventTarget} target
 * @property {string} device
 * @property {string} code
 * @property {string} event
 * @property {number} [value] The input value of the triggered event (usually this is 1).
 * @property {number} [movement] The change in value for the triggered event.
 * @property {boolean} [control] Whether any control keys are down (false if up).
 * @property {boolean} [shift] Whether any shift keys are down (false if up).
 * @property {boolean} [alt] Whether any alt keys are down (false if up).
 *
 * @callback InputDeviceEventListener
 * @param {InputDeviceEvent} e
 */
/**
 * A class that represents a raw system device that
 * emits input events.
 */
declare class InputDevice {
    /** @abstract */
    static isAxis(code: any): boolean;
    /** @abstract */
    static isButton(code: any): boolean;
    /**
     * @param {string} deviceName
     * @param {EventTarget} eventTarget
     */
    constructor(deviceName: string, eventTarget: EventTarget);
    name: string;
    eventTarget: EventTarget;
    /**
     * @private
     * @type {Record<string, Array<InputDeviceEventListener>>}
     */
    private listeners;
    /**
     * @param {EventTarget} eventTarget
     */
    setEventTarget(eventTarget: EventTarget): void;
    destroy(): void;
    /**
     * @param {string} event
     * @param {InputDeviceEventListener} listener
     */
    addEventListener(event: string, listener: InputDeviceEventListener): void;
    /**
     * @param {string} event
     * @param {InputDeviceEventListener} listener
     */
    removeEventListener(event: string, listener: InputDeviceEventListener): void;
    /**
     * @param {InputDeviceEvent} e
     * @returns {boolean} Whether the input event should be consumed.
     */
    dispatchInputEvent(e: InputDeviceEvent$1): boolean;
}
type InputDeviceEvent$1 = {
    target: EventTarget;
    device: string;
    code: string;
    event: string;
    /**
     * The input value of the triggered event (usually this is 1).
     */
    value?: number;
    /**
     * The change in value for the triggered event.
     */
    movement?: number;
    /**
     * Whether any control keys are down (false if up).
     */
    control?: boolean;
    /**
     * Whether any shift keys are down (false if up).
     */
    shift?: boolean;
    /**
     * Whether any alt keys are down (false if up).
     */
    alt?: boolean;
};
type InputDeviceEventListener = (e: InputDeviceEvent$1) => any;

/** @typedef {import('./InputDevice.js').InputDeviceEvent} InputDeviceEvent */
/**
 * A class that listens to the keyboard events from the event target and
 * transforms the events into a valid {@link InputEvent} for the added
 * listeners.
 *
 * - This device uses the `event.code` standard to reference each key.
 * - Use this to help you determine the key code: https://keycode.info/
 */
declare class KeyboardDevice extends InputDevice {
    /**
     * Constructs a listening keyboard with no listeners (yet).
     *
     * @param {string} deviceName
     * @param {EventTarget} eventTarget
     * @param {object} [opts] Any additional options.
     * @param {boolean} [opts.ignoreRepeat] Whether to
     * accept repeated key events.
     */
    constructor(deviceName: string, eventTarget: EventTarget, opts?: {
        ignoreRepeat?: boolean;
    });
    ignoreRepeat: boolean;
    /**
     * @private
     * @type {InputDeviceEvent}
     */
    private _eventObject;
    /**
     * @private
     * @param {KeyboardEvent} e
     */
    private onKeyDown;
    /**
     * @private
     * @param {KeyboardEvent} e
     */
    private onKeyUp;
}

/**
 * A class that listens to the mouse events from the event target and
 * transforms the events into a valid {@link InputDeviceEvent} for its
 * listeners.
 *
 * - PosX
 * - PosY
 * - WheelX
 * - WheelY
 * - WheelZ
 * - Button0 (left button)
 * - Button1 (middle button)
 * - Button2 (right button)
 * - Button3 (next button)
 * - Button4 (back button)
 */
declare class MouseDevice extends InputDevice {
    /**
     * Constructs a listening mouse with no listeners (yet).
     *
     * @param {string} deviceName
     * @param {EventTarget} eventTarget
     * @param {Object} [opts] Any additional options.
     * @param {Boolean} [opts.eventsOnFocus=true] Whether to capture events only when it has focus.
     */
    constructor(deviceName: string, eventTarget: EventTarget, opts?: {
        eventsOnFocus?: boolean;
    });
    eventsOnFocus: boolean;
    canvasTarget: any;
    /** @private */
    private _downHasFocus;
    /**
     * @private
     * @type {InputDeviceEvent}
     */
    private _eventObject;
    /**
     * @private
     * @type {InputDeviceEvent}
     */
    private _positionObject;
    /**
     * @private
     * @type {InputDeviceEvent}
     */
    private _wheelObject;
    /**
     * @private
     * @param {MouseEvent} e
     */
    private onMouseDown;
    /**
     * @private
     * @param {MouseEvent} e
     */
    private onMouseUp;
    /**
     * @private
     * @param {MouseEvent} e
     */
    private onMouseMove;
    /**
     * @private
     * @param {MouseEvent} e
     */
    private onContextMenu;
    /**
     * @private
     * @param {WheelEvent} e
     */
    private onWheel;
    setPointerLock(force?: boolean): void;
    hasPointerLock(): boolean;
    /** @private */
    private getCanvasFromEventTarget;
}

declare class InputCode extends HTMLElement {
    static define(customElements?: CustomElementRegistry): void;
    /** @override */
    static get observedAttributes(): string[];
    set disabled(arg: boolean);
    /** @returns {boolean} */
    get disabled(): boolean;
    set value(arg: string);
    /** @returns {string} */
    get value(): string;
    set name(arg: string);
    /** @returns {string} */
    get name(): string;
    /** @private */
    private _name;
    /** @private */
    private _value;
    /** @private */
    private _disabled;
    /** @private */
    private _kbdElement;
    /** @private */
    private _nameElement;
    /** @private */
    private _valueElement;
    /** @override */
    attributeChangedCallback(attribute: any, prev: any, value: any): void;
    /** @override */
    connectedCallback(): void;
}

/**
 * A class that maps inputs to their respective key bindings.
 *
 * This does not handle input state (refer to InputBase.js) nor
 * input events (refer to InputDevice.js). It is only responsible
 * for the redirection of key codes to their bound input. Usually
 * this is used together with the interfaces referenced above.
 */
declare class InputBindings$1 {
    /**
     * @private
     * @type {Record<DeviceName, Record<KeyCode, Array<Binding>>}
     */
    private bindingMap;
    /**
     * @private
     * @type {Map<InputBase, Array<Binding>>}
     */
    private inputMap;
    clear(): void;
    /**
     * @param {InputBase} input
     * @param {DeviceName} device
     * @param {KeyCode} code
     * @param {BindingOptions} [opts]
     */
    bind(input: InputBase$1, device: DeviceName$1, code: KeyCode$1, opts?: BindingOptions$1): void;
    /**
     * @param {InputBase} input
     */
    unbind(input: InputBase$1): void;
    /**
     * @param {InputBase} input
     * @returns {boolean}
     */
    isBound(input: InputBase$1): boolean;
    /** @returns {IterableIterator<InputBase>} */
    getInputs(): IterableIterator<InputBase$1>;
    /** @returns {IterableIterator<Binding>} */
    getBindingsByInput(input: any): IterableIterator<Binding>;
    /**
     * @param {DeviceName} device
     * @param {KeyCode} code
     * @returns {IterableIterator<Binding>}
     */
    getBindings(device: DeviceName$1, code: KeyCode$1): IterableIterator<Binding>;
}
type InputBase$1 = InputBase$2;
type BindingOptions$1 = BindingOptions$2;
type DeviceName$1 = string;
type KeyCode$1 = string;
/**
 * @typedef {import('./axisbutton/InputBase.js').InputBase} InputBase
 * @typedef {import('./axisbutton/InputBase.js').BindingOptions} BindingOptions
 *
 * @typedef {string} DeviceName
 * @typedef {string} KeyCode
 */
declare class Binding {
    /**
     * @param {DeviceName} device The name of the device
     * @param {KeyCode} code The key code for the device
     * @param {InputBase} input The parent input
     * @param {number} index The binding index for the input
     */
    constructor(device: DeviceName$1, code: KeyCode$1, input: InputBase$1, index: number);
    /** Name of the device */
    device: string;
    /** The key code for the device */
    code: string;
    /** The parent input */
    input: InputBase$2;
    /** The binding index for the input */
    index: number;
}

/**
 * @typedef {import('../device/InputDevice.js').InputDevice} InputDevice
 * @typedef {import('../device/InputDevice.js').InputDeviceEvent} InputDeviceEvent
 * @typedef {import('../axisbutton/InputBase.js').InputBase} InputBase
 * @typedef {import('../InputBindings.js').DeviceName} DeviceName
 * @typedef {import('../InputBindings.js').KeyCode} KeyCode
 * @typedef {import('../InputBindings.js').BindingOptions} BindingOptions
 *
 * @typedef {string} InputName
 */
declare class InputPort extends HTMLElement {
    static define(customElements?: CustomElementRegistry): void;
    /** @override */
    static get observedAttributes(): string[];
    set autopoll(arg: boolean);
    /** @returns {boolean} */
    get autopoll(): boolean;
    set for(arg: string);
    /** @returns {string} */
    get for(): string;
    /** @private */
    private _titleElement;
    /** @private */
    private _pollElement;
    /** @private */
    private _focusElement;
    /** @private */
    private _bodyElement;
    /** @private */
    private _outputElements;
    /** @private */
    private onAnimationFrame;
    /** @private */
    private animationFrameHandle;
    /** @private */
    private _for;
    /** @private */
    private _eventTarget;
    /** @private */
    private _autopoll;
    /**
     * @private
     * @type {Record<string, Axis|Button>}
     */
    private inputs;
    /**
     * @private
     * @type {Array<InputDevice>}
     */
    private devices;
    /** @private */
    private bindings;
    /** @private */
    private adapter;
    /** @private */
    private autopoller;
    /** @private */
    private anyButton;
    /** @private */
    private anyButtonDevice;
    /** @private */
    private anyButtonCode;
    /** @private */
    private anyAxis;
    /** @private */
    private anyAxisDevice;
    /** @private */
    private anyAxisCode;
    /**
     * @private
     * @param {InputDeviceEvent} e
     */
    private onInput;
    /** @private */
    private onEventTargetFocus;
    /** @private */
    private onEventTargetBlur;
    /** @override */
    connectedCallback(): void;
    /** @override */
    disconnectedCallback(): void;
    /** @override */
    attributeChangedCallback(attribute: any, prev: any, value: any): void;
    /**
     * @private
     * @param {number} now
     */
    private onPoll;
    /** @private */
    private onBind;
    /** @private */
    private onUnbind;
    /**
     * @param {number} now
     */
    poll(now?: number): void;
    /**
     * @param {InputName} name
     * @param {DeviceName} device
     * @param {KeyCode} code
     * @param {BindingOptions} [opts]
     */
    bindButton(name: InputName, device: DeviceName, code: KeyCode, opts?: BindingOptions): void;
    /**
     * @param {string} name
     * @param {DeviceName} device
     * @param {KeyCode} code
     * @param {BindingOptions} [opts]
     */
    bindAxis(name: string, device: DeviceName, code: KeyCode, opts?: BindingOptions): void;
    /**
     * @param {string} name
     * @param {DeviceName} device
     * @param {KeyCode} negativeCode
     * @param {KeyCode} positiveCode
     */
    bindAxisButtons(name: string, device: DeviceName, negativeCode: KeyCode, positiveCode: KeyCode): void;
    /**
     * @param {string} name
     */
    unbindButton(name: string): void;
    /**
     * @param {string} name
     */
    unbindAxis(name: string): void;
    /**
     * Get the input for the given name. Assumes the input already exists for the name.
     * @param {InputName} name
     * @returns {InputBase}
     */
    getInput(name: InputName): InputBase;
    /**
     * Get the button for the given name. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {Button}
     */
    getButton(name: InputName): Button;
    /**
     * Get the axis for the given name. Assumes an axis already exists for the name.
     * @param {InputName} name
     * @returns {Axis}
     */
    getAxis(name: InputName): Axis;
    /**
     * Whether a button exists for the name and that it is of type {@link Button}.
     * @returns {boolean}
     */
    hasButton(name: any): boolean;
    /**
     * Whether an axis exists for the name and that it is of type {@link Axis}.
     * @returns {boolean}
     */
    hasAxis(name: any): boolean;
    /**
     * Get whether a button for the given name is down. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {boolean}
     */
    isButtonDown(name: InputName): boolean;
    /**
     * Get whether a button for the given name is pressed. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {boolean}
     */
    isButtonPressed(name: InputName): boolean;
    /**
     * Get whether a button for the given name is released. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {boolean}
     */
    isButtonReleased(name: InputName): boolean;
    /**
     * @param {InputName} name
     * @returns {number}
     */
    getInputValue(name: InputName): number;
    /**
     * @param {InputName} name
     * @returns {number}
     */
    getButtonValue(name: InputName): number;
    /**
     * @param {InputName} name
     * @returns {number}
     */
    getAxisValue(name: InputName): number;
    /**
     * @param {InputName} name
     * @returns {number}
     */
    getAxisDelta(name: InputName): number;
    /** @returns {boolean} */
    isAnyButtonDown(include?: any): boolean;
    /** @returns {boolean} */
    isAnyButtonPressed(include?: any): boolean;
    /** @returns {boolean} */
    isAnyButtonReleased(include?: any): boolean;
    /** @returns {number} */
    getAnyAxisValue(include?: any): number;
    /** @returns {number} */
    getAnyAxisDelta(include?: any): number;
    getLastButtonDevice(): string;
    getLastButtonCode(): string;
    getLastAxisDevice(): string;
    getLastAxisCode(): string;
    /** @returns {MouseDevice} */
    getMouse(): MouseDevice;
    /** @returns {KeyboardDevice} */
    getKeyboard(): KeyboardDevice;
    /** @private */
    private updateTable;
    /** @private */
    private updateTableValues;
    /** @private */
    private updatePollStatus;
    /** @private */
    private updateEventTarget;
}
type InputDeviceEvent = InputDeviceEvent$1;
type InputBase = InputBase$2;
type DeviceName = DeviceName$1;
type KeyCode = KeyCode$1;
type BindingOptions = BindingOptions$1;
type InputName = string;

/**
 * @callback OnPollCallback
 * @param {number} now
 *
 * @typedef Pollable
 * @property {OnPollCallback} onPoll
 */
/**
 * A class to automatically call onPoll() on animation frame.
 */
declare class AutoPoller {
    /**
     * @param {Pollable} pollable
     */
    constructor(pollable: Pollable);
    /** @private */
    private onAnimationFrame;
    /** @private */
    private animationFrameHandle;
    /** @private */
    private pollable;
    get running(): boolean;
    start(): void;
    stop(): void;
}
type OnPollCallback = (now: number) => any;
type Pollable = {
    onPoll: OnPollCallback;
};

/** @typedef {import('./InputBindings.js').InputBindings} InputBindings */
/**
 * A class to listen and transform device events through
 * each mapped bindings into an input state.
 *
 * It requires onPoll() to be called to keep the input
 * state up to date. This is usually called from
 * requestAnimationFrame() or using the AutoPoller.
 */
declare class DeviceInputAdapter {
    /**
     * @param {InputBindings} bindings
     */
    constructor(bindings: InputBindings);
    onInput(e: any): boolean;
    onPoll(now: any): void;
    bindings: InputBindings$1;
}
type InputBindings = InputBindings$1;

declare class Keyboard {
    constructor(eventTarget: any, opts: any);
    /** @type {ButtonReadOnly} */
    KeyA: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyB: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyC: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyD: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyE: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyF: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyG: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyH: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyI: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyJ: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyK: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyL: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyM: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyN: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyO: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyP: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyQ: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyR: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyS: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyT: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyU: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyV: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyW: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyX: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyY: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    KeyZ: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Digit0: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Digit1: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Digit2: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Digit3: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Digit4: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Digit5: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Digit6: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Digit7: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Digit8: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Digit9: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Minus: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Equal: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    BracketLeft: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    BracketRight: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Semicolon: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Quote: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Backquote: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Backslash: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Comma: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Period: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Slash: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Escape: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Space: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    CapsLock: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Backspace: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Delete: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Tab: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    Enter: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    ArrowUp: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    ArrowDown: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    ArrowLeft: ButtonReadOnly$1;
    /** @type {ButtonReadOnly} */
    ArrowRight: ButtonReadOnly$1;
    destroy(): void;
    [KEYBOARD_SOURCE]: {
        device: KeyboardDevice;
        bindings: InputBindings$1;
        adapter: DeviceInputAdapter;
        autopoller: AutoPoller;
    };
}
type ButtonReadOnly$1 = ButtonReadOnly$2;
/**
 * @typedef {import('./axisbutton/Button.js').ButtonReadOnly} ButtonReadOnly
 */
declare const KEYBOARD_SOURCE: unique symbol;

declare class Mouse {
    constructor(eventTarget: any, opts: any);
    /** @type {AxisReadOnly} */
    PosX: AxisReadOnly;
    /** @type {AxisReadOnly} */
    PosY: AxisReadOnly;
    /** @type {AxisReadOnly} */
    WheelX: AxisReadOnly;
    /** @type {AxisReadOnly} */
    WheelY: AxisReadOnly;
    /** @type {AxisReadOnly} */
    WheelZ: AxisReadOnly;
    /** @type {ButtonReadOnly} */
    Button0: ButtonReadOnly;
    /** @type {ButtonReadOnly} */
    Button1: ButtonReadOnly;
    /** @type {ButtonReadOnly} */
    Button2: ButtonReadOnly;
    /** @type {ButtonReadOnly} */
    Button3: ButtonReadOnly;
    /** @type {ButtonReadOnly} */
    Button4: ButtonReadOnly;
    destroy(): void;
    [MOUSE_SOURCE]: {
        device: MouseDevice;
        bindings: InputBindings$1;
        adapter: DeviceInputAdapter;
        autopoller: AutoPoller;
    };
}
type AxisReadOnly = AxisReadOnly$1;
type ButtonReadOnly = ButtonReadOnly$2;
/**
 * @typedef {import('./axisbutton/Axis.js').AxisReadOnly} AxisReadOnly
 * @typedef {import('./axisbutton/Button.js').ButtonReadOnly} ButtonReadOnly
 */
declare const MOUSE_SOURCE: unique symbol;

export { AutoPoller, Axis, AxisBindingState, Button, CLEAR_DOWN_STATE_BITS, CLEAR_INVERTED_MODIFIER_BITS, CLEAR_POLL_BITS, DOWN_STATE_BIT, DeviceInputAdapter, INVERTED_MODIFIER_BIT, InputCode, InputDeviceEvent, InputDeviceEventListener, InputName, InputPort, InputReadOnly, Keyboard, KeyboardDevice, Mouse, MouseDevice, OnPollCallback, PRESSED_STATE_BIT, Pollable, RELEASED_STATE_BIT, REPEATED_STATE_BIT };
