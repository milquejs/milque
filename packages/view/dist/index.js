(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gl-matrix')) :
    typeof define === 'function' && define.amd ? define(['exports', 'gl-matrix'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.Milque = global.Milque || {}, global.Milque.Util = {}), global.glMatrix));
}(this, (function (exports, glMatrix) { 'use strict';

    class CanvasView
    {
        constructor()
        {
            this.prevTransformMatrix = null;

            this.domProjectionMatrix = new DOMMatrix();
            this.domViewMatrix = new DOMMatrix();

            this.ctx = null;
        }

        begin(ctx, viewMatrix, projectionMatrix)
        {
            if (this.ctx)
            {
                throw new Error('View already begun - maybe missing end() call?');
            }

            if (viewMatrix) setDOMMatrix(this.domViewMatrix, viewMatrix);
            if (projectionMatrix) setDOMMatrix(this.domProjectionMatrix, projectionMatrix);

            this.prevTransformMatrix = ctx.getTransform();

            ctx.setTransform(this.domProjectionMatrix);
            const { a, b, c, d, e, f } = this.domViewMatrix;
            ctx.transform(a, b, c, d, e, f);

            this.ctx = ctx;
        }

        end(ctx)
        {
            ctx.setTransform(this.prevTransformMatrix);
            
            this.ctx = null;
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

    class Camera
    {
        /** @abstract */
        getViewMatrix(out) {}
        
        /** @abstract */
        getProjectionMatrix(out) {}
    }

    class Camera2D extends Camera
    {
        static screenToWorld(screenX, screenY, viewMatrix, projectionMatrix)
        {
            let mat = glMatrix.mat4.multiply(glMatrix.mat4.create(), projectionMatrix, viewMatrix);
            glMatrix.mat4.invert(mat, mat);
            let result = glMatrix.vec3.fromValues(screenX, screenY, 0);
            glMatrix.vec3.transformMat4(result, result, mat);
            return result;
        }
        
        constructor(left = -1, right = 1, top = -1, bottom = 1, near = 0, far = 1)
        {
            super();

            this.position = glMatrix.vec3.create();
            this.rotation = glMatrix.quat.create();
            this.scale = glMatrix.vec3.fromValues(1, 1, 1);

            this.clippingPlane = {
                left, right, top, bottom, near, far,
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
        moveTo(x, y, z = 0, dt = 1)
        {
            let nextPosition = glMatrix.vec3.fromValues(x, y, z);
            glMatrix.vec3.lerp(this.position, this.position, nextPosition, Math.min(1, dt));
        }

        /** @override */
        getViewMatrix(out = this._viewMatrix)
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
        getProjectionMatrix(out = this._projectionMatrix)
        {
            let { left, right, top, bottom, near, far } = this.clippingPlane;
            glMatrix.mat4.ortho(out, left, right, top, bottom, near, far);
            return out;
        }
    }

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
    exports.CanvasView = CanvasView;
    exports.setDOMMatrix = setDOMMatrix;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
