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
}
