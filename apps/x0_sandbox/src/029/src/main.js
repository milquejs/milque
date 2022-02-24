import { mat4, quat, vec3 } from 'gl-matrix';

import '@milque/display';
import '@milque/input';
import {
    screenToWorldRay,
    PerspectiveCamera,
    FirstPersonCameraController
} from '@milque/scene';
import {
    ProgramInfo
} from '@milque/mogli';

import { enablePointerLockBehavior } from './PointerLockHelper.js';

import * as AABBUtil from './aabb/index.js';
import { ASSET_CONTEXT } from './asset.js';
import { SceneGraph } from './scene/SceneGraph.js';
import * as TransformUtil from './TransformHelper.js';
import { CubeRenderer } from './CubeRenderer.js';
import { QuadRenderer } from './QuadRenderer.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    // TODO: Should print the key code of any key somewhere, so we know what to use.
    // NOTE: https://keycode.info/
    const input = document.querySelector('input-context');
    enablePointerLockBehavior(display);

    /** @type {WebGLRenderingContext} */
    const gl = display.canvas.getContext('webgl');
    if (!gl) throw new Error('Your browser does not support WebGL.');

    gl.enable(gl.DEPTH_TEST);

    const assets = await ASSET_CONTEXT.load();

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, assets.gradientClay);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.activeTexture(gl.TEXTURE0);

    const mainProgram = ProgramInfo.from(gl)
        .shader(gl.VERTEX_SHADER, assets.mainVertexShaderSource)
        .shader(gl.FRAGMENT_SHADER, assets.mainFragmentShaderSource)
        .link();

    const cubeRenderer = new CubeRenderer(gl, mainProgram, assets.cubeObj);
    const quadRenderer = new QuadRenderer(gl, mainProgram, assets.quadObj);

    const boxes = [];
    boxes.push(AABBUtil.createAxisAlignedBoundingBox(-1, -1, 1, 1));
    
    // const collisions = AABBUtil.solveCollisions(boxes, []);

    const mainCamera = new PerspectiveCamera(gl.canvas);
    const mainCameraController = new FirstPersonCameraController({ locky: true });
    mainCameraController.move(-15, 0, 5);
    mainCameraController.look(0, -20);

    const transforms = new Map();
    const sceneGraph = new SceneGraph();

    function createGameObject(
        x=0, y=0, z=0,
        dx=1, dy=1, dz=1,
        rx=0, ry=0, rz=0,
        color=vec3.fromValues(Math.random(), Math.random(), Math.random()),
        opts={})
    {
        let sceneNode = sceneGraph.createSceneNode();
        let transform = TransformUtil.createTransform();
        mat4.fromRotationTranslationScale(
            transform.localMatrix,
            quat.fromEuler(quat.create(), rx, ry, rz),
            vec3.fromValues(x, y, z),
            vec3.fromValues(dx, dy, dz));
        transforms.set(sceneNode, transform);
        return {
            sceneNode,
            transform,
            color,
            ...opts,
        };
    }

    const transformGizmo = createGameObject();
    const transformAxes = (() => {
        const s1 = 0.01;
        const s2 = 0.1;
        const s3 = s1 + s2;
        const xAxis = createGameObject(s3, 0, 0, s2, s1, s1, 0, 0, 0, vec3.fromValues(1, 0, 0));
        const yAxis = createGameObject(0, s3, 0, s1, s2, s1, 0, 0, 0, vec3.fromValues(0, 1, 0));
        const zAxis = createGameObject(0, 0, s3, s1, s1, s2, 0, 0, 0, vec3.fromValues(0, 0, 1));
        const origin = createGameObject(0, 0, 0, s1, s1, s1, 0, 0, 0, vec3.fromValues(1, 1, 1));
        sceneGraph.parentSceneNode(xAxis.sceneNode, transformGizmo.sceneNode);
        sceneGraph.parentSceneNode(yAxis.sceneNode, transformGizmo.sceneNode);
        sceneGraph.parentSceneNode(zAxis.sceneNode, transformGizmo.sceneNode);
        sceneGraph.parentSceneNode(origin.sceneNode, transformGizmo.sceneNode);
        return {
            xAxis,
            yAxis,
            zAxis,
            origin,
        };
    })();

    const cactus = createGameObject();
    const cactusParts = (() => {
        const lipRadius = 1.05;
        const potRadius = 0.8;
        const dirtRadius = 0.7;
        let potBody = createGameObject(0, -2.5, 0, potRadius, 0.5, potRadius);
        let potLip = createGameObject(0, -2, 0, lipRadius, 0.2, lipRadius);
        let plantBody = createGameObject(0, -1, 0, 0.6, 1, 0.6);

        let potDirt = createGameObject(0, -1.8, 0, dirtRadius, 0.2, dirtRadius);
        
        const armY = 0.3;

        let plantHead = createGameObject(0, 0.15, 0, 0.6, 0.2, 0.6, -5);
        let plantHeadFlap = createGameObject(0, 0.05, 0, 1, 0.1, 1, -5);

        let plantRightEye = createGameObject(-0.3, -0.3, 0.6, 0.1, 0.1, 0.1);
        let plantLeftEye = createGameObject(0.3, -0.3, 0.6, 0.1, 0.1, 0.1);

        let plantRightArm = createGameObject(-0.9, -1 + armY, 0, 0.2, 0.3, 0.2, 0, 0, 90);
        let plantRightUpArm = createGameObject(-1, -0.7 + armY, 0, 0.2, 0.1, 0.2, 0, 0, 0);
        plantRightUpArm.color = plantRightArm.color;

        let plantLeftArm = createGameObject(0.9, -1.3 + armY, 0, 0.2, 0.3, 0.2, 0, 0, 90);
        let plantLeftUpArm = createGameObject(1, -1 + armY, 0, 0.2, 0.1, 0.2, 0, 0, 0);
        plantLeftUpArm.color = plantLeftArm.color;

        sceneGraph.parentSceneNode(potLip.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(potBody.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(potDirt.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(plantHead.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(plantHeadFlap.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(plantRightEye.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(plantLeftEye.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(plantBody.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(plantRightArm.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(plantRightUpArm.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(plantLeftArm.sceneNode, cactus.sceneNode);
        sceneGraph.parentSceneNode(plantLeftUpArm.sceneNode, cactus.sceneNode);
        return {
            potLip,
            potBody,
            potDirt,
            plantHead,
            plantHeadFlap,
            plantRightEye,
            plantLeftEye,
            plantBody,
            plantRightArm,
            plantRightUpArm,
            plantLeftArm,
            plantLeftUpArm,
        };
    })();

    const cubes = [
        //...Object.values(transformAxes),
        //...Object.values(cactusParts),
        createGameObject(0, 0, 0, 1, 1, 1),
        createGameObject(4, 0, 0, 1, 0.5, 1),
        createGameObject(-4, 0, 0, 2, 4, 2, 45),
    ];

    const quads = [
        createGameObject(0, -4, 0, 2, 2, 2),
        // createGameObject(0, 7, -10, 10, 1, 10, 90, 0, 0),
        // createGameObject(-10, 7, 0, 10, 1, 10, 0, 0, 90),
        // createGameObject(10, 7, 0, 10, 1, 10, 0, 0, 90),
    ];

    let z = 0;

    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;
        input.source.poll();

        const eyeX = input.context.getInputValue('PointerX');
        const eyeY = input.context.getInputValue('PointerY');
        const lookX = input.context.getInputValue('PointerMovementX');
        const lookY = input.context.getInputValue('PointerMovementY');
        const lookZ = input.context.getInputValue('PointerMovementZ');
        const moveX = input.context.getInputValue('MoveRight') - input.context.getInputValue('MoveLeft');
        const moveZ = input.context.getInputValue('MoveUp') - input.context.getInputValue('MoveDown');

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let camera = mainCamera;
        const aspectRatio = gl.canvas.width / gl.canvas.height;
        const lookSpeed = 100;
        mainCameraController.look(lookX * lookSpeed * aspectRatio, -lookY * lookSpeed);
        
        const moveSpeed = 0.5;
        mainCameraController.move(moveZ * moveSpeed, moveX * moveSpeed);
        mainCameraController.apply(camera.viewMatrix);

        //const moveSpeed = 0.3;
        //mat4.translate(cactus.transform.localMatrix, cactus.transform.localMatrix, vec3.fromValues(moveX * moveSpeed, 0, -moveZ * moveSpeed));

        z += (lookZ / 1000);

        let ray = screenToWorldRay(2 * (eyeX - 0.5), 2 * (0.5 - eyeY), camera.projectionMatrix, camera.viewMatrix);
        vec3.scaleAndAdd(ray, mainCameraController.position, ray, 1 - z);
        mat4.fromTranslation(transformGizmo.transform.localMatrix, ray);
        
        // Compute matrices
        sceneGraph.walk((sceneNode, sceneGraph) => {
            let { parent } = sceneGraph.getSceneNodeInfo(sceneNode);
            let transform = transforms.get(sceneNode);
            let parentTransform = parent ? transforms.get(parent) : null;
            TransformUtil.computeTransform(transform, parentTransform);
        });

        let ctx;

        ctx = cubeRenderer.begin(gl, camera.projectionMatrix, camera.viewMatrix);
        {
            ctx.ctx.uniform('u_texture', 0);
            for(let cube of cubes)
            {
                ctx.ctx.uniform('u_local', cube.transform.localMatrix);
                ctx.render(gl, cube.transform.worldMatrix, cube.color);
            }
        }
        ctx.end(gl);

        ctx = quadRenderer.begin(gl, camera.projectionMatrix, camera.viewMatrix);
        {
            ctx.ctx.uniform('u_texture', 0);
            for(let quad of quads)
            {
                ctx.ctx.uniform('u_local', quad.transform.localMatrix);
                ctx.render(gl, quad.transform.worldMatrix, quad.color);
            }
        }
        ctx.end(gl);
    });
}
