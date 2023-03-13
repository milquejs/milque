import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import { INPUTS } from './Inputs.js';
import { ASSETS } from './Assets.js';

import { Toaster } from './toaster/index.js';
import { FirstPersonCameraController, PerspectiveCamera } from '@milque/scene';

import { BufferInfo, ProgramInfo } from '@milque/mogli';
import { mat4, vec3 } from 'gl-matrix';

import { VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE } from './ShaderBasic.js';
import { createGeometryCylinder } from './geometry/GeometryCylinder.js';
import { SystemManager } from './ecs/SystemManager.js';
import { ComponentClass, EntityManager } from './ecs/EntityManager.js';
import { Geometry } from './geometry/Geometry.js';

window.addEventListener('DOMContentLoaded', main);

async function main() {
    await Toaster.connectInputs(INPUTS);
    await Toaster.preloadAssetPack();
    await Toaster.preloadAssets(ASSETS);

    let m = {
        deltaTime: 0,
        now: 0,
        systemManager: new SystemManager(),
        entityManager: new EntityManager(),
    };
    await Game(m);
}

async function Game(m) {
    const display = Toaster.getDisplayPort();
    const input = Toaster.getInputPort();

    /** @type {EntityManager} */
    const ent = m.entityManager;
    /** @type {SystemManager} */
    const sys = m.systemManager;

    const ab = input.getContext('axisbutton');
    const gl = display.canvas.getContext('webgl2');
    const camera = new PerspectiveCamera();
    const controller = new FirstPersonCameraController();

    display.canvas.addEventListener('click', () => {
        display.focus();
        display.canvas.requestPointerLock();
    });

    const BasicCylinder = createMesh(
        createGeometryCylinder(new Geometry(), 0.5, 1, 10),
        createMaterial([VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE], {
            u_color: [1, 0., 0.5, 1],
            u_model: mat4.create(),
            u_view: camera.viewMatrix,
            u_projection: camera.projectionMatrix,
        })
    );

    let ctx = {};
    display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
        const { deltaTime, now } = e.detail;
        const dt = deltaTime / 60;

        ab.poll(now);
        camera.resize(display.width, display.height);
        updatePlayerInputs(dt, controller);
        controller.apply(camera.viewMatrix);

        let transform = BasicCylinder.uniforms.u_model;
        mat4.rotateX(transform, transform, 0.01);

        drawGame(ctx, gl, display, [BasicCylinder]);
    });
}

function updatePlayerInputs(dt, controller) {
    let forward = INPUTS.MoveForward.value - INPUTS.MoveBackward.value;
    let right = INPUTS.MoveRight.value - INPUTS.MoveLeft.value;
    let up = INPUTS.MoveDown.value - INPUTS.MoveUp.value;
    controller.move(forward, right, up, dt);
    let dx = INPUTS.CursorX.delta;
    let dy = -INPUTS.CursorY.delta;
    controller.look(dx, dy, dt);
}


function createMaterial(shaders, uniforms) {
    return {
        shaders,
        uniforms,
    };
}

function createMesh(geometry, material) {
    return {
        geometry,
        material,
    };
}

async function bakeMesh(gl, mesh) {
    const { geometry, material } = mesh;
    const program = gl.createProgram();
    await ProgramInfo.linkProgramShaders(gl, program, material.shaders);
    const programInfo = ProgramInfo.createProgramInfo(gl, program);
    const uniforms = material.uniforms;
    const bufferInfo = BufferInfo.createVertexArrayInfo(gl, BufferInfo.createBufferInfo(gl, {
        a_position: { buffer: geometry.position },
        a_texcoord: { buffer: geometry.texcoord, size: 2 },
        a_normal: { buffer: geometry.normal },
    }, { buffer: geometry.indices }), [programInfo]);
    return {
        bufferInfo,
        programInfo,
        uniforms,
    };
}

/**
 * @template T
 * @param {object} target 
 * @param {string} name 
 * @param {() => T} initCallback 
 * @returns {T}
 */
function resolve(target, name, initCallback = () => null) {
    if (name in target) {
        return target[name];
    } else {
        let result = initCallback();
        target[name] = result;
        return result;
    }
}

/**
 * @param {object} ctx 
 * @param {WebGLRenderingContextBase} gl 
 * @param {Geometry} geometry 
 * @returns {BufferInfo.BufferInfo}
 */
function resolveBufferInfo(ctx, gl, geometry) {
    let bufferInfos = resolve(ctx, 'bufferInfos', () => new Map());
    if (bufferInfos.has(geometry)) {
        return bufferInfos.get(geometry);
    } else {
        const bufferInfo = BufferInfo.createBufferInfo(gl, {
            a_position: { buffer: geometry.position },
            a_texcoord: { buffer: geometry.texcoord, size: 2 },
            a_normal: { buffer: geometry.normal },
        }, { buffer: geometry.indices });
        bufferInfos.set(geometry, bufferInfo);
        return bufferInfo;
    }
}

/**
 * @param {object} ctx 
 * @param {WebGLRenderingContextBase} gl 
 * @param {Material} material 
 * @returns {ProgramInfo.ProgramInfo}
 */
function resolveProgramInfo(ctx, gl, material) {
    let programInfos = resolve(ctx, 'bufferInfos', () => new Map());
    if (programInfos.has(material)) {
        return programInfos.get(material);
    } else {
        const program = gl.createProgram();
        ProgramInfo.linkProgramShaders(gl, program, material.shaders);
        const programInfo = ProgramInfo.createProgramInfo(gl, program);
        programInfos.set(material, programInfo);
        return programInfo;
    }
}

function resolveMeshDrawInfo(ctx, gl, geometry, material) {
    let bufferInfo = resolveBufferInfo(ctx, gl, geometry);
    let programInfo = resolveProgramInfo(ctx, gl, material);
    return {
        bufferInfo,
        programInfo,
        uniforms: {
            ...material.uniforms,
        },
    };
}

function getDrawInfo(ctx, gl, target) {
    if (!target) {
        return null;
    }
    if (target.geometry && target.material) {
        return resolveMeshDrawInfo(ctx, target.geometry, target.material);
    }
    return null;
}

function drawGame(ctx, gl, display, targets = []) {
    gl.viewport(0, 0, display.width, display.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for(let drawInfo of targets.map(target => getDrawInfo(ctx, gl, target))) {
        if (!drawInfo) {
            continue;
        }
        const { programInfo, bufferInfo, uniforms } = drawInfo;
        gl.useProgram(programInfo.handle);
        ProgramInfo.bindProgramAttributes(gl, programInfo, bufferInfo);
        ProgramInfo.bindProgramUniforms(gl, programInfo, uniforms);
        BufferInfo.drawBufferInfo(gl, bufferInfo);
    }
}
