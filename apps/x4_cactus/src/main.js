import { mat4, quat, vec3 } from 'gl-matrix';
import { OBJLoader, TextLoader } from 'milque';

import * as GLUtil from './gl/index.js';
import * as CameraUtil from './camera/index.js';
import { INPUT_CONTEXT } from './input.js';
import { SceneGraph } from './scene/SceneGraph.js';
import * as TransformUtil from './TransformHelper.js';

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

    const transforms = new Map();
    const sceneGraph = new SceneGraph();

    function createCube(
        x = 0, y = 0, z = 0,
        dx = 1, dy = 1, dz = 1,
        color = vec3.fromValues(Math.random(), Math.random(), Math.random()))
    {
        let sceneNode = sceneGraph.createSceneNode();
        let transform = TransformUtil.createTransform();
        mat4.fromRotationTranslationScale(
            transform.localMatrix,
            quat.create(),
            vec3.fromValues(x, y, z),
            vec3.fromValues(dx, dy, dz));
        transforms.set(sceneNode, transform);
        return {
            sceneNode,
            transform,
            color,
        };
    }

    function createGroup(
        x = 0, y = 0, z = 0,
        dx = 1, dy = 1, dz = 1)
    {
        let sceneNode = sceneGraph.createSceneNode();
        let transform = TransformUtil.createTransform();
        mat4.fromRotationTranslationScale(
            transform.localMatrix,
            quat.create(),
            vec3.fromValues(x, y, z),
            vec3.fromValues(dx, dy, dz));
        transforms.set(sceneNode, transform);
        return {
            sceneNode,
            transform,
        };
    }

    const transformGizmo = createGroup();
    const transformAxes = [];
    {
        const s1 = 0.01;
        const s2 = 0.1;
        const s3 = s1 + s2;
        const xAxis = createCube(s3, 0, 0, s2, s1, s1, vec3.fromValues(1, 0, 0));
        const yAxis = createCube(0, s3, 0, s1, s2, s1, vec3.fromValues(0, 1, 0));
        const zAxis = createCube(0, 0, s3, s1, s1, s2, vec3.fromValues(0, 0, 1));
        const origin = createCube(0, 0, 0, s1, s1, s1, vec3.fromValues(1, 1, 1));
        sceneGraph.parentSceneNode(xAxis.sceneNode, transformGizmo.sceneNode);
        sceneGraph.parentSceneNode(yAxis.sceneNode, transformGizmo.sceneNode);
        sceneGraph.parentSceneNode(zAxis.sceneNode, transformGizmo.sceneNode);
        sceneGraph.parentSceneNode(origin.sceneNode, transformGizmo.sceneNode);
        transformAxes.push(xAxis);
        transformAxes.push(yAxis);
        transformAxes.push(zAxis);
        transformAxes.push(origin);
    }

    const cubes = [
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

        let ray = CameraUtil.screenToWorldRay(2 * (eyeX - 0.5), 2 * (0.5 - eyeY), camera.projectionMatrix, camera.viewMatrix);
        vec3.add(ray, ray, mainCameraController.position);
        mat4.fromTranslation(transformGizmo.transform.localMatrix, ray);
        
        const ctx = program.bind(gl);
        {
            ctx.uniform('u_projection', camera.projectionMatrix);
            ctx.uniform('u_view', camera.viewMatrix);
            ctx.attribute('a_position', positionBuffer, 3);

            // Compute matrices
            sceneGraph.walk((sceneNode, sceneGraph) => {
                let { parent } = sceneGraph.getSceneNodeInfo(sceneNode);
                let transform = transforms.get(sceneNode);
                let parentTransform = parent ? transforms.get(parent) : null;
                TransformUtil.computeTransform(transform, parentTransform);
            });

            // Render the stuff
            for(let cube of cubes)
            {
                drawCube(gl, ctx, cube.transform.worldMatrix, cube.color);
            }
            for(let axis of transformAxes)
            {
                drawCube(gl, ctx, axis.transform.worldMatrix, axis.color);
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
