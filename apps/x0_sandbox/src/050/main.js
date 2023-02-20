import { AssetManager } from '@milque/asset';
import { DisplayPort } from '@milque/display';
import { ButtonBinding, InputPort, KeyCodes } from '@milque/input';
import { EntityManager, AnimationFrameLoop } from '@milque/scene';

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
    
    requestAnimationFrame(new AnimationFrameLoop((e) => {
        axb.poll(e.detail.currentTime);
        let dt = e.detail.deltaTime / 60;

        cube.rotation.x += 0.5 * dt;

        renderer.setSize(display.width, display.height);
        renderer.render(scene, camera);
    }).next);
}
