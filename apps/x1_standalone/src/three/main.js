import * as THREE from 'three';
import * as INPUTS from './inputs.js';

import { createCar } from './Car.js';
import { createScene } from './MainScene.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputPort} InputPort
 */

export async function main() {
    /** @type {DisplayPort} */
    const display = document.querySelector('display-port');
    /** @type {InputPort} */
    const inputs = document.querySelector('input-port');
    const axb = inputs.getContext('axisbutton');
    axb.bindBindings(INPUTS);

    const scene = createScene();
    const car = createCar();
    scene.add(car);

    const camera = new THREE.PerspectiveCamera();
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 10, 0);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: display.canvas,
    });

    display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
        const { deltaTime, now } = e.detail;
        axb.poll(now);

        let dx = INPUTS.MoveRight.value - INPUTS.MoveLeft.value;
        let dy = INPUTS.MoveBackward.value - INPUTS.MoveForward.value;
        car.rotation.y += -dx / 50;
        let heading = new THREE.Vector3(-1, 0, 0);
        heading.applyEuler(car.rotation);
        car.position.x += heading.x * dy;
        car.position.z += heading.z * dy;

        renderer.render(scene, camera);
    });

    display.addEventListener('resize', () => {
        renderer.setSize(display.width, display.height);
        camera.aspect = display.width / display.height;
        camera.updateProjectionMatrix();
    });
}
