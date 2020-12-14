export function getEntityById(world, entityId)
{
    return world,getComponent(entityId, EntityComponent);
}

export function getEntities(world)
{
    let dst = [];
    let entityIds = world.query([EntityComponent]);
    for(let entityId of entityIds)
    {
        let component = world.getComponent(entityId, EntityComponent);
        dst.push(component);
    }
    return dst;
}
