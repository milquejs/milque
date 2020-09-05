import { mat4 } from './lib.js';

export class Transform
{
    constructor(x = 0, y = 0, z = 0)
    {
        this.worldTransformation = mat4.create();
        this.localTransformation = mat4.fromTranslation(mat4.create(), [x, y, z]);
    }

    get x() { return; }
    set x(value) {}

    get y() { return; }
    set y(value) {}

    get z() { return; }
    set z(value) {}

    get pitch() { return; }
    set pitch(value) {}

    get yaw() { return; }
    set yaw(value) {}

    get roll() { return; }
    set roll(value) {}

    get scaleX() { return; }
    set scaleX(value) {}

    get scaleY() { return; }
    set scaleY(value) {}

    get scaleZ() { return; }
    set scaleZ(value) {}
}
