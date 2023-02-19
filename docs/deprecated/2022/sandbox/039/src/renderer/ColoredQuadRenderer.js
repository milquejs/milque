import { vec3 } from 'gl-matrix';
import { ProgramInfo, BufferInfo, BufferHelper } from '@milque/mogli';
import { QuadRendererBase } from './QuadRendererBase.js';

const PROGRAM_INFO = Symbol('programInfo');
const QUAD_BUFFER_INFO = Symbol('quadBufferInfo');

const WEBGL_VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

void main()
{
    gl_Position = u_projection * u_view * u_model * vec4(a_position.xy, 0.0, 1.0);
}`;

const WEBGL_FRAGMENT_SHADER_SOURCE = `
precision mediump float;

uniform vec3 u_color;

void main()
{
    gl_FragColor = vec4(u_color.rgb, 1.0);
}`;

export class ColoredQuadRenderer extends QuadRendererBase {
  /**
   * @protected
   * @param {WebGLRenderingContextBase} gl
   * @returns {BufferInfo}
   */
  static getQuadBufferInfo(gl) {
    let bufferInfo = this[QUAD_BUFFER_INFO];
    if (!bufferInfo) {
      bufferInfo = BufferInfo.builder(gl, gl.ARRAY_BUFFER)
        .data(
          BufferHelper.createBufferSource(
            gl,
            gl.FLOAT,
            [
              // Top-Left
              0, 0, 1, 0, 0, 1,
              // Bottom-Right
              1, 1, 1, 0, 0, 1,
            ]
          )
        )
        .build();
      this[QUAD_BUFFER_INFO] = bufferInfo;
    }
    return bufferInfo;
  }

  /**
   * @protected
   * @param {WebGLRenderingContextBase} gl
   * @returns {ProgramInfo}
   */
  static getProgramInfo(gl) {
    let programInfo = this[PROGRAM_INFO];
    if (!programInfo) {
      programInfo = ProgramInfo.builder(gl)
        .shader(gl.VERTEX_SHADER, WEBGL_VERTEX_SHADER_SOURCE)
        .shader(gl.FRAGMENT_SHADER, WEBGL_FRAGMENT_SHADER_SOURCE)
        .link();
      this[PROGRAM_INFO] = programInfo;
    }
    return programInfo;
  }

  /**
   * @param {WebGLRenderingContext} gl
   */
  constructor(gl) {
    super(gl);

    /** @private */
    this._colorVector = vec3.fromValues(1, 1, 1);
  }

  setColor(r = 1, g = 1, b = 1) {
    vec3.set(this._colorVector, r, g, b);
    return this;
  }

  /** @override */
  draw(posX = 0, posY = 0, scaleX = 1, scaleY = 1) {
    let gl = this.gl;
    let constructor = /** @type {typeof ColoredQuadRenderer} */ (
      this.constructor
    );
    let programInfo = constructor.getProgramInfo(gl);
    let bufferInfo = constructor.getQuadBufferInfo(gl);
    const projection = this.getProjectionMatrix();
    const view = this.getViewMatrix();
    let model = this.updateModelMatrix(posX, posY, scaleX, scaleY);
    let color = this._colorVector;
    programInfo
      .bind(gl)
      .attribute('a_position', gl.FLOAT, bufferInfo.handle)
      .uniform('u_projection', projection)
      .uniform('u_view', view)
      .uniform('u_model', model)
      .uniform('u_color', color)
      .draw(gl, gl.TRIANGLES, 0, 6);
  }
}
