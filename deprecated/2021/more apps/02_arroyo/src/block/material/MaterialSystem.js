import { Random } from '@milque/random';

import { ASSETS } from '../../asset/Assets.js';
import { BLOCKS } from '../BlockRegistry.js';

export const MATERIAL_COMPONENT = 'material';

export async function load(assets)
{
    assets.registerAsset('audio', 'dirt', 'arroyo/dirt.wav');
    assets.registerAsset('audio', 'stone', 'arroyo/stone.wav');
    assets.registerAsset('audio', 'fluid', 'arroyo/waterpop.wav');
    assets.registerAsset('audio', 'metal', 'arroyo/ding.wav');
}

export function initialize(world) {}

export function playPlaceSound(blockId)
{
    let material = getMaterial(blockId);
    switch(material)
    {
        case 'dirt':
            ASSETS.getAsset('audio', 'dirt').play({ pitch: Random.range(-5, 5) });
            break;
        case 'fluid':
            ASSETS.getAsset('audio', 'fluid').play({ pitch: Random.range(-5, 5) });
            break;
        case 'metal':
            ASSETS.getAsset('audio', 'metal').play({ gain: 4, pitch: Random.range(-5, 5) });
            break;
        case 'stone':
        default:
            ASSETS.getAsset('audio', 'stone').play({ gain: 1.5, pitch: Random.range(-5, 5) });
            break;
    }
}

export function getMaterial(blockId)
{
    if (BLOCKS.hasComponent(MATERIAL_COMPONENT, blockId))
    {
        return BLOCKS.getComponent(MATERIAL_COMPONENT, blockId);
    }
    else
    {
        return 'stone';
    }
}

