class HybridEntity
{
    static create(props, componentName, entityId, entityManager)
    {
        if (Array.isArray(props))
        {
            return new (this)(entityManager, entityId, ...props);
        }
        else
        {
            return new (this)(entityManager, entityId, props);
        }
    }
    
    constructor(entityManager, entityId)
    {
        this.entityManager = entityManager;
        this.entityId = entityId;
    }
}
