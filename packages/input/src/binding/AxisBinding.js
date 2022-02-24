import { InputBinding } from './InputBinding.js';

export class AxisBinding extends InputBinding {
    
    /** @returns {number} */
    get delta() {
        if (!this.ref) {
            return 0;
        }
        return this.ref.delta;
    }

    constructor(name, device, code, opts) {
        super(name, device, code, opts);
    }

    /**
     * @param {import('../InputContext.js').InputContext} inputContext 
     */
    register(inputContext) {
        inputContext.bindAxis(this.name, this.device, this.code, this.opts);
        this.ref = inputContext.getAxis(this.name);
        return this;
    }
}
