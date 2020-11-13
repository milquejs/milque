import { mat4, quat, vec3, vec4 } from 'gl-matrix';
import { OBJLoader, TextLoader } from 'milque';

import * as GLUtil from './gl/index.js';
import * as CameraUtil from './camera/index.js';
import { INPUT_CONTEXT } from './input.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = INPUT_CONTEXT;
    display.addEventListener('focus', () => {
        if (document.pointerLockElement !== display)
        {
            display.requestPointerLock();
        }
    });
    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement !== display)
        {
            display.blur();
        }
    });

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
    const mainCameraController = CameraUtil.createFirstPersonCameraController({ xzlock: true });
    
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

    function createCube(x = 0, y = 0, z = 0, dx = 1, dy = 1, dz = 1)
    {
        return {
            transform: mat4.fromRotationTranslationScale(
                mat4.create(),
                quat.create(),
                vec3.fromValues(x, y, z),
                vec3.fromValues(dx, dy, dz)),
            color: vec4.fromValues(Math.random(), Math.random(), Math.random(), 1),
        };
    }

    let cubes = [
        createCube(-1, -1, -1),
        createCube(1, 1, 1),
    ];

    initialize(game);

    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;
        input.inputSource.poll();
        update(dt, world);
        render(gl, world);

        const lookX = input.getInputValue('PointerMovementX');
        const lookY = input.getInputValue('PointerMovementY');
        const moveX = input.getInputValue('MoveRight') - input.getInputValue('MoveLeft');
        const moveZ = input.getInputValue('MoveUp') - input.getInputValue('MoveDown');

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let program = mainProgram;
        let camera = mainCamera;
        
        mainCameraController.look(lookX * 100, -lookY * 60);
        mainCameraController.move(moveZ, moveX);
        mainCameraController.apply(camera.viewMatrix);
        
        /*
        let target = vec3.create();
        let invProjection = mat4.invert(mat4.create(), camera.projectionMatrix);
        vec3.transformMat4(target, [(cursorX - 0.5) * 2, -(cursorY - 0.5) * 2, 0], invProjection);
        CameraUtil.panTo(camera.viewMatrix, target[0], target[1], 0, 0.1);
        */
        const ctx = program.bind(gl);
        {
            ctx.uniform('u_projection', camera.projectionMatrix);
            ctx.uniform('u_view', camera.viewMatrix);
            ctx.attribute('a_position', positionBuffer, 3);
            for(let cube of cubes)
            {
                ctx.uniform('u_model', cube.transform);
                ctx.uniform('u_color', cube.color);
                ctx.draw(gl, gl.TRIANGLES, 0, elementBufferSource.length, elementBuffer);
            }
        }
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
