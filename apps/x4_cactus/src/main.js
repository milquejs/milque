import { mat4, quat, vec4 } from 'gl-matrix';
import { OBJLoader, TextLoader, vec3 } from 'milque';

import * as GLUtil from './gl/index.js';
import * as CameraUtil from './camera/index.js';
import { INPUT_CONTEXT } from './input.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = INPUT_CONTEXT;
    /** @type {WebGLRenderingContext} */
    const gl = display.canvas.getContext('webgl');
    if (!gl) throw new Error('Your browser does not support WebGL.');

    gl.enable(gl.DEPTH_TEST);

    const assets = {
        mainVertexShaderSource: await TextLoader.loadText('main.vert'),
        mainFragmentShaderSource: await TextLoader.loadText('main.frag'),
        cubeObj: await OBJLoader.loadOBJ('cube.obj'),
    };

    const mainProgram = GLUtil.createProgramInfo(gl,
        GLUtil.Program(gl)
            .shader(gl.VERTEX_SHADER, assets.mainVertexShaderSource)
            .shader(gl.FRAGMENT_SHADER, assets.mainFragmentShaderSource)
            .link());
    
    const positionBufferSource = GLUtil.createBufferSource(gl, gl.FLOAT, assets.cubeObj.positions);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionBufferSource, gl.STATIC_DRAW);

    const elementBufferSource = GLUtil.createBufferSource(gl, gl.UNSIGNED_SHORT, assets.cubeObj.indices);
    const elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementBufferSource, gl.STATIC_DRAW);

    const mainCamera = CameraUtil.createPerspectiveCamera(gl.canvas);
    mat4.fromRotationTranslation(
        mainCamera.viewMatrix,
        quat.fromEuler(quat.create(), 30, 30, 30),
        vec3.fromValues(0, 0, -10));
    
    const world = {};
    const game = {
        display,
        input,
        gl,
        assets,
        world,
        camera: mainCamera,
        program: mainProgram,
    };

    initialize(game);

    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;
        update(dt, world);
        render(gl, world);

        const cursorX = input.getInputValue('cursorX');
        const cursorY = input.getInputValue('cursorY');

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let program = mainProgram;
        let camera = mainCamera;

        /*
        let target = vec3.create();
        let invProjection = mat4.invert(mat4.create(), camera.projectionMatrix);
        vec3.transformMat4(target, [(cursorX - 0.5) * 2, -(cursorY - 0.5) * 2, 0], invProjection);
        CameraUtil.panTo(camera.viewMatrix, target[0], target[1], 0, 0.1);
        */
        
        program.bind(gl)
            .uniform('u_projection', camera.projectionMatrix)
            .uniform('u_view', camera.viewMatrix)
            .uniform('u_color', vec4.fromValues(1 * cursorX, 1 * cursorY, 0.5, 1))
            .attribute('a_position', positionBuffer, 3)
            .draw(gl, gl.TRIANGLES, 0, elementBufferSource.length, elementBuffer);
    });
}

function initialize(game)
{
}

function update(dt, world)
{
}

function render(gl, world)
{
}
