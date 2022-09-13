/**
 * @template T
 */
export class ManagerContext {
    /**
     * @param {() => T} initCallback 
     */
    constructor(initCallback) {
        /** @private */
        this.name = Symbol(this.constructor.name);
        /** @private */
        this.initCallback = initCallback;
    }

    /**
     * @param {object} m 
     * @returns {T}
     */
    resolve(m) {
        if (this.name in m) {
            return m[this.name];
        } else {
            let result = this.initCallback();
            m[this.name] = result;
            return result;
        }
    }

    /**
     * @param {object} m 
     * @returns {T}
     */
    get(m) {
        return m[this.name];
    }
}
