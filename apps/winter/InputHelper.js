import { addKeyboardEventListener, addMouseEventListener } from '../../packages/input/src/index.js';
import { KeyState } from './KeyState.js';

export function KeyMapBuilder()
{
    return {
        _keyMap: {},
        set(name, key, device = 'keyboard')
        {
            this._keyMap[name] = { device, key };
            return this;
        },
        build()
        {
            return this._keyMap;
        }
    }
}

export function createKeyState(targetElement, keyMap)
{
    // Every input context should have an input map and a key state.
    // - the key state should not register itself to devices, top-level should handle it.
    // The input map will generate an adapterMap and a keyMap.
    const keyState = new KeyState(keyMap);
    addKeyboardEventListener(targetElement, ({ device, key, event, value }) =>
        keyState.updateKey(device, key, event, value));
    addMouseEventListener(targetElement, ({ device, key, event, value, x, y, dx, dy }) =>
        key === 'pos'
            ? keyState.updatePos(device, key, event, x, y, dx, dy)
            : keyState.updateKey(device, key, event, value));
    return keyState;
}
