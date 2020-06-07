export function init(devices)
{
    const { mouse, keyboard } = devices;
    Object.defineProperty(ACTIVATE, 'value', {
        get()
        {
            return mouse.left.down;
        }
    });
    Object.defineProperty(MARK, 'value', {
        get()
        {
            return mouse.right.down;
        }
    });
    Object.defineProperty(RESTART, 'value', {
        get()
        {
            return keyboard.KeyR.up;
        }
    });
    Object.defineProperty(MOUSE_X, 'value', {
        get()
        {
            return mouse.x;
        }
    });
    Object.defineProperty(MOUSE_Y, 'value', {
        get()
        {
            return mouse.y;
        }
    });
}

export const MARK = { value: 0 };
export const RESTART = { value: 0 };
export const ACTIVATE = { value: 0 };
export const MOUSE_X = { value: 0 };
export const MOUSE_Y = { value: 0 };
