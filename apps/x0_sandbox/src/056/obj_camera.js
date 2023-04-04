import { lerp } from '@milque/util';
import { AssetRef } from '@milque/asset';

import { useContext, useWhen, useWhenAsync } from '../runner';
import { AssetProvider, CanvasProvider, EntityProvider, RenderingProvider } from './Providers';
import { RoomDef } from '../room2/room';
import { ObjectDef } from '../room2/object';
import { RoomProvider, useSpawner } from './RoomSystem';
import { Init, PostUpdate, PreDraw, Preload } from './main';

export const objCamera = new AssetRef('obj_camera', async () => ObjectDef.create(null));

// What if resolution by constructor.name? What if it returns all event handlers?
export function CameraSystem(m) {
    let assets = useContext(m, AssetProvider);
    let ents = useContext(m, EntityProvider);
    let { tia } = useContext(m, RenderingProvider);
    let canvas = useContext(m, CanvasProvider);
    let room = useContext(m, RoomProvider);
    let spawn = useSpawner(m);

    useWhenAsync(m, Preload, 0, async() => {
        await objCamera.load(assets);
    });

    useWhen(m, Init, 0, () => {
        spawn(objCamera.uri, 0, 0);
    });

    useWhen(m, PreDraw, 0, () => {
        for(let [_, camera] of RoomDef.findAllByObject(ents, room, objCamera.uri)) {
            tia.camera(camera.x - canvas.width / 2, camera.y - canvas.height / 2);
        }
    });
    
    useWhen(m, PostUpdate, 0, () => {
        // Update camera
        let [_, bunny] = RoomDef.findAnyByObject(ents, room, 'obj_bunny');
        let cameraSpeed = 0.03;
        for(let [_, camera] of RoomDef.findAllByObject(ents, room, objCamera.uri)) {
            camera.x = lerp(camera.x, bunny.x, cameraSpeed);
            camera.y = lerp(camera.y, bunny.y, cameraSpeed);
        }
    });
}
