import { mat4, vec3, quat } from 'gl-matrix';

import { HEX } from '@milque/util';

export class Tia {

    constructor() {
        // NOTE: Offset canvas for pixel-perfect rendering.
        this.projectionMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(-0.5, -0.5, 0));
        this.viewMatrix = mat4.create();
        this.position = vec3.create();
        this.rotation = quat.create();
        this.scaling = vec3.fromValues(1, 1, 1);
        this.transformMatrix = mat4.create();
        this.transformStack = [];
        this.oldDOMMatrix = null;
        this.worldDOMMatrix = new DOMMatrix();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    cls(ctx, color = undefined) {
        this.matBegin(ctx);
        ctx.resetTransform();
        if (typeof color === 'undefined') {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        } else {
            ctx.fillStyle = HEX.toCSSColor(color);
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        this.matEnd(ctx);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} radius 
     * @param {number} color 
     */
    circ(ctx, x, y, radius, color) {
        this.matBegin(ctx);
        ctx.strokeStyle = HEX.toCSSColor(color);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        this.matEnd(ctx);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} radius 
     * @param {number} color 
     */
    circFill(ctx, x, y, radius, color) {
        this.matBegin(ctx);
        ctx.fillStyle = HEX.toCSSColor(color);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        this.matEnd(ctx);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} color 
     */
    rect(ctx, x1, y1, x2, y2, color) {
        this.matBegin(ctx);
        ctx.strokeStyle = HEX.toCSSColor(color);
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        this.matEnd(ctx);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} color 
     */
    rectFill(ctx, x1, y1, x2, y2, color) {
        this.matBegin(ctx);
        ctx.fillStyle = HEX.toCSSColor(color);
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        this.matEnd(ctx);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} color 
     */
    line(ctx, x1, y1, x2, y2, color) {
        this.matBegin(ctx);
        ctx.strokeStyle = HEX.toCSSColor(color);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        this.matEnd(ctx);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x
     * @param {number} y
     * @param {number} dw
     * @param {number} dh
     * @param {number} angle
     * @param {number} color 
     */
    trig(ctx, x, y, dw, dh, angle, color) {
        this.matBegin(ctx);
        ctx.fillStyle = HEX.toCSSColor(color);
        ctx.rotate(angle);
        ctx.beginPath();
        let dy = dh / 2;
        let dx = dw / 2;
        ctx.moveTo(x + dx, y);
        ctx.lineTo(x - dx, y - dy);
        ctx.lineTo(x - dx, y + dy);
        ctx.fill();
        this.matEnd(ctx);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x
     * @param {number} y
     * @param {number} dw
     * @param {number} dh
     * @param {number} angle
     * @param {number} color 
     */
    trigFill(ctx, x, y, dw, dh, angle, color) {
        this.matBegin(ctx);
        ctx.fillStyle = HEX.toCSSColor(color);
        ctx.rotate(angle);
        ctx.beginPath();
        let dy = dh / 2;
        let dx = dw / 2;
        ctx.moveTo(x + dx, y);
        ctx.lineTo(x - dx, y - dy);
        ctx.lineTo(x - dx, y + dy);
        ctx.fill();
        this.matEnd(ctx);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} color 
     */
    print(ctx, text, x, y, color) {
        this.matBegin(ctx);
        ctx.fillStyle = HEX.toCSSColor(color);
        ctx.font = '16px sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(text, x, y);
        this.matEnd(ctx);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {CanvasImageSource} spriteImage
     * @param {number} spriteIndex 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     * @param {boolean} flipX 
     * @param {boolean} flipY 
     */
    spr(ctx, spriteImage, spriteIndex, x, y, w, h, flipX = false, flipY = false) {
        let dx = Math.floor(Number(spriteImage.width) / w);
        let u = (spriteIndex % dx) * w;
        let v = (Math.floor(spriteIndex / dx)) * h;
        this.sprUV(ctx, spriteImage, u, v, w, h, x, y, w, h, flipX, flipY);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {CanvasImageSource} spriteImage
     * @param {number} u
     * @param {number} v
     * @param {number} s
     * @param {number} t
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     * @param {boolean} flipX 
     * @param {boolean} flipY 
     */
    sprUV(ctx, spriteImage, u, v, s, t, x, y, w, h, flipX = false, flipY = false) {
        this.matBegin(ctx);
        let dx = flipX ? w : 0;
        let dy = flipY ? h : 0;
        let dw = flipX ? -1 : 1;
        let dh = flipY ? -1 : 1;
        ctx.translate(x + dx, y + dy);
        ctx.scale(dw, dh);
        ctx.drawImage(spriteImage, u, v, s, t, 0, 0, w, h);
        this.matEnd(ctx);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    camera(x, y, w, h) {
        mat4.fromTranslation(this.viewMatrix, vec3.fromValues(x, y, 0));
        this.matUpdate();
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {number} radians
     */
    mat(x, y, scaleX, scaleY, radians) {
        this.position[0] = x;
        this.position[1] = y;
        this.scaling[0] = scaleX;
        this.scaling[1] = scaleY;
        quat.fromEuler(this.rotation, 0, 0, radians);
        this.matUpdate();
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    matPos(x, y) {
        this.position[0] = x;
        this.position[1] = y;
        this.matUpdate();
    }

    /**
     * @param {number} scaleX
     * @param {number} scaleY
     */
    matScale(scaleX, scaleY) {
        this.scaling[0] = scaleX;
        this.scaling[1] = scaleY;
        this.matUpdate();
    }

    /**
     * @param {number} angles
     */
    matRot(angles) {
        quat.fromEuler(this.rotation, 0, 0, angles);
        this.matUpdate();
    }

    push() {
        mat4.fromRotationTranslationScale(this.transformMatrix, this.rotation, this.position, this.scaling);
        quat.identity(this.rotation);
        vec3.set(this.position, 0, 0, 0);
        vec3.set(this.scaling, 1, 1, 1);
        this.transformStack.push(this.transformMatrix);
        this.transformMatrix = mat4.create();
    }

    pop() {
        if (this.transformStack.length > 0) {
            let result = this.transformStack.pop();
            mat4.getRotation(this.rotation, result);
            mat4.getScaling(this.scaling, result);
            mat4.getTranslation(this.position, result);
        } else {
            quat.identity(this.rotation);
            vec3.set(this.position, 0, 0, 0);
            vec3.set(this.scaling, 1, 1, 1);
        }
        mat4.fromRotationTranslationScale(this.transformMatrix, this.rotation, this.position, this.scaling);
    }

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx 
     */
    matBegin(ctx) {
        this.oldDOMMatrix = ctx.getTransform();
        ctx.setTransform(this.worldDOMMatrix);
    }

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx 
     */
    matEnd(ctx) {
        ctx.setTransform(this.oldDOMMatrix);
        this.oldDOMMatrix = null;
    }

    /**
     * @private
     */
    matUpdate() {
        let out = mat4.create();
        mat4.mul(out, this.projectionMatrix, this.viewMatrix);
        let length = this.transformStack.length;
        for(let i = length - 1; i >= 0; --i) {
            let transform = this.transformStack[i];
            mat4.mul(out, out, transform);
        }
        mat4.fromRotationTranslationScale(this.transformMatrix, this.rotation, this.position, this.scaling);
        mat4.mul(out, out, this.transformMatrix);
        this.worldDOMMatrix.a = out[0]; // m11
        this.worldDOMMatrix.b = out[1]; // m12
        this.worldDOMMatrix.c = out[4]; // m21
        this.worldDOMMatrix.d = out[5]; // m22
        this.worldDOMMatrix.e = out[12]; // m41
        this.worldDOMMatrix.f = out[13]; // m42
    }
}
