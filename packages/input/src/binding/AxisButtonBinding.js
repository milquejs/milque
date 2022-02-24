import { AxisBinding } from './AxisBinding.js';

export class AxisButtonBinding extends AxisBinding {
    
    constructor(name, device, negativeCode, positiveCode) {
        super(name, device, positiveCode, undefined);
        this.negativeCode = negativeCode;
    }
}
