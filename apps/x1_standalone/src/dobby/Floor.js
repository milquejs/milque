import { AssetRef } from '@milque/asset';
import { loadImage as ImageLoader } from '../loaders/ImageLoader.js';

export const FloorTexture = new AssetRef('floorTexture', 'res/wood.png', ImageLoader);
export const FloorMaterial = new AssetRef('floorMaterial', 'res/floor.mat');
export const FloorGeometry = new AssetRef('floorGeometry', 'floor.gltf');

export function createFloor(scene) {
}


export function FloorRenderer(floor) {
    return {
        models: [
            {
                material: {

                },
                mesh: {

                },
            }
        ],
        animations: [

        ]
    };
}

export function getRenderInfo(floor) {

}
