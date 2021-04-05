import { mat4, vec3, vec4 } from 'gl-matrix';
import { ProgramInfo, BufferInfo, BufferHelper } from '@milque/mogli';

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
uniform vec4 u_sprite;
uniform vec4 u_color;

void main()
{
    if (u_sprite.w > 0.0)
    {
        float colorBlendFactor = u_color.a / 2.0;
        float texBlendFactor = 1.0 - colorBlendFactor;
        vec2 texcoord = vec2(
            u_sprite.x + v_texcoord.x * u_sprite.z,
            u_sprite.y + v_texcoord.y * u_sprite.w);
        vec4 textureColor = texture2D(u_texture, texcoord);

        // Force on/off transparency
        if (textureColor.w < 1.0)
        {
            discard;
        }

        gl_FragColor = vec4(
            textureColor.x * texBlendFactor + u_color.x * colorBlendFactor,
            textureColor.y * texBlendFactor + u_color.y * colorBlendFactor,
            textureColor.z * texBlendFactor + u_color.z * colorBlendFactor,
            textureColor.w);
    }
    else
    {
        gl_FragColor = u_color;
    }
}`;

const QUAD_SYMBOL = Symbol('quad');
const WIREFRAME_SYMBOL = Symbol('wireframe');

export class QuadRenderer
{
    static setQuad(gl, opts = undefined)
    {
        let program = opts ? opts.program : null;
        let buffer = opts ? opts.buffer : null;

        if (!program)
        {
            program = ProgramInfo.builder(gl)
                .shader(gl.VERTEX_SHADER, WEBGL_VERTEX_SHADER_SOURCE)
                .shader(gl.FRAGMENT_SHADER, WEBGL_FRAGMENT_SHADER_SOURCE)
                .link();
        }

        if (!buffer)
        {
            buffer = BufferInfo.builder(gl, gl.ARRAY_BUFFER)
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
        }

        let quad = {
            program,
            buffer,
        };
        this[QUAD_SYMBOL] = quad;
        return quad;
    }

    static getQuad(gl)
    {
        return this[QUAD_SYMBOL] || this.setQuad(gl);
    }

    static setClearColor(gl, colorHex, alphaFloat = 1.0)
    {
        let r = ((colorHex >> 16) & 0xFF) / 255.0;
        let g = ((colorHex >> 8) & 0xFF) / 255.0;
        let b = ((colorHex >> 0) & 0xFF) / 255.0;
        gl.clearColor(r, g, b, alphaFloat);
        return this;
    }

    static enableDepthTest(gl)
    {
        gl.enable(gl.DEPTH_TEST);
        return this;
    }

    static toggleWireframe(force = !this[WIREFRAME_SYMBOL])
    {
        this[WIREFRAME_SYMBOL] = Boolean(force);
        return this;
    }

    /**
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl)
    {
        /** @protected */
        this.gl = gl;

        /** @private */
        this._projectionMatrix = mat4.create();
        /** @private */
        this._viewMatrix = mat4.create();
        /** @private */
        this._modelMatrix = mat4.create();
        /** @private */
        this._colorVector = vec4.create();
        /** @private */
        this._spriteVector = vec4.create();

        /** @private */
        this._texture = null;
        /** @private */
        this._textureWidth = 0;
        /** @private */
        this._textureHeight = 0;

        /** @private */
        this._matrix = mat4.create();
        /** @private */
        this._vector = vec4.create();
    }
    
    get projectionMatrix()
    {
        return this._projectionMatrix;
    }

    get viewMatrix()
    {
        return this._viewMatrix;
    }

    get modelMatrix()
    {
        return this._modelMatrix;
    }

    get colorVector()
    {
        return this._colorVector;
    }

    get spriteVector()
    {
        return this._spriteVector;
    }

    setProjectionMatrix(matrix)
    {
        mat4.copy(this._projectionMatrix, matrix);
        return this;
    }

    getProjectionMatrix(out)
    {
        mat4.copy(out, this._projectionMatrix);
        return out;
    }

    setViewMatrix(matrix)
    {
        mat4.copy(this._viewMatrix, matrix);
        return this;
    }

    getViewMatrix(out)
    {
        mat4.copy(out, this._viewMatrix);
        return out;
    }

    setModelMatrix(matrix)
    {
        mat4.copy(this._modelMatrix, matrix);
        return this;
    }

    getModelMatrix(out)
    {
        mat4.copy(out, this._modelMatrix);
        return out;
    }

    setColorVector(r, g, b, a = 1.0)
    {
        vec4.set(this._colorVector, r, g, b, a);
        return this;
    }

    getColorVector(out)
    {
        vec4.copy(out, this._colorVector);
        return out;
    }

    setColorHex(hex, alpha = 1.0)
    {
        let r = ((hex >> 16) & 0xFF) / 255.0;
        let g = ((hex >> 8) & 0xFF) / 255.0;
        let b = ((hex >> 0) & 0xFF) / 255.0;
        let out = this._colorVector;
        out[0] = r;
        out[1] = g;
        out[2] = b;
        out[3] = alpha;
        return this;
    }

    getColorHex()
    {
        let v = this._colorVector;
        let r = Math.trunc(v[0] * 255) & 0xFF;
        let g = Math.trunc(v[1] * 255) & 0xFF;
        let b = Math.trunc(v[2] * 255) & 0xFF;
        return (r << 16) | (g << 8) | b;
    }

    setColorAlpha(alpha)
    {
        this._colorVector[3] = alpha;
        return this;
    }

    getColorAlpha()
    {
        return this._colorVector[3];
    }

    setTexture(texture, textureWidth, textureHeight)
    {
        this._texture = texture;
        this._textureWidth = textureWidth;
        this._textureHeight = textureHeight;
        return this;
    }

    getTexture()
    {
        return this._texture;
    }

    getTextureWidth()
    {
        return this._textureWidth;
    }

    getTextureHeight()
    {
        return this._textureHeight;
    }

    setSpriteVector(u, v, s, t)
    {
        vec4.set(this._spriteVector, u, v, s, t);
        return this;
    }

    getSpriteVector(out)
    {
        vec4.copy(out, this._spriteVector);
        return out;
    }

    drawColoredQuad(colorHex = 0xFF00FF, x = 0, y = 0, z = 0, width = 16, height = 16)
    {
        let prevSprite = vec3.copy(this._vector, this._spriteVector);
        let prevColor = this.getColorHex();
        let prevAlpha = this.getColorAlpha();
        let prevTexture = this.getTexture();
        let prevTextureWidth = this.getTextureWidth();
        let prevTextureHeight = this.getTextureHeight();

        this.setTexture(null, 0, 0);
        this.setSpriteVector(0, 0, 0, 0);
        this.setColorHex(colorHex, 1.0);
        {
            this.drawQuad(x, y, z, width, height);
        }
        this.setColorHex(prevColor, prevAlpha);
        this.setSpriteVector(prevSprite);
        this.setTexture(prevTexture, prevTextureWidth, prevTextureHeight);
    }

    drawQuad(x = 0, y = 0, z = 0, scaleX = 1, scaleY = scaleX)
    {
        let gl = this.gl;
        let constructor = /** @type {typeof QuadRenderer} */ (this.constructor);
        let { program, buffer } = constructor.getQuad(gl);

        const projectionMatrix = this._projectionMatrix;
        const viewMatrix = this._viewMatrix;
        const modelMatrix = this._modelMatrix;
        const colorVector = this._colorVector;
        const spriteVector = this._spriteVector;
        const textureHandle = this._texture;
        const textureWidth = this._textureWidth;
        const textureHeight = this._textureHeight;
        const spriteWidth = spriteVector[2];
        const spriteHeight = spriteVector[3];

        const usingTexture = textureWidth > 0 && textureHeight > 0;
        const usingSprite = spriteWidth > 0 && spriteHeight > 0;
        
        let [ aspectWidth, aspectHeight ] = usingTexture
            ? usingSprite
                ? [ spriteWidth, spriteHeight ]
                : [ textureWidth, textureHeight ]
            : [ 1, 1 ];
        
        let v = this._vector;
        let m = this._matrix;

        // Update transformation matrix
        mat4.copy(m, modelMatrix);
        v[0] = x;
        v[1] = y;
        v[2] = z;
        mat4.translate(m, m, v);
        v[0] = scaleX * aspectWidth;
        v[1] = scaleY * aspectHeight;
        v[2] = 1;
        mat4.scale(m, m, v);
        v[0] = -0.5;
        v[1] = -0.5;
        v[2] = 0;
        mat4.translate(m, m, v);

        // Update sprite coordinates
        if (usingTexture)
        {
            if (usingSprite)
            {
                vec4.copy(v, spriteVector);
                v[0] /= textureWidth;
                v[1] /= textureHeight;
                v[2] /= textureWidth;
                v[3] /= textureHeight;
            }
            else
            {
                vec4.set(v, 0, 0, 1, 1);
            }

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textureHandle);
        }
        else
        {
            vec4.zero(v);
        }

        // Draw with program
        let ctx = program.bind(gl)
            .attribute('a_position', gl.FLOAT, buffer.handle)
            .attribute('a_texcoord', gl.FLOAT, buffer.handle)
            .uniform('u_projection', projectionMatrix)
            .uniform('u_view', viewMatrix)
            .uniform('u_model', m)
            .uniform('u_color', colorVector)
            .uniform('u_sprite', v)
            .uniform('u_texture', 0);
        ctx.draw(gl, gl.TRIANGLES, 0, 6);

        // Draw wireframe
        if (this.constructor[WIREFRAME_SYMBOL])
        {
            v[0] = 0;
            v[1] = 1;
            v[2] = 0;
            v[3] = 1;
            ctx.uniform('u_color', v);
            v[0] = 0;
            v[1] = 0;
            v[2] = 0;
            v[3] = 0;
            ctx.uniform('u_sprite', v);
            ctx.draw(gl, gl.LINE_LOOP, 0, 6);
        }
    }
}
