import { mat4, vec3 } from 'gl-matrix';

export class QuadRendererBase
{
    /**
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl)
    {
        /** @protected */
        this.gl = gl;
        
        /** @private */
        this._transformMatrix = mat4.create();
        /** @private */
        this._viewMatrix = mat4.create();
        /** @private */
        this._projectionMatrix = mat4.create();

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

    getTransformationMatrix()
    {
        return this._transformMatrix;
    }

    setProjectionMatrix(matrix)
    {
        mat4.copy(this._projectionMatrix, matrix);
        return this;
    }

    getProjectionMatrix()
    {
        return this._projectionMatrix;
    }

    setViewMatrix(matrix)
    {
        mat4.copy(this._viewMatrix, matrix);
        return this;
    }

    getViewMatrix()
    {
        return this._viewMatrix;
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
