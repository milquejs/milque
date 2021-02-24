import { mat4, quat, vec3 } from 'gl-matrix';
import { TextLoader, OBJLoader, ImageLoader } from '@milque/asset';
import { ProgramInfo } from '@milque/mogli';

import { PerspectiveCamera, FirstPersonCameraController } from '@milque/scene';

import { createMesh } from './mesh.js';
import { enablePointerLockBehavior } from './PointerLockHelper.js';

export async function main()
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
    const testImage = await ImageLoader('people/hairguy.png');

    const program = ProgramInfo.from(gl)
        .shader(gl.VERTEX_SHADER, vertShaderSource)
        .shader(gl.FRAGMENT_SHADER, fragShaderSource)
        .link();
    
    const cubeMesh = createMesh(gl, cubeObj);
    const cubes = {
        [Symbol.iterator]() { return this.instances[Symbol.iterator](); },
        instances: [],
        create(fromX = 0, fromY = 0, fromZ = 0, toX = fromX + 1, toY = fromY + 1, toZ = fromZ + 1)
        {
            let x1 = fromX;
            let y1 = fromY;
            let z1 = fromZ;
            let x2 = toX;
            let y2 = toY;
            let z2 = toZ;
            if (x1 > x2) { x1 = toX; x2 = fromX; }
            if (y1 > y2) { y1 = toY; y2 = fromY; }
            if (z1 > z2) { z1 = toZ; z2 = fromZ; }
            
            let dx = (x2 - x1) / 2;
            let dy = (y2 - y1) / 2;
            let dz = (z2 - z1) / 2;
            let x = x1 + dx;
            let y = y1 + dy;
            let z = z1 + dz;

            let transform = mat4.create();
            mat4.fromRotationTranslationScale(
                transform,
                quat.create(),
                vec3.fromValues(x, y, z),
                vec3.fromValues(dx, dy, dz));

            let result = {
                transform,
                color: vec3.fromValues(1 * Math.random(), 1 * Math.random(), 1 * Math.random()),
            };

            this.instances.push(result);
            return result;
        }
    };

    cubes.create();
    cubes.create(2, 1);
    cubes.create(-10, -1, -10, 10, -2, 10);

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
        controller.look(
            LookX.value * LOOK_SENSITIVITY,
            -LookY.value * LOOK_SENSITIVITY);
        controller.move(
            MoveZ.value * MOVE_SENSITIVITY,
            MoveX.value * MOVE_SENSITIVITY,
            MoveY.value * MOVE_SENSITIVITY);
        controller.apply(camera.viewMatrix);

        if (PointerDown.value)
        {
            cubes.instances[0].color[0] = Math.random();
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, testTexture);

        let ctx = program.bind(gl)
            .uniform('u_projection', camera.projectionMatrix)
            .uniform('u_view', camera.viewMatrix);
        for(let cube of cubes)
        {
            ctx
                .attribute('a_position', cubeMesh.position.type, cubeMesh.position.handle)
                .attribute('a_texcoord', cubeMesh.texcoord.type, cubeMesh.texcoord.handle)
                .uniform('u_model', cube.transform)
                .uniform('u_color', cube.color)
                .uniform('u_texture', 0)
                .draw(gl, gl.TRIANGLES, cubeMesh.elementOffset, cubeMesh.elementCount, cubeMesh.element.handle);
        }
    });
}
