import { mat3, mat4, vec3, quat } from '../../../node_modules/gl-matrix/esm/index.js';
import { Camera } from './Camera.js';

export class Camera2D extends Camera
{
    constructor()
    {
        super();

        this.position = vec3.create();
        this.rotation = quat.create();
        this.scale = vec3.create();

        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
    }

    moveTo(x, y, z = 0, dt = 1)
    {
        let invZ = z === 0 ? 1 : 1 / z;
        vec3.set(this.position, -x, -y, 0);
        vec3.set(this.scale, invZ, invZ, 1);
        mat4.fromRotationTranslationScale(this.viewMatrix, this.rotation, this.position, this.scale);
        return this;
    }

    /** @override */
    getViewMatrix()
    {
        return this.viewMatrix;
    }

    /** @override */
    getProjectionMatrix()
    {
        return this.projectionMatrix;
    }
}
