export class InputBinding {
    
    /** @returns {boolean} */
    get polling() {
        if (!this.ref) {
            return false;
        }
        return this.ref.polling;
    }

    /** @returns {number} */
    get value() {
        if (!this.ref) {
            return 0;
        }
        return this.ref.value;
    }

    /**
     * @param {string} name 
     * @param {string} device 
     * @param {string} code 
     * @param {object} [opts] 
     */
    constructor(name, device, code, opts = undefined) {
        this.name = name;
        this.device = device;
        this.code = code;
        this.opts = opts;

        this.ref = null;
    }

    /**
     * @abstract
     * @param {import('../InputContext.js').InputContext} inputContext 
     */
    register(inputContext) {
        throw new Error('Unsupported operation.');
    }

    /**
     * @param {number} code 
     * @returns {number}
     */
    getState(code) {
        if (!this.ref) {
            return 0;
        }
        return this.ref.getState(code);
    }
}
