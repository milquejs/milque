import { vec3 as vec3$1, quat, mat4 } from 'gl-matrix';

class Camera
{
    /** @abstract */
    getViewMatrix(out) {}
    
    /** @abstract */
    getProjectionMatrix(out) {}
}

class Camera2D extends Camera
{
    constructor(left = -1, right = 1, top = -1, bottom = 1, near = 0, far = 1)
    {
        this.position = vec3$1.create();
        this.rotation = quat.create();
        this.scale = vec3$1.fromValues(1, 1, 1);

        this.clippingPlane = {
            left, right, top, bottom, near, far,
        };
    }

    get x() { return this.position[0]; }
    set x(value) { this.position[0] = value; }
    get y() { return this.position[1]; }
    set y(value) { this.position[1] = value; }
    get z() { return this.position[2]; }
    set z(value) { this.position[2] = value; }
    
    moveTo(x, y, z = 0, dt = 1)
    {
        let nextPosition = vec3$1.fromValues(x, y, z);
        vec3$1.lerp(this.position, this.position, nextPosition, Math.max(Math.min(dt, 1), 0));
        return this;
    }

    /** @override */
    getViewMatrix(out)
    {
        let viewX = -Math.round(this.x);
        let viewY = -Math.round(this.y);
        let viewZ = this.z === 0 ? 1 : 1 / this.z;
        let invPosition = vec3$1.fromValues(viewX, viewY, 0);
        let invScale = vec3$1.fromValues(this.scale[0] * viewZ, this.scale[1] * viewZ, 1);
        mat4.fromRotationTranslationScale(out, this.rotation, invPosition, invScale);
        return out;
    }

    /** @override */
    getProjectionMatrix(out)
    {
        let { left, right, top, bottom, near, far } = this.clippingPlane;
        mat4.ortho(out, left, right, top, bottom, near, far);
        return out;
    }
}

class CanvasView2D
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

function setDOMMatrix(domMatrix, glMatrix)
{
    domMatrix.a = glMatrix[0];
    domMatrix.b = glMatrix[1];
    domMatrix.c = glMatrix[4];
    domMatrix.d = glMatrix[5];
    domMatrix.e = glMatrix[12];
    domMatrix.f = glMatrix[13];
    return domMatrix;
}

/** @deprecated */
class Camera3D extends Camera
{
    static screenToWorld(screenX, screenY, viewMatrix, projectionMatrix)
    {
        let mat = mat4.multiply(mat4.create(), projectionMatrix, viewMatrix);
        mat4.invert(mat, mat);
        let result = vec3$1.fromValues(screenX, screenY, 0);
        vec3$1.transformMat4(result, result, mat);
        return result;
    }
    
    constructor(fieldOfView, aspectRatio, near = 0.1, far = 1000)
    {
        super();

        this.position = vec3$1.create();
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
        let nextPosition = vec3$1.fromValues(x, y, z);
        vec3$1.lerp(this.position, this.position, nextPosition, Math.min(1, dt));
    }

    /** @override */
    getViewMatrix(out = this._viewMatrix)
    {
        let viewX = -this.x;
        let viewY = -this.y;
        let viewZ = -this.z;
        let invPosition = vec3$1.fromValues(viewX, viewY, viewZ);
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

export { Camera as C, Camera2D as a, CanvasView2D as b, Camera3D as c, setDOMMatrix as s };
