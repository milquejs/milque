import { Keyboard, Mouse } from '../../packages/input/src/index.js';
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

export function createKeyState(deviceMap, keyMap)
{
    // Every input context should have an input map and a key state.
    // - the key state should not register itself to devices, top-level should handle it.
    // The input map will generate an adapterMap and a keyMap.
    const keyState = new KeyState(keyMap);
    if ('keyboard' in deviceMap)
    {
        deviceMap.keyboard.addEventListener('key', ({ device, key, event, value }) => keyState.updateKey(device, key, event, value));
    }
    if ('mouse' in deviceMap)
    {
        deviceMap.mouse.addEventListener('key', ({ device, key, event, value }) => keyState.updateKey(device, key, event, value));
        deviceMap.mouse.addEventListener('pos', ({ device, key, x, y, dx, dy }) => keyState.updatePos(device, key, x, y, dx, dy));
    }
    return keyState;
}

export function createDeviceMap(element)
{
    return {
        keyboard: new Keyboard(element),
        mouse: new Mouse(element),
    };
}