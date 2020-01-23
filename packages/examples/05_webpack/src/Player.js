import { EntityWrapper, HotEntityReplacement } from '../lib/milque.js';
import { Transform } from './Transform.js';
import { ShapeRenderer } from './ShapeRenderer.js';
import { RainbowColor } from './RainbowColor.js';

export function create(world)
{
    let result = EntityWrapper.create(world.entities)
        .add(Transform, { x: 16, y: 16 })
        .add(ShapeRenderer, { shape: 'box', radius: 32 })
        .add(RainbowColor, { text: 'woot?' })
        .getEntityId();
    return HotEntityReplacement.enableForEntity(module, world.entities, result);
}

if (module.hot)
{
    module.hot.accept();
    HotEntityReplacement.acceptForModule(module, create, {
        replaceOpts: {
            worldObjectWrapper: entityManager => ({ entities: entityManager }),
        },
    });
}
