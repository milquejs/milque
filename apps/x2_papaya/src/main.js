import '@milque/display';
import '@milque/input';

import { mat4 } from 'gl-matrix';
import { TextLoader, OBJLoader, ImageLoader } from '@milque/asset';
import { ProgramInfo } from '@milque/mogli';

import { PerspectiveCamera, FirstPersonCameraController } from '@milque/scene';

import { createMesh } from './mesh.js';
import { enablePointerLockBehavior } from './PointerLockHelper.js';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('#main');
    const input = document.querySelector('#input');
    input.source.autopoll = true;

    enablePointerLockBehavior(display);

    /** @type {WebGLRenderingContext} */
    const gl = display.canvas.getContext('webgl');
    if (!gl) throw new Error('Your browser does not support WebGL.');
    gl.enable(gl.DEPTH_TEST);

    const vertShaderSource = await TextLoader('main.vert');
    const fragShaderSource = await TextLoader('main.frag');
    const cubeObj = await OBJLoader('cube.obj');
    const testImage = await ImageLoader('color.png');

    const program = ProgramInfo.from(gl)
        .shader(gl.VERTEX_SHADER, vertShaderSource)
        .shader(gl.FRAGMENT_SHADER, fragShaderSource)
        .link();
    
    const cubeMesh = createMesh(gl, cubeObj);

    const testTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, testTexture);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, testImage);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const camera = new PerspectiveCamera(display.canvas);
    const controller = new FirstPersonCameraController({ locky: true });

    const PointerX = input.context.getInput('PointerX');
    const PointerY = input.context.getInput('PointerY');
    const PointerDown = input.context.getInput('PointerDown');

    const LOOK_SENSITIVITY = 100;
    const LookX = input.context.getInput('LookX');
    const LookY = input.context.getInput('LookY');

    const MOVE_SENSITIVITY = 0.1;
    const MoveX = input.context.getInput('MoveX');
    const MoveY = input.context.getInput('MoveY');
    const MoveZ = input.context.getInput('MoveZ');

    display.addEventListener('frame', ({ deltaTime }) => {

        // TODO: Seems to halt movement when looking down.
        controller.look(
            LookX.value * LOOK_SENSITIVITY,
            -LookY.value * LOOK_SENSITIVITY);
        controller.move(
            MoveZ.value * MOVE_SENSITIVITY,
            MoveX.value * MOVE_SENSITIVITY,
            MoveY.value * MOVE_SENSITIVITY);
        controller.apply(camera.viewMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, testTexture);
    
        program.bind(gl)
            .attribute('a_position', cubeMesh.position.type, cubeMesh.position.handle)
            .attribute('a_texcoord', cubeMesh.texcoord.type, cubeMesh.texcoord.handle)
            .uniform('u_projection', camera.projectionMatrix)
            .uniform('u_view', camera.viewMatrix)
            .uniform('u_model', mat4.create())
            .uniform('u_color', [1, 0, 0])
            .uniform('u_texture', 0)
            .draw(gl, gl.TRIANGLES, cubeMesh.elementOffset, cubeMesh.elementCount, cubeMesh.element.handle);
    });
}
