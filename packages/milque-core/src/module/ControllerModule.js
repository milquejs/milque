import * as InputModule from './InputModule.js';

export function Pointer(x = 'mouse[pos]:x', y = 'mouse[pos]:y', press = 'mouse[0]:down', release = 'mouse[0]:up', dx = 'mouse[move]:x', dy = 'mouse[move]:y')
{
    return {
        _x: InputModule.Range().attach(x),
        _y: InputModule.Range().attach(y),
        _dx: InputModule.Range().attach(dx),
        _dy: InputModule.Range().attach(dy),
        _down: InputModule.State().attach([press, release]),
        get x() { return this._x.get(false); },
        get y() { return this._y.get(false); },
        get down() { return this._down.get(true); },
        get dx() { return this._dx.get(true); },
        get dy() { return this._dy.get(true); }
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

export function Mover3D(forward = 'key[w]', left = 'key[a]', backward = 'key[s]', right = 'key[d]', up = 'key[e]', down = 'key[c]')
{
    return {
        _forward: InputModule.State().attach(forward),
        _left: InputModule.State().attach(left),
        _backward: InputModule.State().attach(backward),
        _right: InputModule.State().attach(right),
        _up: InputModule.State().attach(up),
        _down: InputModule.State().attach(down),
        get forward() { return this._forward.get(false); },
        get backward() { return this._backward.get(false); },
        get up() { return this._up.get(false); },
        get left() { return this._left.get(false); },
        get down() { return this._down.get(false); },
        get right() { return this._right.get(false); }
    };
}
