import { InputBinding } from './InputBinding.js';

export class ButtonBinding extends InputBinding {
    /** @returns {boolean} */
    get pressed() {
        if (!this.ref) {
            return false;
        }
        return this.ref.pressed;
    }

    /** @returns {boolean} */
    get repeated() {
        if (!this.ref) {
            return false;
        }
        return this.ref.repeated;
    }

    /** @returns {boolean} */
    get released() {
        if (!this.ref) {
            return false;
        }
        return this.ref.released;
    }

    /** @returns {boolean} */
    get down() {
        if (!this.ref) {
            return false;
        }
        return this.ref.down;
    }

    constructor(name, device, code, opts) {
        super(name, device, code, opts);
    }

    /**
     * @param {import('../InputContext.js').InputContext} inputContext 
     */
    register(inputContext) {
        inputContext.bindButton(this.name, this.device, this.code, this.opts);
        this.ref = inputContext.getButton(this.name);
        return this;
    }
}
