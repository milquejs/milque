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

declare class KeyCode$5 {
    /**
     * @param {string} string
     * @returns {KeyCode}
     */
    static parse(string: string): KeyCode$5;
    /**
     * @param {string} device
     * @param {string} code
     */
    constructor(device: string, code: string);
    device: string;
    code: string;
    /** @override */
    toString(): string;
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
    bind(input: InputBase$1, device: DeviceName$1, code: KeyCode$4, opts?: BindingOptions$1): void;
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
    getBindings(device: DeviceName$1, code: KeyCode$4): IterableIterator<Binding>;
}
type InputBase$1 = InputBase$2;
type BindingOptions$1 = BindingOptions$2;
type DeviceName$1 = string;
type KeyCode$4 = string;
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
    constructor(device: DeviceName$1, code: KeyCode$4, input: InputBase$1, index: number);
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
declare class InputDevice$1 {
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
    dispatchInputEvent(e: InputDeviceEvent): boolean;
}
type InputDeviceEvent = {
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
type InputDeviceEventListener = (e: InputDeviceEvent) => any;

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
declare class MouseDevice extends InputDevice$1 {
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

/** @typedef {import('./InputDevice.js').InputDeviceEvent} InputDeviceEvent */
/**
 * A class that listens to the keyboard events from the event target and
 * transforms the events into a valid {@link InputEvent} for the added
 * listeners.
 *
 * - This device uses the `event.code` standard to reference each key.
 * - Use this to help you determine the key code: https://keycode.info/
 */
declare class KeyboardDevice extends InputDevice$1 {
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
 * @typedef {import('./device/InputDevice.js').InputDevice} InputDevice
 * @typedef {import('./device/InputDevice.js').InputDeviceEvent} InputDeviceEvent
 * @typedef {import('./axisbutton/InputBase.js').InputBase} InputBase
 * @typedef {import('./InputBindings.js').DeviceName} DeviceName
 * @typedef {import('./InputBindings.js').KeyCode} KeyCode
 * @typedef {import('./InputBindings.js').BindingOptions} BindingOptions
 *
 * @typedef {import('./binding/InputBinding.js').InputBinding} InputBinding
 *
 * @typedef {string} InputName
 */
/**
 * @typedef {'bind'|'unbind'|'focus'|'blur'} InputContextEventType
 * @typedef {(e: InputContextEvent) => boolean} InputContextEventListener
 * @typedef InputContextEvent
 * @property {InputContextEventType} type
 */
declare class InputContext {
    /**
     * @param {EventTarget} eventTarget
     * @param {object} [opts]
     */
    constructor(eventTarget: EventTarget, opts?: object);
    /**
     * @type {Record<string, Axis|Button>}
     */
    inputs: Record<string, Axis | Button>;
    /**
     * @type {Array<InputDevice>}
     */
    devices: Array<InputDevice>;
    bindings: InputBindings$1;
    adapter: DeviceInputAdapter;
    autopoller: AutoPoller;
    /** @protected */
    protected eventTarget: EventTarget;
    /** @protected */
    protected anyButton: Button;
    /** @protected */
    protected anyButtonDevice: string;
    /** @protected */
    protected anyButtonCode: string;
    /** @protected */
    protected anyAxis: Axis;
    /** @protected */
    protected anyAxisDevice: string;
    /** @protected */
    protected anyAxisCode: string;
    /**
     * @private
     * @type {Record<InputContextEventType, Array<InputContextEventListener>>}
     */
    private listeners;
    /**
     * @private
     * @param {InputDeviceEvent} e
     */
    private onInput;
    /** @private */
    private onEventTargetBlur;
    /** @private */
    private onEventTargetFocus;
    set autopoll(arg: boolean);
    get autopoll(): boolean;
    destroy(): void;
    setEventTarget(eventTarget: any): void;
    toggleAutoPoll(force?: any): void;
    /**
     * @param {InputContextEventType} event
     * @param {InputContextEventListener} listener
     */
    addEventListener(event: InputContextEventType, listener: InputContextEventListener): void;
    /**
     * @param {InputContextEventType} event
     * @param {InputContextEventListener} listener
     */
    removeEventListener(event: InputContextEventType, listener: InputContextEventListener): void;
    /**
     * @param {InputContextEvent} e
     * @returns {boolean} Whether the event should be consumed.
     */
    dispatchEvent(e: InputContextEvent): boolean;
    /**
     * @param {number} now
     */
    poll(now?: number): void;
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
     * @param {Array<InputBinding>} bindings
     */
    bindBindings(bindings: Array<InputBinding$1>): void;
    /**
     * @param {InputName} name
     * @param {DeviceName} device
     * @param {KeyCode} code
     * @param {BindingOptions} [opts]
     */
    bindButton(name: InputName, device: DeviceName, code: KeyCode$3, opts?: BindingOptions): void;
    /**
     * @param {string} name
     * @param {DeviceName} device
     * @param {KeyCode} code
     * @param {BindingOptions} [opts]
     */
    bindAxis(name: string, device: DeviceName, code: KeyCode$3, opts?: BindingOptions): void;
    /**
     * @param {string} name
     * @param {DeviceName} device
     * @param {KeyCode} negativeCode
     * @param {KeyCode} positiveCode
     */
    bindAxisButtons(name: string, device: DeviceName, negativeCode: KeyCode$3, positiveCode: KeyCode$3): void;
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
}
type InputDevice = InputDevice$1;
type InputBase = InputBase$2;
type DeviceName = DeviceName$1;
type KeyCode$3 = KeyCode$4;
type BindingOptions = BindingOptions$1;
type InputBinding$1 = InputBinding;
type InputName = string;
type InputContextEventType = 'bind' | 'unbind' | 'focus' | 'blur';
type InputContextEventListener = (e: InputContextEvent) => boolean;
type InputContextEvent = {
    type: InputContextEventType;
};

declare class InputBinding {
    /**
     * @param {string} name
     */
    constructor(name: string);
    /** @returns {boolean} */
    get polling(): boolean;
    /** @returns {number} */
    get value(): number;
    /** @protected */
    protected name: string;
    /** @protected */
    protected ref: any;
    /**
     * @abstract
     * @param {import('../InputContext.js').InputContext} inputContext
     */
    register(inputContext: InputContext): void;
    /**
     * @param {number} code
     * @returns {number}
     */
    getState(code: number): number;
}

/** @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode */
declare class AxisBinding extends InputBinding {
    /**
     * @param {string} name
     * @param {string} device
     * @param {string} code
     * @param {object} [opts]
     * @returns {AxisBinding}
     */
    static fromBind(name: string, device: string, code: string, opts?: object): AxisBinding;
    /**
     * @param {string} name
     * @param {...string} strings
     * @returns {AxisBinding}
     */
    static fromString(name: string, ...strings: string[]): AxisBinding;
    /**
     * @param {string} name
     * @param {KeyCode|Array<KeyCode>} keyCodes
     * @param {object} [opts]
     */
    constructor(name: string, keyCodes: KeyCode$2 | Array<KeyCode$2>, opts?: object);
    /** @returns {number} */
    get delta(): number;
    /** @protected */
    protected keyCodes: KeyCode$5[];
    /** @protected */
    protected opts: any;
}
type KeyCode$2 = KeyCode$5;

/** @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode */
declare class ButtonBinding extends InputBinding {
    /**
     * @param {string} name
     * @param {string} device
     * @param {string} code
     * @param {object} [opts]
     * @returns {ButtonBinding}
     */
    static fromBind(name: string, device: string, code: string, opts?: object): ButtonBinding;
    /**
     * @param {string} name
     * @param {...string} strings
     * @returns {ButtonBinding}
     */
    static fromString(name: string, ...strings: string[]): ButtonBinding;
    /**
     * @param {string} name
     * @param {KeyCode|Array<KeyCode>} keyCodes
     * @param {object} [opts]
     */
    constructor(name: string, keyCodes: KeyCode$1 | Array<KeyCode$1>, opts?: object);
    /** @returns {boolean} */
    get pressed(): boolean;
    /** @returns {boolean} */
    get repeated(): boolean;
    /** @returns {boolean} */
    get released(): boolean;
    /** @returns {boolean} */
    get down(): boolean;
    /** @protected */
    protected keyCodes: KeyCode$5[];
    /** @protected */
    protected opts: any;
}
type KeyCode$1 = KeyCode$5;

/** @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode */
declare class AxisButtonBinding extends AxisBinding {
    /**
     * @param {string} name
     * @param {string} device
     * @param {string} negativeCode
     * @param {string} positiveCode
     * @returns {AxisButtonBinding}
     */
    static fromBind(name: string, device: string, negativeCode: string, positiveCode: string): AxisButtonBinding;
    /**
     * @param {string} name
     * @param {KeyCode} negativeKeyCode
     * @param {KeyCode} positiveKeyCode
     */
    constructor(name: string, negativeKeyCode: KeyCode, positiveKeyCode: KeyCode);
    /** @protected */
    protected negativeKeyCode: KeyCode$5;
    /** @protected */
    protected positiveKeyCode: KeyCode$5;
}
type KeyCode = KeyCode$5;

declare function from(device: any, code: any): KeyCode$5;
declare function isKeyCode(object: any): boolean;
declare const KEYBOARD: "Keyboard";
declare const MOUSE: "Mouse";
declare const KEY_A: KeyCode$5;
declare const KEY_B: KeyCode$5;
declare const KEY_C: KeyCode$5;
declare const KEY_D: KeyCode$5;
declare const KEY_E: KeyCode$5;
declare const KEY_F: KeyCode$5;
declare const KEY_G: KeyCode$5;
declare const KEY_H: KeyCode$5;
declare const KEY_I: KeyCode$5;
declare const KEY_J: KeyCode$5;
declare const KEY_K: KeyCode$5;
declare const KEY_L: KeyCode$5;
declare const KEY_M: KeyCode$5;
declare const KEY_N: KeyCode$5;
declare const KEY_O: KeyCode$5;
declare const KEY_P: KeyCode$5;
declare const KEY_Q: KeyCode$5;
declare const KEY_R: KeyCode$5;
declare const KEY_S: KeyCode$5;
declare const KEY_T: KeyCode$5;
declare const KEY_U: KeyCode$5;
declare const KEY_V: KeyCode$5;
declare const KEY_W: KeyCode$5;
declare const KEY_X: KeyCode$5;
declare const KEY_Y: KeyCode$5;
declare const KEY_Z: KeyCode$5;
declare const DIGIT_0: KeyCode$5;
declare const DIGIT_1: KeyCode$5;
declare const DIGIT_2: KeyCode$5;
declare const DIGIT_3: KeyCode$5;
declare const DIGIT_4: KeyCode$5;
declare const DIGIT_5: KeyCode$5;
declare const DIGIT_6: KeyCode$5;
declare const DIGIT_7: KeyCode$5;
declare const DIGIT_8: KeyCode$5;
declare const DIGIT_9: KeyCode$5;
declare const MINUS: KeyCode$5;
declare const EQUAL: KeyCode$5;
declare const BRACKET_LEFT: KeyCode$5;
declare const BRACKET_RIGHT: KeyCode$5;
declare const SEMICOLON: KeyCode$5;
declare const QUOTE: KeyCode$5;
declare const BACKQUOTE: KeyCode$5;
declare const BACKSLASH: KeyCode$5;
declare const COMMA: KeyCode$5;
declare const PERIOD: KeyCode$5;
declare const SLASH: KeyCode$5;
declare const ESCAPE: KeyCode$5;
declare const SPACE: KeyCode$5;
declare const CAPS_LOCK: KeyCode$5;
declare const BACKSPACE: KeyCode$5;
declare const DELETE: KeyCode$5;
declare const TAB: KeyCode$5;
declare const ENTER: KeyCode$5;
declare const ARROW_UP: KeyCode$5;
declare const ARROW_DOWN: KeyCode$5;
declare const ARROW_LEFT: KeyCode$5;
declare const ARROW_RIGHT: KeyCode$5;
declare const MOUSE_BUTTON_0: KeyCode$5;
declare const MOUSE_BUTTON_1: KeyCode$5;
declare const MOUSE_BUTTON_2: KeyCode$5;
declare const MOUSE_BUTTON_3: KeyCode$5;
declare const MOUSE_BUTTON_4: KeyCode$5;
declare const MOUSE_POS_X: KeyCode$5;
declare const MOUSE_POS_Y: KeyCode$5;
declare const MOUSE_WHEEL_X: KeyCode$5;
declare const MOUSE_WHEEL_Y: KeyCode$5;
declare const MOUSE_WHEEL_Z: KeyCode$5;

declare const KeyCodes_from: typeof from;
declare const KeyCodes_isKeyCode: typeof isKeyCode;
declare const KeyCodes_KEYBOARD: typeof KEYBOARD;
declare const KeyCodes_MOUSE: typeof MOUSE;
declare const KeyCodes_KEY_A: typeof KEY_A;
declare const KeyCodes_KEY_B: typeof KEY_B;
declare const KeyCodes_KEY_C: typeof KEY_C;
declare const KeyCodes_KEY_D: typeof KEY_D;
declare const KeyCodes_KEY_E: typeof KEY_E;
declare const KeyCodes_KEY_F: typeof KEY_F;
declare const KeyCodes_KEY_G: typeof KEY_G;
declare const KeyCodes_KEY_H: typeof KEY_H;
declare const KeyCodes_KEY_I: typeof KEY_I;
declare const KeyCodes_KEY_J: typeof KEY_J;
declare const KeyCodes_KEY_K: typeof KEY_K;
declare const KeyCodes_KEY_L: typeof KEY_L;
declare const KeyCodes_KEY_M: typeof KEY_M;
declare const KeyCodes_KEY_N: typeof KEY_N;
declare const KeyCodes_KEY_O: typeof KEY_O;
declare const KeyCodes_KEY_P: typeof KEY_P;
declare const KeyCodes_KEY_Q: typeof KEY_Q;
declare const KeyCodes_KEY_R: typeof KEY_R;
declare const KeyCodes_KEY_S: typeof KEY_S;
declare const KeyCodes_KEY_T: typeof KEY_T;
declare const KeyCodes_KEY_U: typeof KEY_U;
declare const KeyCodes_KEY_V: typeof KEY_V;
declare const KeyCodes_KEY_W: typeof KEY_W;
declare const KeyCodes_KEY_X: typeof KEY_X;
declare const KeyCodes_KEY_Y: typeof KEY_Y;
declare const KeyCodes_KEY_Z: typeof KEY_Z;
declare const KeyCodes_DIGIT_0: typeof DIGIT_0;
declare const KeyCodes_DIGIT_1: typeof DIGIT_1;
declare const KeyCodes_DIGIT_2: typeof DIGIT_2;
declare const KeyCodes_DIGIT_3: typeof DIGIT_3;
declare const KeyCodes_DIGIT_4: typeof DIGIT_4;
declare const KeyCodes_DIGIT_5: typeof DIGIT_5;
declare const KeyCodes_DIGIT_6: typeof DIGIT_6;
declare const KeyCodes_DIGIT_7: typeof DIGIT_7;
declare const KeyCodes_DIGIT_8: typeof DIGIT_8;
declare const KeyCodes_DIGIT_9: typeof DIGIT_9;
declare const KeyCodes_MINUS: typeof MINUS;
declare const KeyCodes_EQUAL: typeof EQUAL;
declare const KeyCodes_BRACKET_LEFT: typeof BRACKET_LEFT;
declare const KeyCodes_BRACKET_RIGHT: typeof BRACKET_RIGHT;
declare const KeyCodes_SEMICOLON: typeof SEMICOLON;
declare const KeyCodes_QUOTE: typeof QUOTE;
declare const KeyCodes_BACKQUOTE: typeof BACKQUOTE;
declare const KeyCodes_BACKSLASH: typeof BACKSLASH;
declare const KeyCodes_COMMA: typeof COMMA;
declare const KeyCodes_PERIOD: typeof PERIOD;
declare const KeyCodes_SLASH: typeof SLASH;
declare const KeyCodes_ESCAPE: typeof ESCAPE;
declare const KeyCodes_SPACE: typeof SPACE;
declare const KeyCodes_CAPS_LOCK: typeof CAPS_LOCK;
declare const KeyCodes_BACKSPACE: typeof BACKSPACE;
declare const KeyCodes_DELETE: typeof DELETE;
declare const KeyCodes_TAB: typeof TAB;
declare const KeyCodes_ENTER: typeof ENTER;
declare const KeyCodes_ARROW_UP: typeof ARROW_UP;
declare const KeyCodes_ARROW_DOWN: typeof ARROW_DOWN;
declare const KeyCodes_ARROW_LEFT: typeof ARROW_LEFT;
declare const KeyCodes_ARROW_RIGHT: typeof ARROW_RIGHT;
declare const KeyCodes_MOUSE_BUTTON_0: typeof MOUSE_BUTTON_0;
declare const KeyCodes_MOUSE_BUTTON_1: typeof MOUSE_BUTTON_1;
declare const KeyCodes_MOUSE_BUTTON_2: typeof MOUSE_BUTTON_2;
declare const KeyCodes_MOUSE_BUTTON_3: typeof MOUSE_BUTTON_3;
declare const KeyCodes_MOUSE_BUTTON_4: typeof MOUSE_BUTTON_4;
declare const KeyCodes_MOUSE_POS_X: typeof MOUSE_POS_X;
declare const KeyCodes_MOUSE_POS_Y: typeof MOUSE_POS_Y;
declare const KeyCodes_MOUSE_WHEEL_X: typeof MOUSE_WHEEL_X;
declare const KeyCodes_MOUSE_WHEEL_Y: typeof MOUSE_WHEEL_Y;
declare const KeyCodes_MOUSE_WHEEL_Z: typeof MOUSE_WHEEL_Z;
declare namespace KeyCodes {
  export {
    KeyCodes_from as from,
    KeyCodes_isKeyCode as isKeyCode,
    KeyCodes_KEYBOARD as KEYBOARD,
    KeyCodes_MOUSE as MOUSE,
    KeyCodes_KEY_A as KEY_A,
    KeyCodes_KEY_B as KEY_B,
    KeyCodes_KEY_C as KEY_C,
    KeyCodes_KEY_D as KEY_D,
    KeyCodes_KEY_E as KEY_E,
    KeyCodes_KEY_F as KEY_F,
    KeyCodes_KEY_G as KEY_G,
    KeyCodes_KEY_H as KEY_H,
    KeyCodes_KEY_I as KEY_I,
    KeyCodes_KEY_J as KEY_J,
    KeyCodes_KEY_K as KEY_K,
    KeyCodes_KEY_L as KEY_L,
    KeyCodes_KEY_M as KEY_M,
    KeyCodes_KEY_N as KEY_N,
    KeyCodes_KEY_O as KEY_O,
    KeyCodes_KEY_P as KEY_P,
    KeyCodes_KEY_Q as KEY_Q,
    KeyCodes_KEY_R as KEY_R,
    KeyCodes_KEY_S as KEY_S,
    KeyCodes_KEY_T as KEY_T,
    KeyCodes_KEY_U as KEY_U,
    KeyCodes_KEY_V as KEY_V,
    KeyCodes_KEY_W as KEY_W,
    KeyCodes_KEY_X as KEY_X,
    KeyCodes_KEY_Y as KEY_Y,
    KeyCodes_KEY_Z as KEY_Z,
    KeyCodes_DIGIT_0 as DIGIT_0,
    KeyCodes_DIGIT_1 as DIGIT_1,
    KeyCodes_DIGIT_2 as DIGIT_2,
    KeyCodes_DIGIT_3 as DIGIT_3,
    KeyCodes_DIGIT_4 as DIGIT_4,
    KeyCodes_DIGIT_5 as DIGIT_5,
    KeyCodes_DIGIT_6 as DIGIT_6,
    KeyCodes_DIGIT_7 as DIGIT_7,
    KeyCodes_DIGIT_8 as DIGIT_8,
    KeyCodes_DIGIT_9 as DIGIT_9,
    KeyCodes_MINUS as MINUS,
    KeyCodes_EQUAL as EQUAL,
    KeyCodes_BRACKET_LEFT as BRACKET_LEFT,
    KeyCodes_BRACKET_RIGHT as BRACKET_RIGHT,
    KeyCodes_SEMICOLON as SEMICOLON,
    KeyCodes_QUOTE as QUOTE,
    KeyCodes_BACKQUOTE as BACKQUOTE,
    KeyCodes_BACKSLASH as BACKSLASH,
    KeyCodes_COMMA as COMMA,
    KeyCodes_PERIOD as PERIOD,
    KeyCodes_SLASH as SLASH,
    KeyCodes_ESCAPE as ESCAPE,
    KeyCodes_SPACE as SPACE,
    KeyCodes_CAPS_LOCK as CAPS_LOCK,
    KeyCodes_BACKSPACE as BACKSPACE,
    KeyCodes_DELETE as DELETE,
    KeyCodes_TAB as TAB,
    KeyCodes_ENTER as ENTER,
    KeyCodes_ARROW_UP as ARROW_UP,
    KeyCodes_ARROW_DOWN as ARROW_DOWN,
    KeyCodes_ARROW_LEFT as ARROW_LEFT,
    KeyCodes_ARROW_RIGHT as ARROW_RIGHT,
    KeyCodes_MOUSE_BUTTON_0 as MOUSE_BUTTON_0,
    KeyCodes_MOUSE_BUTTON_1 as MOUSE_BUTTON_1,
    KeyCodes_MOUSE_BUTTON_2 as MOUSE_BUTTON_2,
    KeyCodes_MOUSE_BUTTON_3 as MOUSE_BUTTON_3,
    KeyCodes_MOUSE_BUTTON_4 as MOUSE_BUTTON_4,
    KeyCodes_MOUSE_POS_X as MOUSE_POS_X,
    KeyCodes_MOUSE_POS_Y as MOUSE_POS_Y,
    KeyCodes_MOUSE_WHEEL_X as MOUSE_WHEEL_X,
    KeyCodes_MOUSE_WHEEL_Y as MOUSE_WHEEL_Y,
    KeyCodes_MOUSE_WHEEL_Z as MOUSE_WHEEL_Z,
  };
}

/**
 * @param {string|Array<string>} strings
 * @returns {Array<KeyCode>}
 */
declare function stringsToKeyCodes(strings: string | Array<string>): Array<KeyCode$5>;

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
    /** @private */
    private _context;
    /** @private */
    private onInputContextBind;
    /** @private */
    private onInputContextUnbind;
    /** @private */
    private onInputContextFocus;
    /** @private */
    private onInputContextBlur;
    /** @override */
    connectedCallback(): void;
    /** @override */
    disconnectedCallback(): void;
    /** @override */
    attributeChangedCallback(attribute: any, prev: any, value: any): void;
    /**
     * @param {'axisbutton'} [contextId]
     * @param {object} [options]
     * @returns {InputContext}
     */
    getContext(contextId?: 'axisbutton', options?: object): InputContext;
    /** @private */
    private updateTable;
    /** @private */
    private updateTableValues;
    /** @private */
    private updatePollStatus;
}

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

export { AutoPoller, Axis, AxisBinding, AxisBindingState, AxisButtonBinding, Button, ButtonBinding, CLEAR_DOWN_STATE_BITS, CLEAR_INVERTED_MODIFIER_BITS, CLEAR_POLL_BITS, DOWN_STATE_BIT, DeviceInputAdapter, INVERTED_MODIFIER_BIT, InputBinding$1 as InputBinding, InputCode, InputContext, InputContextEvent, InputContextEventListener, InputContextEventType, InputDeviceEventListener, InputPort, InputReadOnly, KeyCodes, Keyboard, KeyboardDevice, Mouse, MouseDevice, OnPollCallback, PRESSED_STATE_BIT, Pollable, RELEASED_STATE_BIT, REPEATED_STATE_BIT, stringsToKeyCodes };
