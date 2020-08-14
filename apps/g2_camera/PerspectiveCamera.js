import { mat4, MathHelper } from './lib.js';

export function createPerspectiveCamera(canvas, fieldOfView = MathHelper.toRadians(40), near = 0.1, far = 1000)
{
    let result = {
        canvas,
        fieldOfView,
        clippingPlane: {
            near,
            far,
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
