import '@milque/display';
import '@milque/input';
import { mat4 } from 'gl-matrix';

import { TextLoader } from './asset/TextLoader.js';
import { OBJLoader } from './asset/OBJLoader.js';

import { ProgramInfo } from './gl/info/ProgramInfo.js';

import { BufferBuilder } from './gl/buffer/BufferBuilder.js';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('#main');
    const input = document.querySelector('#input');

    /** @type {WebGLRenderingContext} */
    const gl = display.canvas.getContext('webgl');
    if (!gl) throw new Error('Your browser does not support WebGL.');
    gl.enable(gl.DEPTH_TEST);

    const assets = {};

    const vertexSource = await TextLoader('test.vert');
    const fragmentSource = await TextLoader('test.frag');
    const programInfo = ProgramInfo.from(gl)
        .shader(gl.VERTEX_SHADER, vertexSource)
        .shader(gl.FRAGMENT_SHADER, fragmentSource)
        .link();
    assets.mainShaderProgramInfo = programInfo;

    const testObj = await OBJLoader('test.obj');
    const positionBuffer = BufferBuilder.from(gl, gl.ARRAY_BUFFER)
        .data(testObj.positions)
        .build();
    const texcoordBuffer = BufferBuilder.from(gl, gl.ARRAY_BUFFER)
        .data(testObj.texcoords)
        .build();
    const normalBuffer = BufferBuilder.from(gl, gl.ARRAY_BUFFER)
        .data(testObj.normals)
        .build();
    const elementBuffer = BufferBuilder.from(gl, gl.ELEMENT_ARRAY_BUFFER)
        .data(testObj.indices)
        .build();

    display.addEventListener('frame', ({ deltaTime }) => {
        input.source.poll();

        const PointerX = input.context.getInputValue('PointerX');
        const PointerY = input.context.getInputValue('PointerY');
        const PointerDown = input.context.getInputValue('PointerDown');

        programInfo.bind(gl)
            .attribute('a_position', gl.FLOAT, positionBuffer, 3)
            .uniform('u_color', [1, 0, 0])
            .draw(gl, gl.TRIANGLES, 0, testObj.indices.length, elementBuffer);
    });
}
