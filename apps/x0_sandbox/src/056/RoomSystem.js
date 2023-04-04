import { RoomDef } from '../room2/room';
import { useContext } from '../runner';
import { AssetProvider, EntityProvider, SceneGraphProvider } from './Providers';

export function RoomProvider(m) {
    let ents = useContext(m, EntityProvider);
    let sceneGraph = useContext(m, SceneGraphProvider);
    let assets = useContext(m, AssetProvider);
    return RoomDef.newInstance(ents, sceneGraph, assets, RoomDef.fromJSON({ initial: { background: 0xFFFFFF }}), 'rm_main');
}

export function useSpawner(m) {
    let ents = useContext(m, EntityProvider);
    let sceneGraph = useContext(m, SceneGraphProvider);
    let assets = useContext(m, AssetProvider);
    let room = useContext(m, RoomProvider);
    return function spawn(objectName, x, y) {
        return RoomDef.spawn(ents, sceneGraph, assets, room, objectName, x, y);
    };
}

export function useWhenObjectUpdate(m, objectName, callback) {
    // TODO: Not yet implemented.
}

export function useWhenObjectDraw(m, objectName, callback) {
    // TODO: Not yet implemented.
}
