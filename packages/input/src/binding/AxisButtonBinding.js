import { AxisBinding } from './AxisBinding.js';

export class AxisButtonBinding extends AxisBinding {
    
    constructor(name, device, negativeCode, positiveCode) {
        super(name, device, positiveCode, undefined);
        this.negativeCode = negativeCode;
    }

    /**
     * @param {import('../InputContext.js').InputContext} inputContext 
     */
    register(inputContext) {
        inputContext.bindAxisButtons(this.name, this.device, this.negativeCode, this.code);
        this.ref = inputContext.getAxis(this.name);
        return this;
    }
}
