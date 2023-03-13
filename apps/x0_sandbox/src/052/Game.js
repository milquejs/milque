import { Toaster as T } from '@milque/scene';
import { ButtonBinding, KeyCodes } from '@milque/input';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { DisplayProvider } from './main';

import * as THREE from 'three';
import { AssetManager, AssetRef, cacheAssetPackAsRaw, ImageLoader, preloadAssetRefs } from '@milque/asset';

import { DialoguePrompt } from './DialoguePrompt';
import { AnimatedText } from './AnimatedText';

DialoguePrompt.define();

export const INPUTS = {
    MoveLeft: new ButtonBinding('move.left', [KeyCodes.ARROW_LEFT, KeyCodes.KEY_A]),
    MoveRight: new ButtonBinding('move.right', [KeyCodes.ARROW_RIGHT, KeyCodes.KEY_D]),
    MoveUp: new ButtonBinding('move.up', [KeyCodes.ARROW_UP, KeyCodes.KEY_W]),
    MoveDown: new ButtonBinding('move.down', [KeyCodes.ARROW_DOWN, KeyCodes.KEY_S]),
};

export const PROVIDERS = [
    AssetProvider,
    GameProvider,
    ControlsProvider,
];

export const ASSETS = {
    WallFaceTexture: new AssetRef('wall.face', ThreeTextureLoader, {}, 'star.png'),
    WallSideTexture: new AssetRef('wall.side', ThreeTextureLoader, {}, 'raw://star.png'),
};

export async function load(m) {
    const assets = T.useProvider(m, AssetProvider);
    await cacheAssetPackAsRaw(assets, 'res.pack');
    await preloadAssetRefs(assets, Object.values(ASSETS));
}

export function init(m) {
    const { scene } = T.useProvider(m, GameProvider);
    const { display } = T.useProvider(m, DisplayProvider);

    let room = createRoom(scene);

    let dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    dirLight.position.set(10, 10, 5);
    scene.add(dirLight);

    let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
    scene.add(ambientLight);

    let el = document.createElement('dialogue-prompt');
    el.slot = 'overlay';
    display.appendChild(el);

    let target = el.shadowRoot.querySelector('.content');
    target.addEventListener('click', () => {
        AnimatedText.skip(target);
    });
    AnimatedText.play(target);
}

export function update(m) {
    const controls = T.useProvider(m, ControlsProvider);
    controls.update();

    const { scene, renderer, camera } = T.useProvider(m, GameProvider);
    renderer.render(scene, camera);
}

function AssetProvider(m) {
    const assets = new AssetManager();
    return assets;
}

function GameProvider(m) {
    const { display } = T.useProvider(m, DisplayProvider);

    let renderer = new THREE.WebGLRenderer({ canvas: display.canvas });
    renderer.setSize(display.width, display.height);

    let camera = new THREE.PerspectiveCamera(45, display.width / display.height, 1, 100);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    let scene = new THREE.Scene();

    // @ts-ignore
    T.useHTMLElementEventListener(m, display, 'resize', () => {
        renderer.setSize(display.width, display.height);
    });

    return {
        renderer,
        camera,
        scene,
    };
}

function ControlsProvider(m) {
    let { display } = T.useProvider(m, DisplayProvider);
    let { camera } = T.useProvider(m, GameProvider);
    let orbitControls = new OrbitControls(camera, display);
    orbitControls.update();
    return orbitControls;
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
    // let face = new THREE.MeshStandardMaterial({ map: ASSETS.WallFaceTexture.current });
    // let side = new THREE.MeshStandardMaterial({ map: ASSETS.WallSideTexture.current });
    let cube = new THREE.Mesh(geom, mat);
    cube.position.set(x, y, z);
    parent.add(cube);
    return cube;
}

function randColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

async function ThreeTextureLoader(src, opts) {
    if (typeof src === 'string') {
        let loader = new THREE.TextureLoader();
        return await loader.loadAsync(src);
    } else {
        let image = await ImageLoader(src);
        return new THREE.Texture(image);
    }
}
