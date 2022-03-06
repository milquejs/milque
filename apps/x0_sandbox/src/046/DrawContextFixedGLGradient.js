import { ProgramInfoBuilder } from '@milque/mogli';
import { mat4, quat, vec3, vec4 } from 'gl-matrix';
import { hex } from 'src/renderer/color.js';
import { DrawContextFixedGLTexture } from './DrawContextFixedGLTexture.js';

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;

varying vec2 v_position;

uniform mat4 u_projection_view;
uniform mat4 u_model;

void main() {
    gl_Position = u_projection_view * u_model * vec4(a_position.xy, 0.0, 1.0);
    v_position = a_position;
}`;

const FRAGMENT_SHADER_SOURCE = `
precision mediump float;

varying vec2 v_position;

uniform vec3 u_color;

uniform vec3 u_color_from;
uniform vec3 u_color_to;

uniform vec4 u_gradient_rect;

void main() {
    // float fx = (gl_FragCoord.x - u_gradient_rect.x) / u_gradient_rect.z;
    float fy = (gl_FragCoord.y - u_gradient_rect.y) / u_gradient_rect.w;
    gl_FragColor = vec4(mix(u_color_to, u_color_from, fy), 1);
}`;

export class DrawContextFixedGLGradient extends DrawContextFixedGLTexture {

    /**
     * @param {WebGLRenderingContext} gl
     * @param {HTMLCanvasElement} [canvas]
     * @param {import('@milque/scene').Camera} [camera]
     */
    constructor(gl, canvas = undefined, camera = undefined) {
        super(gl, canvas, camera);
        /** @protected */
        this.gradientProgram = new ProgramInfoBuilder(gl)
            .shader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE)
            .shader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE)
            .link();
        /** @protected */
        this.gradientColor = vec3.create();
        /** @protected */
        this.gradientVector = vec4.create();
    }

    /** @override */
    resize() {
        super.resize();
        this.gradientProgram.bind(this.gl).uniform('u_projection_view', this.projectionViewMatrix);
    }

    /** @override */
    setColorVector(redf, greenf, bluef) {
        super.setColorVector(redf, greenf, bluef);
        this.gradientProgram.bind(this.gl).uniform('u_color', this.colorVector);
        return this;
    }

    drawGradientRect(
        fromColor = 0xFFFFFF, toColor = 0x000000,
        left = 0, top = 0, right = this.canvas.width, bottom = this.canvas.height) {
        let rx = (right - left) / 2;
        let ry = (bottom - top) / 2;
        let x = left + rx;
        let y = top + ry;
        let z = this.depthFloat;

        const gl = this.gl;
        let modelMatrix = this.modelMatrix;
        mat4.fromRotationTranslationScaleOrigin(modelMatrix,
            quat.fromEuler(quat.create(), 0, 0, 0),
            vec3.fromValues(x, y, z),
            vec3.fromValues(rx * 2, ry * 2, 1),
            vec3.fromValues(0.5, 0.5, 0));
        this.applyTransform(modelMatrix);
        this.gradientProgram.bind(gl)
            .attribute('a_position', gl.FLOAT, this.meshQuad.handle)
            .uniform('u_model', modelMatrix)
            .uniform('u_color_from', vec3.set(
                this.gradientColor,
                hex.redf(fromColor),
                hex.greenf(fromColor),
                hex.bluef(fromColor)))
            .uniform('u_color_to', vec3.set(
                this.gradientColor,
                hex.redf(toColor),
                hex.greenf(toColor),
                hex.bluef(toColor)))
            .uniform('u_gradient_rect', vec4.set(
                this.gradientVector,
                left, this.canvas.height - bottom,
                rx * 2, ry * 2))
            .draw(gl, gl.TRIANGLES, 0, 6);
        return this;
    }
}
