import { AssetManager } from '@milque/asset';
import { DisplayPort } from '@milque/display';
import { ButtonBinding, InputPort, KeyCodes } from '@milque/input';
import { EntityManager, AnimationFrameLoop, ComponentClass, Query } from '@milque/scene';

import { Scene, WebGLRenderer, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

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
    
    let scene = new Scene();

    let geom = new BoxGeometry(1, 1, 1);
    let mat = new MeshBasicMaterial({ color: 0x00FF00 });
    let cube = new Mesh(geom, mat);
    scene.add(cube);
    
    display.addEventListener('resize', () => {
        renderer.setSize(display.width, display.height);
    });

    requestAnimationFrame(new AnimationFrameLoop((e) => {
        axb.poll(e.detail.currentTime);
        let dt = e.detail.deltaTime / 60;

        cube.rotation.x += 0.5 * dt;

        renderer.render(scene, camera);
    }).next);
}

const Player = new ComponentClass('Player', () => ({
    x: 0,
    y: 0,
    rotation: 0,
}));

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

/**
 * @param {EntityManager} ents 
 * @param {Mesh} cube 
 */
function drawPlayers(ents, cube) {
    for(let [entityId, box] of BoxQuery.findAll(ents)) {
        
    }
}
