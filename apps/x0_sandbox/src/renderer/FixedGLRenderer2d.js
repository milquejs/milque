import { vec3, quat, mat4 } from 'gl-matrix';

export class FixedGLRenderer2d
{
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas)
    {
        /** @type {WebGLRenderingContext} */
        const gl = canvas.getContext('webgl');
        /** @protected */
        this.gl = gl;
        /** @private */
        this.transformStack = [];
    }

    pushTranslation(x, y, z = 0)
    {
        let result = mat4.create();
        mat4.fromTranslation(result, vec3.fromValues(x, y, z));
        return this.pushTransform(result);
    }

    pushRotation(degrees, originX = 0, originY = 0)
    {
        let result = mat4.create();
        if (!originX && !originY)
        {
            mat4.fromZRotation(result, Math.PI * degrees / 180);
        }
        else
        {
            mat4.fromRotationTranslationScaleOrigin(result,
                quat.fromEuler(quat.create(), 0, 0, degrees),
                vec3.fromValues(0, 0, 0),
                vec3.fromValues(1, 1, 1),
                vec3.fromValues(originX, originY, 0));
        }
        return this.pushTransform(result);
    }

    pushScaling(scaleX, scaleY, originX = 0, originY = 0)
    {
        let result = mat4.create();
        if (!originX && !originY)
        {
            mat4.fromScaling(result, vec3.fromValues(scaleX, scaleY, 1));
        }
        else
        {
            mat4.fromRotationTranslationScaleOrigin(result,
                quat.fromEuler(quat.create(), 0, 0, 0),
                vec3.fromValues(0, 0, 0),
                vec3.fromValues(scaleX, scaleY, 1),
                vec3.fromValues(originX, originY, 0));
        }
        return this.pushTransform(result);
    }

    pushTransform(transformationMatrix)
    {
        if (this.transformStack.length > 0)
        {
            let index = this.transformStack.length - 1;
            let prevMatrix = this.transformStack[index];
            let nextMatrix = mat4.mul(mat4.create(),
                prevMatrix,
                transformationMatrix);
            this.transformStack.push(nextMatrix);
        }
        else
        {
            this.transformStack.push(
                mat4.copy(mat4.create(), transformationMatrix));
        }
        return this;
    }

    popTransform()
    {
        this.transformStack.pop();
        return this;
    }

    /** @protected */
    peekTransform()
    {
        let index = this.transformStack.length - 1;
        if (index >= 0)
        {
            return this.transformStack[index];
        }
        else
        {
            return null;
        }
    }

    resetTransform()
    {
        this.transformStack.length = 0;
        return this;
    }
}
