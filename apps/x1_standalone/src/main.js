import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import { INPUTS } from './Inputs.js';
import { ASSETS } from './Assets.js';

import { Toaster } from './toaster/index.js';
import { FirstPersonCameraController, PerspectiveCamera } from '@milque/scene';

import { BufferInfoHelper, ProgramInfoHelper } from '@milque/mogli';
import { bakeGeometry } from './geometry/Geometry.js';
import { mat4, quat, vec3 } from 'gl-matrix';

import { VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE } from './ShaderBasic.js';
import { createGeometryBox } from './geometry/GeometryBox.js';
import { createGeometryCylinder } from './geometry/GeometryCylinder.js';
import { SceneNode } from './scene/SceneNode.js';

window.addEventListener('DOMContentLoaded', main);

async function main() {
    await Toaster.connectInputs(INPUTS);
    await Toaster.preloadAssetPack();
    await Toaster.preloadAssets(ASSETS);

    let m = {};
    await Game(m);
}

/** Scene graphs */
// For easy management of objects
// Scene (load, unload, etc) -> System (modular logic)

async function Game(m) {
    const display = Toaster.getDisplayPort();
    if (!display) return;
    const input = Toaster.getInputPort();
    if (!input) return;

    const ab = input.getContext('axisbutton');
    const gl = display.canvas.getContext('webgl2');
    const camera = new PerspectiveCamera();
    const controller = new FirstPersonCameraController();
    const scene = new SceneTransform();
    mat4.translate(camera.viewMatrix, camera.viewMatrix, vec3.fromValues(0, 0, -10));

    display.canvas.addEventListener('click', () => {
        display.focus();
        display.canvas.requestPointerLock();
    });

    const shaders = [VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE];
    const program = gl.createProgram();
    await ProgramInfoHelper.linkProgramShaders(gl, program, shaders);
    const programInfo = ProgramInfoHelper.getProgramInfo(gl, program);
    let geom = bakeGeometry(createGeometryCylinder(0.5, 1, 10));
    const bufferInfo = BufferInfoHelper.createBufferInfo(gl, {
        a_position: {
            buffer: geom.position,
            size: 3,
        },
        a_texcoord: {
            buffer: geom.texcoord,
            size: 2,
        },
        a_normal: {
            buffer: geom.normal,
            size: 3,
        },
    }, { buffer: geom.indices });
    const vaoInfo = BufferInfoHelper.createVertexArrayInfo(gl, bufferInfo, [programInfo]);
    const transform = mat4.create();

    display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
        const { deltaTime, now } = e.detail;
        const dt = deltaTime / 60;

        ab.poll(now);
        gl.viewport(0, 0, display.width, display.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // renderer.render(sceneGraph, camera);

        camera.resize(display.width, display.height);

        let forward = INPUTS.MoveForward.value - INPUTS.MoveBackward.value;
        let right = INPUTS.MoveRight.value - INPUTS.MoveLeft.value;
        let up = INPUTS.MoveDown.value - INPUTS.MoveUp.value;
        controller.move(forward, right, up, dt);
        let dx = INPUTS.CursorX.delta;
        let dy = -INPUTS.CursorY.delta;
        controller.look(dx, dy, dt);

        controller.apply(camera.viewMatrix);
        mat4.rotateX(transform, transform, 0.01);

        gl.useProgram(programInfo.handle);
        ProgramInfoHelper.bindProgramAttributes(gl, programInfo, vaoInfo);
        ProgramInfoHelper.bindProgramUniforms(gl, programInfo, {
            u_color: [1, 0, 0.5, 1],
            u_model: transform,
            u_view: camera.viewMatrix,
            u_projection: camera.projectionMatrix,
        });
        BufferInfoHelper.drawBufferInfo(gl, bufferInfo);
    });
}

export class SceneTransform extends SceneNode {
    constructor() {
        super();
        this.offset = vec3.create();
        this.scale = vec3.create();
        this.rotation = quat.create();
    }
}
