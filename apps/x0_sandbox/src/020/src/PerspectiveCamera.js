import { toRadians } from './lib.js';
import { mat4, vec3 } from 'gl-matrix';

export function createPerspectiveCamera(canvas, fieldOfView = toRadians(40), near = 0.1, far = 1000)
{
    let result = {
        canvas,
        fieldOfView,
        clippingPlane: {
            near,
            far,
        },
        _position: vec3.create(),
        _up: vec3.create(),
        get position()
        {
            return vec3.set(this._position,
                this.viewMatrix[12],
                this.viewMatrix[13],
                this.viewMatrix[14]);
        },
        get up()
        {
            return vec3.set(this._up,
                0, 1, 0);
        },
        projectionMatrix: mat4.create(),
        viewMatrix: mat4.create(),
        destroy()
        {
            canvas.removeEventListener('resize', this.onResize);
        },
        onResize()
        {
            updateProjection(this);
        }
    };
    canvas.addEventListener('resize', result.onResize);
    updateProjection(result);
    return result;
}

function updateProjection(camera)
{
    const aspectRatio = camera.canvas.width / camera.canvas.height;
    const { near, far } = camera.clippingPlane;
    mat4.perspective(camera.projectionMatrix, camera.fieldOfView, aspectRatio, near, far);
}
