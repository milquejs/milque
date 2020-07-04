import { mat4, vec3, quat } from '../../../../node_modules/gl-matrix/esm/index.js';
import { Camera } from './Camera.js';

const IDENTITY_MATRIX = mat4.create();

export class Camera2D extends Camera
{
    static screenToWorld(screenX, screenY, viewMatrix = IDENTITY_MATRIX, projectionMatrix = IDENTITY_MATRIX)
    {
        let mat = mat4.multiply(mat4.create(), projectionMatrix, viewMatrix);
        mat4.invert(mat, mat);
        let result = vec3.fromValues(screenX, screenY, 0);
        vec3.transformMat4(result, result, mat);
        return result;
    }
    
    constructor()
    {
        super();

        this.position = vec3.create();
        this.rotation = quat.create();
        this.scale = vec3.create();

        this.projection = mat4.create();
        mat4.ortho(this.projection, -1, 1, -1, 1, 0, 1);
        
        this._viewPosition = vec3.create();
        this._viewScale = vec3.create();
        
        this._viewMatrix = mat4.create();
        this._projMatrix = mat4.create();
    }

    get x() { return this.position[0]; }
    set x(value) { this.position[0] = value; }
    get y() { return this.position[1]; }
    set y(value) { this.position[1] = value; }
    get z() { return this.position[2]; }
    set z(value) { this.position[2] = value; }

    /** Moves the camera. This is the only way to change the position. */
    moveTo(x, y, z = 0, dt = 1)
    {
        const nextPosition = vec3.set(this._viewPosition, x, y, z);
        vec3.lerp(this.position, this.position, nextPosition, dt);
    }

    /** @override */
    getViewMatrix(out = this._viewMatrix)
    {
        let viewX = -Math.round(this.x);
        let viewY = -Math.round(this.y);
        let viewZ = this.z === 0 ? 1 : 1 / this.z;

        vec3.set(this._viewPosition, viewX, viewY, 0);
        vec3.set(this._viewScale, viewZ, viewZ, 1);
        mat4.fromRotationTranslationScale(out, this.rotation, this._viewPosition, this._viewScale);
        return out;
    }

    /** @override */
    getProjectionMatrix(out = this._projMatrix)
    {
        mat4.copy(out, this.projection);
        return out;
    }
}
