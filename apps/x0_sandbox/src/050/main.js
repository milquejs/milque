import { AssetManager, AssetRef, cacheAssetPackAsRaw, ImageLoader } from '@milque/asset';
import { DisplayPort } from '@milque/display';
import { ButtonBinding, InputPort, KeyCodes } from '@milque/input';
import { EntityManager, AnimationFrameLoop } from '@milque/scene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as THREE from 'three';

const INPUTS = {
    MoveLeft: new ButtonBinding('move2d.left', [KeyCodes.ARROW_LEFT, KeyCodes.KEY_A]),
    MoveRight: new ButtonBinding('move2d.right', [KeyCodes.ARROW_RIGHT, KeyCodes.KEY_D]),
    MoveUp: new ButtonBinding('move2d.up', [KeyCodes.ARROW_UP, KeyCodes.KEY_W]),
    MoveDown: new ButtonBinding('move2d.down', [KeyCodes.ARROW_DOWN, KeyCodes.KEY_S]),
};

export async function main() {
    let display = DisplayPort.create({ id: 'display', debug: true });

    let renderer = new THREE.WebGLRenderer({ canvas: display.canvas });
    renderer.setSize(display.width, display.height);

    let camera = new THREE.PerspectiveCamera(45, display.width / display.height, 1, 100);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    let orbitControls = new OrbitControls(camera, display);
    orbitControls.update();

    let scene = new THREE.Scene();
    let room = createRoom(scene);

    let dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    dirLight.position.set(10, 10, 5);
    scene.add(dirLight);
    
    display.addEventListener('resize', () => {
        renderer.setSize(display.width, display.height);
    });

    requestAnimationFrame(new AnimationFrameLoop((e) => {
        orbitControls.update();
        renderer.render(scene, camera);
    }).next);
}

function createRoom(scene) {
    let size = 6;
    let thickness = 0.2;
    let height = 4;

    let halfSize = size / 2;
    let halfThickness = thickness / 2;
    let halfHeight = height / 2;

    let group = new THREE.Group();
    // NOTE: Origin is on TOP of the floor.
    let floor = createCube(group, 0, -halfThickness, 0, size, thickness, size);
    let leftWall = createCube(group, -halfSize - halfThickness, halfHeight - thickness, 0, thickness, height, size);
    let rightWall = createCube(group, halfSize + halfThickness, halfHeight - thickness, 0, thickness, height, size);
    let backWall = createCube(group, 0, halfHeight - thickness, -halfSize - halfThickness, size + thickness * 2, height, thickness);
    scene.add(group);
    return group;
}

function createCube(parent, x = 0, y = 0, z = 0, dx = 1, dy = 1, dz = 1, color = randColor()) {
    let geom = new THREE.BoxGeometry(dx, dy, dz);
    let mat = new THREE.MeshStandardMaterial({ color });
    let cube = new THREE.Mesh(geom, mat);
    cube.position.set(x, y, z);
    parent.add(cube);
    return cube;
}

export function randColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
