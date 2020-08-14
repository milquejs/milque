import { mat4, vec3, quat } from 'gl-matrix';
import { Camera } from './Camera.js';

export class Camera3D extends Camera
{
    static screenToWorld(screenX, screenY, viewMatrix, projectionMatrix)
    {
        let mat = mat4.multiply(mat4.create(), projectionMatrix, viewMatrix);
        mat4.invert(mat, mat);
        let result = vec3.fromValues(screenX, screenY, 0);
        vec3.transformMat4(result, result, mat);
        return result;
    }
    
    constructor(fieldOfView, aspectRatio, near = 0.1, far = 1000)
    {
        super();

        this.position = vec3.create();
        this.rotation = quat.create();

        this.fieldOfView = fieldOfView;

        this.aspectRatio = aspectRatio;
        this.clippingPlane = {
            near,
            far,
        };
        
        this._viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create();
    }

    get x() { return this.position[0]; }
    set x(value) { this.position[0] = value; }
    get y() { return this.position[1]; }
    set y(value) { this.position[1] = value; }
    get z() { return this.position[2]; }
    set z(value) { this.position[2] = value; }

    /** Moves the camera. This is the only way to change the position. */
    moveTo(x, y, z, dt = 1)
    {
        let nextPosition = vec3.fromValues(x, y, z);
        vec3.lerp(this.position, this.position, nextPosition, Math.min(1, dt));
    }

    /** @override */
    getViewMatrix(out = this._viewMatrix)
    {
        let viewX = -this.x;
        let viewY = -this.y;
        let viewZ = -this.z;
        let invPosition = vec3.fromValues(viewX, viewY, viewZ);
        mat4.fromRotationTranslation(out, this.rotation, invPosition);
        return out;
    }

    /** @override */
    getProjectionMatrix(out = this._projectionMatrix)
    {
        let { near, far } = this.clippingPlane;
        mat4.perspective(out, this.fieldOfView, this.aspectRatio, near, far);
        return out;
    }
}
