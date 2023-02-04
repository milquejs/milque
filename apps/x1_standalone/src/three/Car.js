import { BoxGeometry, Mesh, MeshLambertMaterial, Group } from 'three';

export const MATERIAL_CAR_BODY = new MeshLambertMaterial({ color: 0x78b14b });
export const MATERIAL_CAR_CABIN = new MeshLambertMaterial({ color: 0xffffff });
export const MATERIAL_CAR_WHEEL = new MeshLambertMaterial({ color: 0x333333 });

export function createCar() {
    const car = new Group();

    const backWheel = createWheel();
    backWheel.position.y = 6;
    backWheel.position.x = -18;
    car.add(backWheel);
    
    const frontWheel = createWheel();
    frontWheel.position.y = 6;
    frontWheel.position.x = 18;
    car.add(frontWheel);

    const bodyMesh = new Mesh(new BoxGeometry(60, 15, 30), MATERIAL_CAR_BODY);
    bodyMesh.position.y = 12;
    car.add(bodyMesh);

    const cabin = new Mesh(new BoxGeometry(33, 12, 24), MATERIAL_CAR_CABIN);
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    car.add(cabin);

    return car;
}

function createWheel() {
    return new Mesh(new BoxGeometry(12, 12, 33), MATERIAL_CAR_WHEEL);
}
