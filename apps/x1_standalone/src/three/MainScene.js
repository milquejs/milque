import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene } from 'three';

export const ambient = new AmbientLight(0xFFFFFF, 0.6);

export const directional = new DirectionalLight(0xFFFFFF, 0.8);
directional.position.set(200, 500, 300);

export const camera = new PerspectiveCamera();
camera.position.set(200, 200, 200);
camera.lookAt(0, 10, 0);

export function createScene() {
    let result = new Scene();
    result.add(ambient);
    result.add(directional);
    return result;
}
