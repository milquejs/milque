import InputDevice from './InputDevice.js';

class Keyboard extends InputDevice
{
    constructor(element)
    {
        super('key');

        this.element = element;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    /** @override */
    delete()
    {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);

        super.delete();
    }

    onKeyDown(e)
    {
        if (e.repeat) return;
        this.dispatchEvent('input', e.key, 'down', true);
    }

    onKeyUp(e)
    {
        this.dispatchEvent('input', e.key, 'up', true);
    }
}

export default Keyboard;