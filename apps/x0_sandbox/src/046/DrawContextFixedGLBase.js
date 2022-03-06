import { OrthographicCamera } from '@milque/scene';
import { mat4, vec3 } from 'gl-matrix';
import { hex } from 'src/renderer/color.js';

export class DrawContextFixedGLBase {

    /**
     * @param {WebGLRenderingContext} gl
     * @param {HTMLCanvasElement} [canvas]
     * @param {import('@milque/scene').Camera} [camera]
     */
    constructor(gl, canvas = gl.canvas, camera = new OrthographicCamera()) {
        /** @protected */
        this.gl = gl;
        /** @protected */
        this.canvas = canvas;
        /** @protected */
        this.camera = camera;
        /** @protected */
        this.projectionViewMatrix = mat4.create();
        /** @protected */
        this.modelMatrix = mat4.create();
        /** @protected */
        this.colorVector = vec3.create();
        /** @protected */
        this.depthFloat = 0;

        // Initialize webgl state machine
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }

    reset() {
        this.resize();
        this.clear(0, 0, 0, 1);
        this.setColorVector(1, 1, 1);
        this.setDepthFloat(0);
    }

    /**
     * To be called every frame to clear screen buffer and
     * resize camera matrices to fit.
     */
    resize() {
        const gl = this.gl;
        const viewportWidth = gl.canvas.width;
        const viewportHeight = gl.canvas.height;
        gl.viewport(0, 0, viewportWidth, viewportHeight);

        let camera = this.camera;
        camera.resize(viewportWidth, viewportHeight);

        let projViewMatrix = this.projectionViewMatrix;
        mat4.mul(projViewMatrix,
            camera.projectionMatrix,
            camera.viewMatrix);
    }

    /**
     * @param {Number} redf
     * @param {Number} greenf
     * @param {Number} bluef
     * @param {Number} [alphaf=1]
     */
    clear(redf, greenf, bluef, alphaf = 1) {
        const gl = this.gl;
        gl.clearColor(redf, greenf, bluef, alphaf);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * @param {Number} redf
     * @param {Number} greenf
     * @param {Number} bluef
     */
    setColorVector(redf, greenf, bluef) {
        vec3.set(this.colorVector, redf, greenf, bluef);
        return this;
    }

    /**
     * @param {Number} colorHex 
     */
    setColor(colorHex) {
        return this.setColorVector(
            hex.redf(colorHex),
            hex.greenf(colorHex),
            hex.bluef(colorHex));
    }

    /** @param {Number} z */
    setDepthFloat(z) {
        this.depthFloat = z;
        return this;
    }
}
