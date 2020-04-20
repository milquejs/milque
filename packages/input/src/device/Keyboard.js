import { InputDevice } from './InputDevice.js';

export class Keyboard extends InputDevice
{
    constructor(eventTarget)
    {
        super();
        
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.name = 'keyboard';
        this.eventTarget = null;
        this.setEventTarget(eventTarget);
    }

    setEventTarget(element)
    {
        if (this.eventTarget) this.destroy();

        if (!element) return;
        element.addEventListener('keydown', this.onKeyDown);
        element.addEventListener('keyup', this.onKeyUp);
        this.eventTarget = element;
    }

    destroy()
    {
        let el = this.eventTarget;
        this.eventTarget = null;

        if (!el) return;
        el.removeEventListener('keydown', this.onKeyDown);
        el.removeEventListener('keyup', this.onKeyUp);
    }

    onKeyDown(e)
    {
        if ('key' in this.listeners)
        {
            // Ignore repeat events.
            if (e.repeat) return;
            
            let result = this.dispatchEvent({
                type: 'key',
                target: this.eventTarget,
                device: this.name,
                key: e.key,
                event: 'down',
                value: 1,
            });

            if (!result)
            {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }

    onKeyUp(e)
    {
        if ('key' in this.listeners)
        {
            let result = this.dispatchEvent({
                type: 'key',
                target: this.eventTarget,
                device: this.name,
                key: e.key,
                event: 'up',
                value: 1,
            });

            if (!result)
            {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }
}
