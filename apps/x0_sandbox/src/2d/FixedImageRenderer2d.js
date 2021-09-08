import { ProgramHelper, BufferHelper } from '@milque/mogli';
import { mat4, vec3 } from 'gl-matrix';
import { TransformStack } from './TransformStack.js';

const VERTEX_SHADER_SOURCE = `#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;
uniform mat4 u_texmatrix;

out vec2 v_texcoord;

void main() {
    gl_Position = u_matrix * a_position;
    v_texcoord = (u_texmatrix * vec4(a_texcoord, 0, 1)).xy;
}
`;
const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 fragColor;

void main() {
    fragColor = texture(u_texture, v_texcoord);
}
`;

const QUAD_VERTICES = [
    // Top-Left
    0, 0,
    1, 0,
    0, 1,
    // Bottom-Right
    1, 1,
    1, 0,
    0, 1,
];
const QUAD_VERTEX_OFFSET = 0;
const QUAD_VERTEX_SIZE = 2;
const QUAD_VERTEX_COUNT = QUAD_VERTICES.length / QUAD_VERTEX_SIZE;

export class FixedImageRenderer2d
{
    /**
     * @param {WebGLRenderingContextBase} gl 
     */
    constructor(gl)
    {
        this.gl = gl;
        let vs = ProgramHelper.createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        let fs = ProgramHelper.createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        this.program = ProgramHelper.createShaderProgram(gl, gl.createProgram(), [vs, fs]);
        this.a_position = gl.getAttribLocation(this.program, 'a_position');
        this.a_texcoord = gl.getAttribLocation(this.program, 'a_texcoord');
        this.u_texture = gl.getUniformLocation(this.program, 'u_texture');
        this.u_matrix = gl.getUniformLocation(this.program, 'u_matrix');
        this.u_texmatrix = gl.getUniformLocation(this.program, 'u_texmatrix');
        this.matrix = mat4.create();
        this.vector = vec3.create();

        this.transform = new TransformStack();

        this.vao = gl.createVertexArray();

        let positionSource = BufferHelper.createBufferSource(gl, gl.FLOAT, QUAD_VERTICES);
        this.positionBuffer = BufferHelper.createBuffer(gl, gl.ARRAY_BUFFER, positionSource, gl.STATIC_DRAW);
        let texcoordSource = BufferHelper.createBufferSource(gl, gl.FLOAT, QUAD_VERTICES);
        this.texcoordBuffer = BufferHelper.createBuffer(gl, gl.ARRAY_BUFFER, texcoordSource, gl.STATIC_DRAW);

        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.a_position);
        gl.vertexAttribPointer(this.a_position, QUAD_VERTEX_SIZE, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        gl.enableVertexAttribArray(this.a_texcoord);
        gl.vertexAttribPointer(this.a_texcoord, QUAD_VERTEX_SIZE, gl.FLOAT, false, 0, 0);
    }

    /**
     * @param {ImageData} imageData 
     * @returns 
     */
    createTextureInfo(imageData)
    {
        const gl = this.gl;
        let handle = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, handle);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
        gl.generateMipmap(gl.TEXTURE_2D);
        let width = imageData.width;
        let height = imageData.height;
        return {
            handle,
            width,
            height,
        };
    }

    drawFullImage(texture, textureWidth, textureHeight, dstX = 0, dstY = 0, dstW = textureWidth, dstH = textureHeight)
    {
        this.drawImage(texture, textureWidth, textureHeight, 0, 0, textureWidth, textureHeight, dstX, dstY, dstW, dstH);
    }

    drawImage(texture, textureWidth, textureHeight,
        srcX = 0, srcY = 0, srcW = textureWidth, srcH = textureHeight,
        dstX = 0, dstY = 0, dstW = srcW, dstH = srcH)
    {
        const gl = this.gl;
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);

        let textureUnit = 0;
        gl.uniform1i(this.u_texture, textureUnit);
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        let vec = this.vector;
        let mat = this.matrix;

        mat4.ortho(mat, 0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
        mat4.mul(mat, mat, this.transform.getTransformMatrix());
        mat4.translate(mat, mat, vec3.set(vec, dstX, dstY, 0));
        mat4.scale(mat, mat, vec3.set(vec, dstW, dstH, 1));
        gl.uniformMatrix4fv(this.u_matrix, false, mat);

        mat4.fromTranslation(mat, vec3.set(vec, srcX / textureWidth, srcY / textureHeight));
        mat4.scale(mat, mat, vec3.set(vec, srcW / textureWidth, srcH / textureHeight));
        gl.uniformMatrix4fv(this.u_texmatrix, false, mat);

        gl.drawArrays(gl.TRIANGLES, QUAD_VERTEX_OFFSET, QUAD_VERTEX_COUNT);
    }
}
