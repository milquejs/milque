import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import { INPUTS } from './Inputs.js';
import { ASSETS } from './Assets.js';

import { Toaster } from './toaster/index.js';
import { FirstPersonCameraController, PerspectiveCamera } from '@milque/scene';

import { mat4 } from 'gl-matrix';

import { VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE } from './ShaderBasic.js';
import { createGeometryCylinder } from './geometry/GeometryCylinder.js';
import { SystemManager } from './ecs/SystemManager.js';
import { EntityManager } from './ecs/EntityManager.js';
import { Geometry } from './geometry/Geometry.js';
import { createGeometryBox } from './geometry/GeometryBox.js'

import { createMaterial, createMesh, Dobby } from './renderer/dobby/Dobby.js';
import { PlayerSystem } from './PlayerSystem.js';

const BasicMaterial = createMaterial([VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE], {
    u_color: [1, 0, 0.5, 1],
});

const BoxGeometry = createGeometryBox(new Geometry());
const CylinderGeometry = createGeometryCylinder(new Geometry(), 1, 2, 10);

const BasicBoxMesh = createMesh(BoxGeometry, BasicMaterial);
const BasicCylinderMesh = createMesh(CylinderGeometry, BasicMaterial);

export async function main() {
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

    const ab = input.getContext('axisbutton');
    const gl = display.canvas.getContext('webgl2');
    gl.enable(gl.DEPTH_TEST);
    const camera = new PerspectiveCamera();
    const controller = new FirstPersonCameraController();
    const renderer = new Dobby(display);

    display.canvas.addEventListener('click', () => {
        display.focus();
        display.canvas.requestPointerLock();
    });

    const ModelBox = createModel(BasicBoxMesh, {
        u_model: mat4.create(),
        u_color: [1, 0, 0, 1],
    });
    const ModelCylinder = createModel(BasicCylinderMesh, {
        u_model: mat4.create(),
    });

    mat4.translate(ModelBox.uniforms.u_model, ModelBox.uniforms.u_model, [10, 0, 0]);

    // ModelRenderer
    renderer.registerDrawInfo((ctx, gl, target) => {
        if (!target.mesh || !target.uniforms) {
            return null;
        } else {
            return {
                material: target.mesh.material,
                geometry: target.mesh.geometry,
                uniforms: target.uniforms,
            };
        }
    });

    const drawTargets = [
        ModelBox,
        ModelCylinder,
    ];

    display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
        const { deltaTime, now } = e.detail;
        const dt = deltaTime / 60;

        ab.poll(now);
        camera.resize(display.width, display.height);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        PlayerSystem(dt, camera, controller);

        let transform = ModelCylinder.uniforms.u_model;
        mat4.rotateX(transform, transform, 0.01);

        renderer.render(gl, drawTargets, {
            u_view: camera.viewMatrix,
            u_projection: camera.projectionMatrix,
        });
    });
}

function createModel(mesh, uniforms) {
    return {
        mesh,
        uniforms,
    };
}
