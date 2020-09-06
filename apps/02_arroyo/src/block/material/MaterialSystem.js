import { Random, Audio } from '../../lib.js';
import { BLOCKS } from '../BlockRegistry.js';

export const MATERIAL_COMPONENT = 'material';

const PLACE_SOUNDS = {};

export async function load(assets)
{
    PLACE_SOUNDS.dirt = await Audio.loadAudio('arroyo/dirt.wav');
    PLACE_SOUNDS.stone = await Audio.loadAudio('arroyo/stone.wav');
    PLACE_SOUNDS.fluid = await Audio.loadAudio('arroyo/waterpop.wav');
    PLACE_SOUNDS.metal = await Audio.loadAudio('arroyo/ding.wav');
}

export function initialize(world) {}

export function playPlaceSound(blockId)
{
    let material = getMaterial(blockId);
    switch(material)
    {
        case 'dirt':
            PLACE_SOUNDS.dirt.play({ pitch: Random.range(-5, 5) });
            break;
        case 'fluid':
            PLACE_SOUNDS.fluid.play({ pitch: Random.range(-5, 5) });
            break;
        case 'metal':
            PLACE_SOUNDS.metal.play({ gain: 4, pitch: Random.range(-5, 5) });
            break;
        case 'stone':
        default:
            PLACE_SOUNDS.stone.play({ gain: 1.5, pitch: Random.range(-5, 5) });
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

