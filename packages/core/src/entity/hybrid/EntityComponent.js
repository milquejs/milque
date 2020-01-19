/** Cannot be directly added through world.addComponent(). Must be create with new EntityComponent(). */
export class EntityComponent
{
    constructor(world, entityId = undefined)
    {
        if (typeof entityId !== 'undefined')
        {
            throw new Error('This component cannot be added to an existing entity; it can only initialize itself.');
        }
        
        if (!world)
        {
            throw new Error('Cannot create entity in null world.');
        }

        const id = world.createEntity();

        // Skip component creation, as we will be using ourselves :D
        world.componentHandler.putComponent(id, EntityComponent, this, undefined);
        
        this.id = id;
    }

    /** @override */
    copy(values) { throw new Error('Unsupported operation; cannot be initialized by existing values.'); }
    
    /** @override */
    reset() { return false; }
}
