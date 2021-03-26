import { mat4, vec3 } from 'gl-matrix';

export class AbstractQuadRenderer
{
    /**
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl)
    {
        /** @private */
        this.gl = gl;
        
        /** @private */
        this._transformMatrix = mat4.create();
        /** @private */
        this._projectionViewMatrix = mat4.create();

        /** @private */
        this._matrix = mat4.create();
        /** @private */
        this._vector = vec3.create();
    }

    setTransformationMatrix(matrix)
    {
        mat4.copy(this._transformMatrix, matrix);
        return this;
    }

    setProjectionViewMatrix(matrix)
    {
        mat4.copy(this._projectionViewMatrix, matrix);
        return this;
    }

    /** @protected */
    updateModelMatrix(posX, posY, scaleX, scaleY)
    {
        let m = this._matrix;
        let v = this._vector;
        mat4.copy(m, this._transformMatrix);
        mat4.translate(m, m, vec3.set(v, posX, posY, 0));
        mat4.scale(m, m, vec3.set(v, scaleX, scaleY, 1));
        return m;
    }

    /** @abstract */
    draw(posX = 0, posY = 0, scaleX = 1, scaleY = 1) {}
}
