import * as InputModule from './InputModule.js';

export function Pointer(x = 'mouse[pos]:x', y = 'mouse[pos]:y', press = 'mouse[0]:down', release = 'mouse[0]:up')
{
    return {
        _x: InputModule.Range().attach(x),
        _y: InputModule.Range().attach(y),
        _down: InputModule.State().attach([press, release]),
        get x() { return this._x.get(false); },
        get y() { return this._y.get(false); },
        get down() { return this._down.get(true); }
    };
}

export function Mover(up = 'key[w]', left = 'key[a]', down = 'key[s]', right = 'key[d]')
{
    return {
        _up: InputModule.State().attach(up),
        _left: InputModule.State().attach(left),
        _down: InputModule.State().attach(down),
        _right: InputModule.State().attach(right),
        get up() { return this._up.get(false); },
        get left() { return this._left.get(false); },
        get down() { return this._down.get(false); },
        get right() { return this._right.get(false); }
    };
}
