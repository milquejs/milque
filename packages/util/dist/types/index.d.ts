type Eventable = {
    on: Function;
    off: Function;
    once: Function;
    emit: Function;
};
declare namespace Eventable {
    export { create };
    export { assign };
    export { mixin };
}
/**
 * Creates an eventable object.
 *
 * @param {Object} [context] The context used for the event handlers.
 * @return {Eventable} The created eventable object.
 */
declare function create(context?: any): Eventable;
/**
 * Assigns the passed-in object with eventable properties.
 *
 * @param {Object} dst The object to assign with eventable properties.
 * @param {Object} [context] The context used for the event handlers.
 * @return {Eventable} The resultant eventable object.
 */
declare function assign(dst: any, context?: any): Eventable;
/**
 * Mixins eventable properties into the passed-in class.
 *
 * @param {Class} targetClass The class to mixin eventable properties.
 * @param {Object} [context] The context used for the event handlers.
 * @return {Class<Eventable>} The resultant eventable-mixed-in class.
 */
declare function mixin(targetClass: any, context?: any): any;

declare class Logger {
    static get TRACE(): number;
    static get DEBUG(): number;
    static get INFO(): number;
    static get WARN(): number;
    static get ERROR(): number;
    static get OFF(): number;
    /**
     * Creates or gets the logger for the given unique name.
     * @param {String} name
     * @returns {Logger} The logger with the name.
     */
    static getLogger(name: string): Logger;
    static useDefaultLevel(level: any): typeof Logger;
    static useDefaultDomain(domain: any): typeof Logger;
    constructor(name: any);
    name: any;
    setLevel(level: any): Logger;
    getLevel(): number;
    setDomain(domain: any): Logger;
    getDomain(): string;
    log(level: any, ...messages: any[]): Logger;
    trace(...messages: any[]): Logger;
    debug(...messages: any[]): Logger;
    info(...messages: any[]): Logger;
    warn(...messages: any[]): Logger;
    error(...messages: any[]): Logger;
    [LEVEL]: number;
    [DOMAIN]: string;
}
declare const LEVEL: unique symbol;
declare const DOMAIN: unique symbol;

declare function bresenhamLine(fromX: any, fromY: any, toX: any, toY: any, callback: any): any;

declare function downloadText(filename: any, textData: any): void;
declare function downloadImageFromSVG(filename: any, filetype: any, svg: any, width: any, height: any): void;
declare function downloadURL(filename: any, url: any): void;
declare const FILE_TYPE_PNG: "png";
declare const FILE_TYPE_SVG: "svg";

declare function uploadFile(accept?: any[], multiple?: boolean): Promise<any>;

declare class PriorityQueue {
    constructor(comparator: any);
    _heap: any[];
    _comparator: any;
    get size(): number;
    clear(): void;
    push(...values: any[]): void;
    pop(): any;
    /** Replaces the top value with the new value. */
    replace(value: any): any;
    peek(): any;
    /** @private */
    private _compare;
    /** @private */
    private _swap;
    /** @private */
    private _shiftUp;
    /** @private */
    private _shiftDown;
    values(): any[];
    [Symbol.iterator](): IterableIterator<any>;
}

/**
 * Generates a uuid v4.
 *
 * @param {number} a The placeholder (serves for recursion within function).
 * @returns {string} The universally unique id.
 */
declare function uuid(a?: number): string;

declare function lerp(a: any, b: any, t: any): any;
declare function clamp(value: any, min: any, max: any): number;
declare function cycle(value: any, min: any, max: any): any;
declare function withinRadius(fromX: any, fromY: any, toX: any, toY: any, radius: any): boolean;
declare function distance2(fromX: any, fromY: any, toX: any, toY: any): number;
declare function direction2(fromX: any, fromY: any, toX: any, toY: any): number;
declare function lookAt2(radians: any, target: any, dt: any): number;
declare function toRadians(degrees: any): number;
declare function toDegrees(radians: any): number;

/**
 * @callback DependencyCallback
 * @param {Object} node The target node to get the dependencies for.
 * @returns {Array<Object>} A list of all dependencies for the given node.
 */
/**
 * Sort an array topologically.
 *
 * @param {Array<Object>} nodes List of all nodes (as long as it includes the root node).
 * @param {DependencyCallback} dependencyCallback A callback to get the dependencies of a node.
 * @returns {Array<Object>} A sorted array of node objects where the dependent nodes are always listed before the dependees.
 */
declare function topoSort(nodes: Array<any>, dependencyCallback: DependencyCallback): Array<any>;
type DependencyCallback = (node: any) => Array<any>;

export { DependencyCallback, Eventable, FILE_TYPE_PNG, FILE_TYPE_SVG, Logger, PriorityQueue, bresenhamLine, clamp, cycle, direction2, distance2, downloadImageFromSVG, downloadText, downloadURL, lerp, lookAt2, toDegrees, toRadians, topoSort, uploadFile, uuid, withinRadius };
