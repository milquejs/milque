import { AssetManager } from '@milque/asset';
import { DisplayPort } from '@milque/display';
import { ButtonBinding, InputPort, KeyCodes } from '@milque/input';
import { EntityManager, AnimationFrameLoop, ComponentClass, Query } from '@milque/scene';
import { Scene, WebGLRenderer, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreeWorld } from './ThreeWorld.js';

const Left = new ButtonBinding('left', KeyCodes.ARROW_LEFT);
const Right = new ButtonBinding('right', KeyCodes.ARROW_LEFT);

export async function main() {
    let display = DisplayPort.create({ id: 'display', mode: 'fit', debug: true });
    let input = InputPort.create({ for: 'display' });
    let asset = new AssetManager();
    let entity = new EntityManager();
    let axb = input.getContext('axisbutton');
    axb.bindBinding(Left);
    axb.bindBinding(Right);

    let renderer = new WebGLRenderer({ canvas: display.canvas });
    renderer.setSize(display.width, display.height);

    let camera = new PerspectiveCamera(45, display.width / display.height, 1, 100);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    let controller = new OrbitControls(camera, renderer.domElement);

    let world = new ThreeWorld();
    world.createCube();
    
    display.addEventListener('resize', () => {
        renderer.setSize(display.width, display.height);
    });

    setInterval(() => {
        let text = world.stringify();
        console.log(text);
        world.syncFrom(text);
        console.log(renderer.info);
    }, 5000);

    requestAnimationFrame(new AnimationFrameLoop((e) => {
        axb.poll(e.detail.currentTime);
        let dt = e.detail.deltaTime / 60;

        controller.update();
        renderer.render(world.scene, camera);
    }).next);
}


const Player = new ComponentClass('Player', () => ({
    x: 0,
    y: 0,
    rotation: 0,
}));
const PlayerQuery = new Query(Player);

const BOX_GEOM = new BoxGeometry(1, 1, 1);
const BOX_MAT = new MeshBasicMaterial({ color: 0x00FF00 });

const Box = new ComponentClass('Box', () => ({
    mesh: new Mesh(BOX_GEOM, BOX_MAT),
}));
const BoxQuery = new Query(Box);

/**
 * @param {EntityManager} ents 
 * @param {Scene} scene
 */
function createPlayer(ents, scene) {
    let entityId = ents.create();
    let result = ents.attach(entityId, Player);
    let box = ents.attach(entityId, Box);
    scene.add(box.mesh);
    return result;
}
