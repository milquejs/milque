import { InputDevice } from './InputDevice.js';

export class Keyboard extends InputDevice
{
    constructor()
    {
        super();

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    /**
     * @protected
     * @override
     */
    attachEventTarget(eventTarget)
    {
        eventTarget.addEventListener('keydown', this.onKeyDown);
        eventTarget.addEventListener('keyup', this.onKeyUp);
    }

    /**
     * @protected
     * @override
     */
    detachEventTarget(eventTarget)
    {
        eventTarget.removeEventListener('keydown', this.onKeyDown);
        eventTarget.removeEventListener('keyup', this.onKeyUp);
    }

    /** @private */
    onKeyDown(e)
    {
        let result;

        if (e.repeat)
        {
            result = this.handleEvent(e.key, 'repeat', true);
        }
        else
        {
            result = this.handleEvent(e.key, 'down', true);
        }

        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /** @private */
    onKeyUp(e)
    {
        let result;

        result = this.handleEvent(e.key, 'up', true);
        
        if (result)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}
