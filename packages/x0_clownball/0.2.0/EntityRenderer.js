import { EntityQuery } from './milque';

export const QUERY = new EntityQuery([EntityRenderer]);

export function EntityRenderer()
{
    this.renderer = null;
}

export function renderEntity(ctx, view, world, entityId, renderComponent)
{
    
}

export function render(ctx, view, world, entities)
{
    for(let component of QUERY.selectComponent(entities))
    {

    }
}
