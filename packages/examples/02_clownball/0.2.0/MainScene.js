import { EntityManager } from './milque.js';
import { TileManager } from './TileManager.js';

export class MainScene
{
    onStart()
    {
        this.world = {
            entities: new EntityManager(),
            tiles: new TileManager(),
        };
    }

    onUpdate(dt)
    {
        
    }

    static onRender(ctx, view, world)
    {
        TileRenderer.render(ctx, view, world.tiles);
    }
}
