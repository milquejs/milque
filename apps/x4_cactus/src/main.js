import { mat4, quat, vec3, vec4 } from 'gl-matrix';
import { OBJLoader, TextLoader } from 'milque';

import * as GLUtil from './gl/index.js';
import * as CameraUtil from './camera/index.js';
import { INPUT_CONTEXT } from './input.js';
import { screenToWorldRay } from './camera/index.js';

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
    const mainCameraController = CameraUtil.createFirstPersonCameraController({ locky: true });
    
    
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

    function createCube(
        x = 0, y = 0, z = 0,
        dx = 1, dy = 1, dz = 1,
        color = vec3.fromValues(Math.random(), Math.random(), Math.random()))
    {
        return {
            transform: mat4.fromRotationTranslationScale(
                mat4.create(),
                quat.create(),
                vec3.fromValues(x, y, z),
                vec3.fromValues(dx, dy, dz)),
            color,
        };
    }

    const s1 = 0.01;
    const s2 = 0.1;
    const s3 = s1 + s2;
    const transformGizmo = {
        transform: mat4.create(),
        xAxis: createCube(s3, 0, 0, s2, s1, s1, vec3.fromValues(1, 0, 0)),
        yAxis: createCube(0, s3, 0, s1, s2, s1, vec3.fromValues(0, 1, 0)),
        zAxis: createCube(0, 0, s3, s1, s1, s2, vec3.fromValues(0, 0, 1)),
        origin: createCube(0, 0, 0, s1, s1, s1, vec3.fromValues(1, 1, 1)),
    };

    let cubes = [
        createCube(-1, -2, -1),
        createCube(1, 2, 1),
    ];

    initialize(game);

    function drawCube(gl, ctx, transform, color)
    {
        ctx.uniform('u_model', transform);
        ctx.uniform('u_color', color);
        ctx.draw(gl, gl.TRIANGLES, 0, elementBufferSource.length, elementBuffer);
    }

    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;
        input.inputSource.poll();
        update(dt, world);
        render(gl, world);

        const eyeX = input.getInputValue('PointerX');
        const eyeY = input.getInputValue('PointerY');
        const lookX = input.getInputValue('PointerMovementX');
        const lookY = input.getInputValue('PointerMovementY');
        const moveX = input.getInputValue('MoveRight') - input.getInputValue('MoveLeft');
        const moveZ = input.getInputValue('MoveUp') - input.getInputValue('MoveDown');

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let program = mainProgram;
        let camera = mainCamera;
        
        const aspectRatio = gl.canvas.width / gl.canvas.height;
        const lookSpeed = 100;
        const moveSpeed = 0.5;
        mainCameraController.look(lookX * lookSpeed * aspectRatio, -lookY * lookSpeed);
        mainCameraController.move(moveZ * moveSpeed, moveX * moveSpeed);
        mainCameraController.apply(camera.viewMatrix);

        let ray = screenToWorldRay(2 * (eyeX - 0.5), 2 * (0.5 - eyeY), camera.projectionMatrix, camera.viewMatrix);
        vec3.add(ray, ray, mainCameraController.position);
        mat4.fromTranslation(transformGizmo.transform, ray);
        
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
                drawCube(gl, ctx, cube.transform, cube.color);
            }

            // Draw Gizmo
            let m = mat4.create();
            mat4.copy(m, transformGizmo.xAxis.transform);
            mat4.multiply(m, transformGizmo.transform, m);
            drawCube(gl, ctx, m, transformGizmo.xAxis.color);

            mat4.copy(m, transformGizmo.yAxis.transform);
            mat4.multiply(m, transformGizmo.transform, m);
            drawCube(gl, ctx, m, transformGizmo.yAxis.color);

            mat4.copy(m, transformGizmo.zAxis.transform);
            mat4.multiply(m, transformGizmo.transform, m);
            drawCube(gl, ctx, m, transformGizmo.zAxis.color);
            
            mat4.copy(m, transformGizmo.origin.transform);
            mat4.multiply(m, transformGizmo.transform, m);
            drawCube(gl, ctx, m, transformGizmo.origin.color);
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
