import { AssetLoader } from './lib.js';
import { Program, ProgramUniforms, ProgramAttributes } from './GLHelper.js';
import * as GLTypeInfo from './GLTypeInfo.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');
    
    const gl = display.canvas.getContext('webgl');
    if (!gl) throw new Error('Your browser does not support webgl.');

    // 1. Create the program.
    const vertexShaderSource = await AssetLoader.loadAsset('text:main.vert');
    const fragmentShaderSource = await AssetLoader.loadAsset('text:main.frag');
    const program = Program(gl)
        .shader(gl.VERTEX_SHADER, vertexShaderSource)
        .shader(gl.FRAGMENT_SHADER, fragmentShaderSource)
        .link();
    const uniforms = ProgramUniforms(gl, program);
    const attributes = ProgramAttributes(gl, program);

    // 2. Prepare the data.
    const positionBuffer = createArrayBuffer(gl, gl.FLOAT, gl.STATIC_DRAW, [
        0, 0,
        0, 0.5,
        0.5, 0,
    ]);

    // Draw it.
    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 3. Use the program.
        gl.useProgram(program);
        {
            uniforms.u_color = [1, 0, 0.5, 1];
            attributes.a_position.useBuffer(gl.ARRAY_BUFFER, gl.FLOAT, positionBuffer.handle, 2);

            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
    });
}

function createArrayBuffer(gl, type, usage, data = [])
{
    const typeInfo = GLTypeInfo.getTypeInfo(gl, type);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new (typeInfo.TypedArray)(data), usage);
    return {
        handle: buffer,
        type,
        target: gl.ARRAY_BUFFER,
    };
}

function createElementArrayBuffer(gl, type, usage, data = [])
{
    const typeInfo = GLTypeInfo.getTypeInfo(gl, type);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new (typeInfo.TypedArray)(data), usage);
    return {
        handle: buffer,
        type,
        target: gl.ELEMENT_ARRAY_BUFFER,
    };
}
