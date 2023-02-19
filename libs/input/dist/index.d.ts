declare class InputBinding$1 {
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
    /** @protected */
    protected disabled: boolean;
    /**
     * @abstract
     * @param {import('../InputContext.js').InputContext} inputContext
     */
    bindTo(inputContext: InputContext$1): void;
    disable(force?: boolean): InputBinding$1;
    /**
     * @param {number} code
     * @returns {number}
     */
    getState(code: number): number;
}

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
declare class InputState$2 {
    /**
     * @abstract
     * @param {number} size The initial binding state size.
     */
    constructor(size: number);
    get polling(): boolean;
    /** @abstract */
    get value(): number;
    get size(): number;
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
 * A class that maps inputs to their respective key bindings.
 *
 * This does not handle input state (refer to InputState.js) nor
 * input events (refer to InputDevice.js). It is only responsible
 * for the redirection of key codes to their bound input. Usually
 * this is used together with the interfaces referenced above.
 */
declare class InputBindings$2 {
    /**
     * @private
     * @type {Record<DeviceName, Record<KeyCode, Array<Binding>>>}
     */
    private bindingMap;
    /**
     * @private
     * @type {Map<InputState, Array<Binding>>}
     */
    private inputMap;
    clear(): void;
    /**
     * @param {InputState} input
     * @param {DeviceName} device
     * @param {KeyCode} code
     * @param {BindingOptions} [opts]
     */
    bind(input: InputState$1, device: DeviceName$2, code: KeyCode$6, opts?: BindingOptions$1): void;
    /**
     * @param {InputState} input
     */
    unbind(input: InputState$1): void;
    /**
     * @param {InputState} input
     * @returns {boolean}
     */
    isBound(input: InputState$1): boolean;
    /** @returns {Iterable<InputState>} */
    getInputs(): Iterable<InputState$1>;
    /** @returns {Iterable<Binding>} */
    getBindingsByInput(input: any): Iterable<Binding>;
    /**
     * @param {DeviceName} device
     * @param {KeyCode} code
     * @returns {Array<Binding>}
     */
    getBindings(device: DeviceName$2, code: KeyCode$6): Array<Binding>;
}
type InputState$1 = InputState$2;
type BindingOptions$1 = BindingOptions$2;
type DeviceName$2 = string;
type KeyCode$6 = string;
/**
 * @typedef {import('./state/InputState.js').InputState} InputState
 * @typedef {import('./state/InputState.js').BindingOptions} BindingOptions
 *
 * @typedef {string} DeviceName
 * @typedef {string} KeyCode
 */
declare class Binding {
    /**
     * @param {DeviceName} device The name of the device
     * @param {KeyCode} code The key code for the device
     * @param {InputState} input The parent input
     * @param {number} index The binding index for the input
     */
    constructor(device: DeviceName$2, code: KeyCode$6, input: InputState$1, index: number);
    /** Name of the device */
    device: string;
    /** The key code for the device */
    code: string;
    /** The parent input */
    input: InputState$2;
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
    static isAxis(keyCode: any): boolean;
    /** @abstract */
    static isButton(keyCode: any): boolean;
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

/**
 * @typedef {import('./InputState.js').BindingIndex} BindingIndex The binding index
 * @typedef {import('./InputState.js').BindingOptions} BindingOptions The binding options
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
declare class AxisState extends InputState$2 {
    /** @returns {AxisBindingState} */
    static createAxisBindingState(): AxisBindingState$1;
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
     * @override
     * @protected
     */
    protected override resize(newSize: any): void;
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
type AxisBindingState$1 = {
    value: number;
    delta: number;
    inverted: boolean;
};
type AxisReadOnly$2 = {
    value: number;
    delta: number;
    polling: boolean;
};

declare class ButtonState extends InputState$2 {
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
     * @override
     * @protected
     */
    protected override resize(newSize: any): void;
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
type ButtonReadOnly$3 = {
    value: number;
    pressed: boolean;
    repeated: boolean;
    released: boolean;
    down: boolean;
    polling: boolean;
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
declare class DeviceInputAdapter$1 {
    /**
     * @param {InputBindings} bindings
     */
    constructor(bindings: InputBindings$1);
    onInput(e: any): boolean;
    /**
     * @param {number} now
     */
    onPoll(now: number): void;
    bindings: InputBindings$2;
}
type InputBindings$1 = InputBindings$2;

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
declare class AutoPoller$1 {
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
declare class MouseDevice$1 extends InputDevice$1 {
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
    /** @override */
    override setEventTarget(eventTarget: any): void;
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
declare class KeyboardDevice$1 extends InputDevice$1 {
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
    /** @override */
    override setEventTarget(eventTarget: any): void;
}

/**
 * @typedef {import('./device/InputDevice.js').InputDevice} InputDevice
 * @typedef {import('./device/InputDevice.js').InputDeviceEvent} InputDeviceEvent
 * @typedef {import('./state/InputState.js').InputState} InputState
 * @typedef {import('./InputBindings.js').DeviceName} DeviceName
 * @typedef {import('./InputBindings.js').KeyCode} KeyCode
 * @typedef {import('./InputBindings.js').BindingOptions} BindingOptions
 *
 * @typedef {import('./binding/InputBinding.js').InputBinding} InputBinding
 */
/**
 * @typedef {string} InputName
 *
 * @typedef {'bind'|'unbind'|'focus'|'blur'} InputContextEventType
 * @typedef {(e: InputContextEvent) => boolean} InputContextEventListener
 *
 * @typedef InputContextEvent
 * @property {InputContextEventType} type
 */
declare class InputContext$1 {
    /**
     * @param {EventTarget} eventTarget
     * @param {object} [opts]
     */
    constructor(eventTarget: EventTarget, opts?: object);
    /**
     * @type {Record<string, AxisState|ButtonState>}
     */
    inputs: Record<string, AxisState | ButtonState>;
    /**
     * @type {Array<InputDevice>}
     */
    devices: Array<InputDevice>;
    bindings: InputBindings$2;
    adapter: DeviceInputAdapter$1;
    autopoller: AutoPoller$1;
    /** @protected */
    protected eventTarget: EventTarget;
    /** @protected */
    protected anyButton: ButtonState;
    /** @protected */
    protected anyButtonDevice: string;
    /** @protected */
    protected anyButtonCode: string;
    /** @protected */
    protected anyAxis: AxisState;
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
    addEventListener(event: InputContextEventType$1, listener: InputContextEventListener$1): void;
    /**
     * @param {InputContextEventType} event
     * @param {InputContextEventListener} listener
     */
    removeEventListener(event: InputContextEventType$1, listener: InputContextEventListener$1): void;
    /**
     * @param {InputContextEvent} e
     * @returns {boolean} Whether the event should be consumed.
     */
    dispatchEvent(e: InputContextEvent$1): boolean;
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
     * @param {Array<InputBinding>|Record<string, InputBinding>} bindings
     */
    bindBindings(bindings: Array<InputBinding> | Record<string, InputBinding>): void;
    /**
     * @param {InputBinding} binding
     */
    bindBinding(binding: InputBinding): void;
    /**
     * @param {InputName} name
     * @param {DeviceName} device
     * @param {KeyCode} code
     * @param {BindingOptions} [opts]
     */
    bindButton(name: InputName$1, device: DeviceName$1, code: KeyCode$5, opts?: BindingOptions): void;
    /**
     * @param {string} name
     * @param {DeviceName} device
     * @param {KeyCode} code
     * @param {BindingOptions} [opts]
     */
    bindAxis(name: string, device: DeviceName$1, code: KeyCode$5, opts?: BindingOptions): void;
    /**
     * @param {string} name
     * @param {DeviceName} device
     * @param {KeyCode} negativeCode
     * @param {KeyCode} positiveCode
     */
    bindAxisButtons(name: string, device: DeviceName$1, negativeCode: KeyCode$5, positiveCode: KeyCode$5): void;
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
     * @returns {InputState}
     */
    getInput(name: InputName$1): InputState;
    /**
     * Get the button for the given name. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {ButtonState}
     */
    getButton(name: InputName$1): ButtonState;
    /**
     * Get the axis for the given name. Assumes an axis already exists for the name.
     * @param {InputName} name
     * @returns {AxisState}
     */
    getAxis(name: InputName$1): AxisState;
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
    isButtonDown(name: InputName$1): boolean;
    /**
     * Get whether a button for the given name is pressed. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {boolean}
     */
    isButtonPressed(name: InputName$1): boolean;
    /**
     * Get whether a button for the given name is released. Assumes a button already exists for the name.
     * @param {InputName} name
     * @returns {boolean}
     */
    isButtonReleased(name: InputName$1): boolean;
    /**
     * @param {InputName} name
     * @returns {number}
     */
    getInputValue(name: InputName$1): number;
    /**
     * @param {InputName} name
     * @returns {number}
     */
    getButtonValue(name: InputName$1): number;
    /**
     * @param {InputName} name
     * @returns {number}
     */
    getAxisValue(name: InputName$1): number;
    /**
     * @param {InputName} name
     * @returns {number}
     */
    getAxisDelta(name: InputName$1): number;
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
    getMouse(): MouseDevice$1;
    getKeyboard(): KeyboardDevice$1;
}
type InputDevice = InputDevice$1;
type InputState = InputState$2;
type DeviceName$1 = DeviceName$2;
type KeyCode$5 = KeyCode$6;
type BindingOptions = BindingOptions$1;
type InputBinding = InputBinding$1;
type InputName$1 = string;
type InputContextEventType$1 = 'bind' | 'unbind' | 'focus' | 'blur';
type InputContextEventListener$1 = (e: InputContextEvent$1) => boolean;
type InputContextEvent$1 = {
    type: InputContextEventType$1;
};

type ButtonReadOnly$2 = ButtonReadOnly$3;
type AxisReadOnly$1 = AxisReadOnly$2;
type AxisBindingState = AxisBindingState$1;

declare class KeyCode$4 {
    /**
     * @param {string} string
     * @returns {KeyCode}
     */
    static parse(string: string): KeyCode$4;
    /**
     * @param {string} device
     * @param {string} code
     */
    constructor(device: string, code: string);
    device: string;
    code: string;
    /** @override */
    override toString(): string;
}

/** @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode */
declare class AxisBinding extends InputBinding$1 {
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
    constructor(name: string, keyCodes: KeyCode$3 | Array<KeyCode$3>, opts?: object);
    /** @returns {number} */
    get delta(): number;
    /** @protected */
    protected keyCodes: KeyCode$4[];
    /** @protected */
    protected opts: any;
    /**
     * @override
     * @param {import('../InputContext.js').InputContext} inputContext
     */
    override bindTo(inputContext: InputContext$1): AxisBinding;
}
type KeyCode$3 = KeyCode$4;

/**
 * @typedef {import('../keycode/KeyCode.js').KeyCode} KeyCode
 * @typedef {import('../InputContext.js').InputContext} InputContext
 */
declare class ButtonBinding extends InputBinding$1 {
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
    constructor(name: string, keyCodes: KeyCode$2 | Array<KeyCode$2>, opts?: object);
    /** @returns {boolean} */
    get pressed(): boolean;
    /** @returns {boolean} */
    get repeated(): boolean;
    /** @returns {boolean} */
    get released(): boolean;
    /** @returns {boolean} */
    get down(): boolean;
    /** @protected */
    protected keyCodes: KeyCode$4[];
    /** @protected */
    protected opts: any;
    /**
     * @override
     * @param {InputContext} inputContext
     */
    override bindTo(inputContext: InputContext): ButtonBinding;
}
type KeyCode$2 = KeyCode$4;
type InputContext = InputContext$1;

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
    constructor(name: string, negativeKeyCode: KeyCode$1, positiveKeyCode: KeyCode$1);
    /** @protected */
    protected negativeKeyCode: KeyCode$4;
    /** @protected */
    protected positiveKeyCode: KeyCode$4;
    /**
     * @param {import('../InputContext.js').InputContext} inputContext
     */
    bindTo(inputContext: InputContext$1): AxisButtonBinding;
}
type KeyCode$1 = KeyCode$4;

declare function from(device: any, code: any): KeyCode$4;
declare function isKeyCode(object: any): boolean;
declare const KEYBOARD: "Keyboard";
declare const MOUSE: "Mouse";
declare const KEY_A: KeyCode$4;
declare const KEY_B: KeyCode$4;
declare const KEY_C: KeyCode$4;
declare const KEY_D: KeyCode$4;
declare const KEY_E: KeyCode$4;
declare const KEY_F: KeyCode$4;
declare const KEY_G: KeyCode$4;
declare const KEY_H: KeyCode$4;
declare const KEY_I: KeyCode$4;
declare const KEY_J: KeyCode$4;
declare const KEY_K: KeyCode$4;
declare const KEY_L: KeyCode$4;
declare const KEY_M: KeyCode$4;
declare const KEY_N: KeyCode$4;
declare const KEY_O: KeyCode$4;
declare const KEY_P: KeyCode$4;
declare const KEY_Q: KeyCode$4;
declare const KEY_R: KeyCode$4;
declare const KEY_S: KeyCode$4;
declare const KEY_T: KeyCode$4;
declare const KEY_U: KeyCode$4;
declare const KEY_V: KeyCode$4;
declare const KEY_W: KeyCode$4;
declare const KEY_X: KeyCode$4;
declare const KEY_Y: KeyCode$4;
declare const KEY_Z: KeyCode$4;
declare const DIGIT_0: KeyCode$4;
declare const DIGIT_1: KeyCode$4;
declare const DIGIT_2: KeyCode$4;
declare const DIGIT_3: KeyCode$4;
declare const DIGIT_4: KeyCode$4;
declare const DIGIT_5: KeyCode$4;
declare const DIGIT_6: KeyCode$4;
declare const DIGIT_7: KeyCode$4;
declare const DIGIT_8: KeyCode$4;
declare const DIGIT_9: KeyCode$4;
declare const MINUS: KeyCode$4;
declare const EQUAL: KeyCode$4;
declare const BRACKET_LEFT: KeyCode$4;
declare const BRACKET_RIGHT: KeyCode$4;
declare const SEMICOLON: KeyCode$4;
declare const QUOTE: KeyCode$4;
declare const BACKQUOTE: KeyCode$4;
declare const BACKSLASH: KeyCode$4;
declare const COMMA: KeyCode$4;
declare const PERIOD: KeyCode$4;
declare const SLASH: KeyCode$4;
declare const ESCAPE: KeyCode$4;
declare const SPACE: KeyCode$4;
declare const CAPS_LOCK: KeyCode$4;
declare const BACKSPACE: KeyCode$4;
declare const DELETE: KeyCode$4;
declare const TAB: KeyCode$4;
declare const ENTER: KeyCode$4;
declare const ARROW_UP: KeyCode$4;
declare const ARROW_DOWN: KeyCode$4;
declare const ARROW_LEFT: KeyCode$4;
declare const ARROW_RIGHT: KeyCode$4;
declare const MOUSE_BUTTON_0: KeyCode$4;
declare const MOUSE_BUTTON_1: KeyCode$4;
declare const MOUSE_BUTTON_2: KeyCode$4;
declare const MOUSE_BUTTON_3: KeyCode$4;
declare const MOUSE_BUTTON_4: KeyCode$4;
declare const MOUSE_POS_X: KeyCode$4;
declare const MOUSE_POS_Y: KeyCode$4;
declare const MOUSE_WHEEL_X: KeyCode$4;
declare const MOUSE_WHEEL_Y: KeyCode$4;
declare const MOUSE_WHEEL_Z: KeyCode$4;

declare const KeyCodes_ARROW_DOWN: typeof ARROW_DOWN;
declare const KeyCodes_ARROW_LEFT: typeof ARROW_LEFT;
declare const KeyCodes_ARROW_RIGHT: typeof ARROW_RIGHT;
declare const KeyCodes_ARROW_UP: typeof ARROW_UP;
declare const KeyCodes_BACKQUOTE: typeof BACKQUOTE;
declare const KeyCodes_BACKSLASH: typeof BACKSLASH;
declare const KeyCodes_BACKSPACE: typeof BACKSPACE;
declare const KeyCodes_BRACKET_LEFT: typeof BRACKET_LEFT;
declare const KeyCodes_BRACKET_RIGHT: typeof BRACKET_RIGHT;
declare const KeyCodes_CAPS_LOCK: typeof CAPS_LOCK;
declare const KeyCodes_COMMA: typeof COMMA;
declare const KeyCodes_DELETE: typeof DELETE;
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
declare const KeyCodes_ENTER: typeof ENTER;
declare const KeyCodes_EQUAL: typeof EQUAL;
declare const KeyCodes_ESCAPE: typeof ESCAPE;
declare const KeyCodes_KEYBOARD: typeof KEYBOARD;
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
declare const KeyCodes_MINUS: typeof MINUS;
declare const KeyCodes_MOUSE: typeof MOUSE;
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
declare const KeyCodes_PERIOD: typeof PERIOD;
declare const KeyCodes_QUOTE: typeof QUOTE;
declare const KeyCodes_SEMICOLON: typeof SEMICOLON;
declare const KeyCodes_SLASH: typeof SLASH;
declare const KeyCodes_SPACE: typeof SPACE;
declare const KeyCodes_TAB: typeof TAB;
declare const KeyCodes_from: typeof from;
declare const KeyCodes_isKeyCode: typeof isKeyCode;
declare namespace KeyCodes {
  export {
    KeyCodes_ARROW_DOWN as ARROW_DOWN,
    KeyCodes_ARROW_LEFT as ARROW_LEFT,
    KeyCodes_ARROW_RIGHT as ARROW_RIGHT,
    KeyCodes_ARROW_UP as ARROW_UP,
    KeyCodes_BACKQUOTE as BACKQUOTE,
    KeyCodes_BACKSLASH as BACKSLASH,
    KeyCodes_BACKSPACE as BACKSPACE,
    KeyCodes_BRACKET_LEFT as BRACKET_LEFT,
    KeyCodes_BRACKET_RIGHT as BRACKET_RIGHT,
    KeyCodes_CAPS_LOCK as CAPS_LOCK,
    KeyCodes_COMMA as COMMA,
    KeyCodes_DELETE as DELETE,
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
    KeyCodes_ENTER as ENTER,
    KeyCodes_EQUAL as EQUAL,
    KeyCodes_ESCAPE as ESCAPE,
    KeyCodes_KEYBOARD as KEYBOARD,
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
    KeyCodes_MINUS as MINUS,
    KeyCodes_MOUSE as MOUSE,
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
    KeyCodes_PERIOD as PERIOD,
    KeyCodes_QUOTE as QUOTE,
    KeyCodes_SEMICOLON as SEMICOLON,
    KeyCodes_SLASH as SLASH,
    KeyCodes_SPACE as SPACE,
    KeyCodes_TAB as TAB,
    KeyCodes_from as from,
    KeyCodes_isKeyCode as isKeyCode,
  };
}

/**
 * @param {string|Array<string>} strings
 * @returns {Array<KeyCode>}
 */
declare function stringsToKeyCodes(strings: string | Array<string>): Array<KeyCode$4>;

declare class InputCode extends HTMLElement {
    static define(customElements?: CustomElementRegistry): void;
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
    attributeChangedCallback(attribute: any, prev: any, value: any): void;
    connectedCallback(): void;
}

/**
 * @typedef {import('../device/InputDevice.js').InputDevice} InputDevice
 * @typedef {import('../device/InputDevice.js').InputDeviceEvent} InputDeviceEvent
 * @typedef {import('../InputBindings.js').DeviceName} DeviceName
 * @typedef {import('../InputBindings.js').KeyCode} KeyCode
 * @typedef {import('../InputBindings.js').BindingOptions} BindingOptions
 * @typedef {import('../InputContext').InputName} InputName
 */
declare class InputPort extends HTMLElement {
    /**
     * @param {object} [opts]
     * @param {HTMLElement} [opts.root]
     * @param {string} [opts.id]
     * @param {string} [opts.for]
     * @param {boolean} [opts.autopoll]
     */
    static create(opts?: {
        root?: HTMLElement;
        id?: string;
        for?: string;
        autopoll?: boolean;
    }): InputPort;
    static define(customElements?: CustomElementRegistry): void;
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
    /**
     * @private
     * @type {HTMLElement}
     */
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
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attribute: any, prev: any, value: any): void;
    /**
     * @param {'axisbutton'} [contextId]
     * @param {object} [options]
     * @returns {InputContext}
     */
    getContext(contextId?: 'axisbutton', options?: object): InputContext$1;
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
        bindings: InputBindings;
        adapter: DeviceInputAdapter;
        autopoller: AutoPoller;
    };
}
type ButtonReadOnly$1 = ButtonReadOnly$3;
/**
 * @typedef {import('./state/ButtonState.js').ButtonReadOnly} ButtonReadOnly
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
        bindings: InputBindings;
        adapter: DeviceInputAdapter;
        autopoller: AutoPoller;
    };
}
type AxisReadOnly = AxisReadOnly$2;
type ButtonReadOnly = ButtonReadOnly$3;
/**
 * @typedef {import('./state/AxisState.js').AxisReadOnly} AxisReadOnly
 * @typedef {import('./state/ButtonState.js').ButtonReadOnly} ButtonReadOnly
 */
declare const MOUSE_SOURCE: unique symbol;

type DeviceName = DeviceName$2;
type KeyCode = KeyCode$6;
type InputName = InputName$1;
type InputContextEventType = InputContextEventType$1;
type InputContextEventListener = InputContextEventListener$1;
type InputContextEvent = InputContextEvent$1;

export { AutoPoller$1 as AutoPoller, AxisBinding, AxisBindingState, AxisButtonBinding, AxisReadOnly$1 as AxisReadOnly, AxisState, BindingIndex$2 as BindingIndex, BindingOptions$2 as BindingOptions, ButtonBinding, ButtonReadOnly$2 as ButtonReadOnly, ButtonState, DeviceInputAdapter$1 as DeviceInputAdapter, DeviceName, InputBinding$1 as InputBinding, InputBindings$2 as InputBindings, InputCode, InputContext$1 as InputContext, InputContextEvent, InputContextEventListener, InputContextEventType, InputDevice$1 as InputDevice, InputDeviceEvent, InputDeviceEventListener, InputName, InputPort, InputReadOnly, InputState$2 as InputState, KeyCode, KeyCodes, Keyboard, KeyboardDevice$1 as KeyboardDevice, Mouse, MouseDevice$1 as MouseDevice, OnPollCallback, Pollable, stringsToKeyCodes };
