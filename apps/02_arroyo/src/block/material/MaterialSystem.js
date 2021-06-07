import { Random } from '@milque/random';

import { loadAudio } from '../../asset/Audio.js';
import { ASSETS } from '../../asset/Assets.js';
import { BLOCKS } from '../BlockRegistry.js';

export const MATERIAL_COMPONENT = 'material';

export async function load(assets)
{
    ASSETS['audio:dirt'] = await loadAudio(assets.files.get('res/dirt.wav'));
    ASSETS['audio:stone'] = await loadAudio(assets.files.get('res/stone.wav'));
    ASSETS['audio:fluid'] = await loadAudio(assets.files.get('res/waterpop.wav'));
    ASSETS['audio:metal'] = await loadAudio(assets.files.get('res/ding.wav'));
}

export function initialize(world) {}

export function playPlaceSound(blockId)
{
    let material = getMaterial(blockId);
    switch(material)
    {
        case 'dirt':
            ASSETS['audio:dirt'].play({ pitch: Random.range(-5, 5) });
            break;
        case 'fluid':
            ASSETS['audio:fluid'].play({ pitch: Random.range(-5, 5) });
            break;
        case 'metal':
            ASSETS['audio:metal'].play({ gain: 4, pitch: Random.range(-5, 5) });
            break;
        case 'stone':
        default:
            ASSETS['audio:stone'].play({ gain: 1.5, pitch: Random.range(-5, 5) });
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
