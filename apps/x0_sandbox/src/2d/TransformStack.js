import { mat4, vec3 } from 'gl-matrix';

export class TransformStack
{
    constructor()
    {
        this.transformStack = [mat4.create()];
        /** @private */
        this.transformCurrent = mat4.create();
        /** @private */
        this.vec = vec3.create();
    }

    pushTransformMatrix()
    {
        this.transformStack.push(mat4.copy(mat4.create(), this.transformCurrent));
        mat4.identity(this.transformCurrent);
        return this;
    }

    popTransformMatrix()
    {
        if (this.transformStack.length > 1)
        {
            let mat = this.transformStack.pop();
            mat4.copy(this.transformCurrent, mat);
        }
        else
        {
            mat4.identity(this.transformStack[0]);
        }
        return this;
    }

    getTransformMatrix()
    {
        return this.transformCurrent;
    }

    translate(x, y, z = 0)
    {
        let mat = this.transformCurrent;
        let vec = this.vec;
        mat4.translate(mat, mat, vec3.set(vec, x, y, z));
        return this;
    }

    rotateZ(radians)
    {
        let mat = this.transformCurrent;
        mat4.rotateZ(mat, mat, radians);
        return this;
    }

    scale(x, y, z = 1)
    {
        let mat = this.transformCurrent;
        let vec = this.vec;
        mat4.scale(mat, mat, vec3.set(vec, x, y, z));
        return this;
    }
}