import { vec2, vec3, vec4 } from 'gl-matrix';
import { ProgramInfo, BufferInfo, BufferHelper } from '@milque/mogli';
import { QuadRendererBase } from './QuadRendererBase.js';

const PROGRAM_INFO = Symbol('programInfo');
const QUAD_POSITION_BUFFER_INFO = Symbol('quadPositionBufferInfo');
const QUAD_TEXCOORD_BUFFER_INFO = Symbol('quadTexcoordBufferInfo');

const WEBGL_VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

void main()
{
    gl_Position = u_projection * u_view * u_model * vec4(a_position.xy, 0.0, 1.0);
    v_texcoord = a_texcoord;
}`;

const WEBGL_FRAGMENT_SHADER_SOURCE = `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec2 u_texture_size;
uniform vec4 u_sprite;
uniform vec3 u_color;

void main()
{
    vec2 texcoord = vec2(
        (u_sprite.x / u_texture_size.x) + v_texcoord.x * (u_sprite.z / u_texture_size.x),
        (u_sprite.y / u_texture_size.y) + v_texcoord.y * (u_sprite.w / u_texture_size.y));
    float aBlendFactor = 0.5;
    float bBlendFactor = 1.0 - aBlendFactor;
    vec4 textureColor = texture2D(u_texture, texcoord);
    gl_FragColor = vec4(
        textureColor.x * aBlendFactor + u_color.x * bBlendFactor,
        textureColor.y * aBlendFactor + u_color.y * bBlendFactor,
        textureColor.z * aBlendFactor + u_color.z * bBlendFactor,
        textureColor.w);
}`;

export class TexturedQuadRenderer extends QuadRendererBase
{
    /**
     * @protected
     * @param {WebGLRenderingContextBase} gl 
     * @returns {BufferInfo}
     */
    static getQuadPositionBufferInfo(gl)
    {
        let bufferInfo = this[QUAD_POSITION_BUFFER_INFO];
        if (!bufferInfo)
        {
            bufferInfo = BufferInfo.builder(gl, gl.ARRAY_BUFFER)
                .data(BufferHelper.createBufferSource(
                    gl, gl.FLOAT, [
                        // Top-Left
                        0, 0,
                        1, 0,
                        0, 1,
                        // Bottom-Right
                        1, 1,
                        1, 0,
                        0, 1,
                    ]))
                .build();
            this[QUAD_POSITION_BUFFER_INFO] = bufferInfo;
        }
        return bufferInfo;
    }

    /**
     * @protected
     * @param {WebGLRenderingContextBase} gl 
     * @returns {BufferInfo}
     */
    static getQuadTexcoordBufferInfo(gl)
    {
        let bufferInfo = this[QUAD_TEXCOORD_BUFFER_INFO];
        if (!bufferInfo)
        {
            bufferInfo = BufferInfo.builder(gl, gl.ARRAY_BUFFER)
                .data(BufferHelper.createBufferSource(
                    gl, gl.FLOAT, [
                        // Top-Left
                        0, 0,
                        1, 0,
                        0, 1,
                        // Bottom-Right
                        1, 1,
                        1, 0,
                        0, 1,
                    ]))
                .build();
            this[QUAD_TEXCOORD_BUFFER_INFO] = bufferInfo;
        }
        return bufferInfo;
    }

    /**
     * @protected
     * @param {WebGLRenderingContextBase} gl 
     * @returns {ProgramInfo}
     */
    static getProgramInfo(gl)
    {
        let programInfo = this[PROGRAM_INFO];
        if (!programInfo)
        {
            programInfo = ProgramInfo.builder(gl)
                .shader(gl.VERTEX_SHADER, WEBGL_VERTEX_SHADER_SOURCE)
                .shader(gl.FRAGMENT_SHADER, WEBGL_FRAGMENT_SHADER_SOURCE)
                .link();
            this[PROGRAM_INFO] = programInfo;
        }
        return programInfo;
    }

    static enableTransparencyBlend(gl)
    {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    /**
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl)
    {
        super(gl);

        this._texture = null;
        this._textureSize = vec2.fromValues(1, 1);
        this._spriteVector = vec4.fromValues(0, 0, 1, 1);
        this._colorVector = vec3.fromValues(1, 1, 1);
    }

    setTexture(texture, w, h)
    {
        this._texture = texture;
        vec2.set(this._textureSize, w, h);
        return this;
    }

    setSprite(u = 0, v = 0, s = 1, t = 1)
    {
        vec4.set(this._spriteVector, u, v, s, t);
        return this;
    }

    setColor(r = 1, g = 1, b = 1)
    {
        vec3.set(this._colorVector, r, g, b);
        return this;
    }

    /** @override */
    draw(posX = 0, posY = 0, scaleX = 1, scaleY = 1)
    {
        let gl = this.gl;
        let constructor = /** @type {typeof TexturedQuadRenderer} */ (this.constructor);
        let programInfo = constructor.getProgramInfo(gl);
        let positionBufferInfo = constructor.getQuadPositionBufferInfo(gl);
        let texcoordBufferInfo = constructor.getQuadTexcoordBufferInfo(gl);
        const projection = this.getProjectionMatrix();
        const view = this.getViewMatrix();
        let model = this.updateModelMatrix(posX, posY, scaleX, scaleY);
        let sprite = this._spriteVector;
        let textureSize = this._textureSize;
        let color = this._colorVector;
        if (this._texture)
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
        }
        programInfo.bind(gl)
            .attribute('a_position', gl.FLOAT, positionBufferInfo.handle)
            .attribute('a_texcoord', gl.FLOAT, texcoordBufferInfo.handle)
            .uniform('u_projection', projection)
            .uniform('u_view', view)
            .uniform('u_model', model)
            .uniform('u_texture', 0)
            .uniform('u_sprite', sprite)
            .uniform('u_color', color)
            .uniform('u_texture_size', textureSize)
            .draw(gl, gl.TRIANGLES, 0, 6);
    }
}
