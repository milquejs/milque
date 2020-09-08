import { mat4 } from 'gl-matrix';
import { Camera2D } from '../camera/Camera2D.js';

export class CanvasView2D
{
    constructor(display, camera = new Camera2D())
    {
        this.display = display;
        this.camera = camera;

        this.viewTransformDOMMatrix = new DOMMatrix();
    }
    
    transformScreenToWorld(screenX, screenY)
    {
        let matrix = mat4.create();
        this.getViewProjectionMatrix(matrix);
        mat4.invert(matrix, matrix);
        let result = vec3.fromValues(screenX, screenY, 0);
        vec3.transformMat4(result, result, matrix);
        return result;
    }
    
    transformCanvas(ctx)
    {
        let domMatrix = this.viewTransformDOMMatrix;
        let matrix = mat4.create();
        this.getViewProjectionMatrix(matrix);
        setDOMMatrix(domMatrix, matrix);

        const { a, b, c, d, e, f } = domMatrix;
        ctx.transform(a, b, c, d, e, f);
    }

    getViewProjectionMatrix(out)
    {
        const displayWidth = this.display.width;
        const displayHeight = this.display.height;

        let matrix = mat4.create();
        const projectionMatrix = this.camera.getProjectionMatrix(matrix);
        const viewMatrix = this.camera.getViewMatrix(out);
        mat4.multiply(matrix, viewMatrix, projectionMatrix);
        // HACK: This is the correct canvas matrix, but since we simply restore the
        // the aspect ratio by effectively undoing the scaling, we can skip this step
        // all together to achieve the same effect (albeit incorrect).
        /*
        const canvasMatrix = mat4.fromRotationTranslationScale(
            out,
            [0, 0, 0, 1],
            [displayWidth / 2, displayHeight / 2, 0],
            [displayWidth, displayHeight, 0]);
        */
        // HACK: This shouldn't be here. This should really be in the view matrix.
        const canvasMatrix = mat4.fromTranslation(
            out,
            [displayWidth / 2, displayHeight / 2, 0]);
        mat4.multiply(out, canvasMatrix, matrix);
        return out;
    }
}

export function setDOMMatrix(domMatrix, glMatrix)
{
    domMatrix.a = glMatrix[0];
    domMatrix.b = glMatrix[1];
    domMatrix.c = glMatrix[4];
    domMatrix.d = glMatrix[5];
    domMatrix.e = glMatrix[12];
    domMatrix.f = glMatrix[13];
    return domMatrix;
}
