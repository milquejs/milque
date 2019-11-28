import InputDevice from './InputDevice.js';

class Keyboard extends InputDevice
{
    constructor(element)
    {
        super();

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
        this.dispatchInput(e.key, 'down', true);
    }

    onKeyUp(e)
    {
        this.dispatchInput(e.key, 'up', true);
    }
}

export default Keyboard;