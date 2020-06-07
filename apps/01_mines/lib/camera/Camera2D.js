import { mat4, vec3, quat } from '../../../../node_modules/gl-matrix/esm/index.js';
import { lerp } from '../MathHelper.js';
import { Camera } from './Camera.js';

export class Camera2D extends Camera
{
    constructor()
    {
        super();

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.position = vec3.create();
        this.rotation = quat.create();
        this.scale = vec3.create();

        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        // mat4.ortho(this.projectionMatrix, 1, 1, 1, 1, 1, 1);
    }

    moveTo(x, y, z = 0, dt = 1)
    {
        this.x = lerp(this.x, x, dt);
        this.y = lerp(this.y, y, dt);
        this.z = lerp(this.z, z, dt);

        let viewX = -Math.round(this.x);
        let viewY = -Math.round(this.y);
        let viewZ = this.z === 0 ? 1 : 1 / this.z;

        vec3.set(this.position, viewX, viewY, 0);
        vec3.set(this.scale, viewZ, viewZ, 1);
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
