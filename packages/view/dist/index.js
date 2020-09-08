(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gl-matrix')) :
    typeof define === 'function' && define.amd ? define(['exports', 'gl-matrix'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.Milque = global.Milque || {}, global.Milque.Util = {}), global.glMatrix));
}(this, (function (exports, glMatrix) { 'use strict';

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
            this.position = glMatrix.vec3.create();
            this.rotation = glMatrix.quat.create();
            this.scale = glMatrix.vec3.fromValues(1, 1, 1);

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
            let nextPosition = glMatrix.vec3.fromValues(x, y, z);
            glMatrix.vec3.lerp(this.position, this.position, nextPosition, Math.max(Math.min(dt, 1), 0));
            return this;
        }

        /** @override */
        getViewMatrix(out)
        {
            let viewX = -Math.round(this.x);
            let viewY = -Math.round(this.y);
            let viewZ = this.z === 0 ? 1 : 1 / this.z;
            let invPosition = glMatrix.vec3.fromValues(viewX, viewY, 0);
            let invScale = glMatrix.vec3.fromValues(this.scale[0] * viewZ, this.scale[1] * viewZ, 1);
            glMatrix.mat4.fromRotationTranslationScale(out, this.rotation, invPosition, invScale);
            return out;
        }

        /** @override */
        getProjectionMatrix(out)
        {
            let { left, right, top, bottom, near, far } = this.clippingPlane;
            glMatrix.mat4.ortho(out, left, right, top, bottom, near, far);
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
            let matrix = glMatrix.mat4.create();
            this.getViewProjectionMatrix(matrix);
            glMatrix.mat4.invert(matrix, matrix);
            let result = vec3.fromValues(screenX, screenY, 0);
            vec3.transformMat4(result, result, matrix);
            return result;
        }
        
        transformCanvas(ctx)
        {
            let domMatrix = this.viewTransformDOMMatrix;
            let matrix = glMatrix.mat4.create();
            this.getViewProjectionMatrix(matrix);
            setDOMMatrix(domMatrix, matrix);

            const { a, b, c, d, e, f } = domMatrix;
            ctx.transform(a, b, c, d, e, f);
        }

        getViewProjectionMatrix(out)
        {
            const displayWidth = this.display.width;
            const displayHeight = this.display.height;

            let matrix = glMatrix.mat4.create();
            const projectionMatrix = this.camera.getProjectionMatrix(matrix);
            const viewMatrix = this.camera.getViewMatrix(out);
            glMatrix.mat4.multiply(matrix, viewMatrix, projectionMatrix);
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
            const canvasMatrix = glMatrix.mat4.fromTranslation(
                out,
                [displayWidth / 2, displayHeight / 2, 0]);
            glMatrix.mat4.multiply(out, canvasMatrix, matrix);
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
            let mat = glMatrix.mat4.multiply(glMatrix.mat4.create(), projectionMatrix, viewMatrix);
            glMatrix.mat4.invert(mat, mat);
            let result = glMatrix.vec3.fromValues(screenX, screenY, 0);
            glMatrix.vec3.transformMat4(result, result, mat);
            return result;
        }
        
        constructor(fieldOfView, aspectRatio, near = 0.1, far = 1000)
        {
            super();

            this.position = glMatrix.vec3.create();
            this.rotation = glMatrix.quat.create();

            this.fieldOfView = fieldOfView;

            this.aspectRatio = aspectRatio;
            this.clippingPlane = {
                near,
                far,
            };
            
            this._viewMatrix = glMatrix.mat4.create();
            this._projectionMatrix = glMatrix.mat4.create();
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
            let nextPosition = glMatrix.vec3.fromValues(x, y, z);
            glMatrix.vec3.lerp(this.position, this.position, nextPosition, Math.min(1, dt));
        }

        /** @override */
        getViewMatrix(out = this._viewMatrix)
        {
            let viewX = -this.x;
            let viewY = -this.y;
            let viewZ = -this.z;
            let invPosition = glMatrix.vec3.fromValues(viewX, viewY, viewZ);
            glMatrix.mat4.fromRotationTranslation(out, this.rotation, invPosition);
            return out;
        }

        /** @override */
        getProjectionMatrix(out = this._projectionMatrix)
        {
            let { near, far } = this.clippingPlane;
            glMatrix.mat4.perspective(out, this.fieldOfView, this.aspectRatio, near, far);
            return out;
        }
    }

    exports.Camera = Camera;
    exports.Camera2D = Camera2D;
    exports.Camera3D = Camera3D;
    exports.CanvasView2D = CanvasView2D;
    exports.setDOMMatrix = setDOMMatrix;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
