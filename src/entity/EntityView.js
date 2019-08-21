class EntityView
{
    constructor(entityManager, filter)
    {
        this.entityManager = entityManager;
        this.filter = filter;
    }

    subview(filter)
    {
        return new EntityView(this.entityManager, (entity) => this.filter(entity) && filter(entity));
    }

    [Symbol.iterator]()
    {
        return {
            filter: this.filter,
            iterator: this.entityManager._entities[Symbol.iterator](),
            next()
            {
                let result;
                while(!(result = this.iterator.next()).done)
                {
                    const entity = result.value;
                    if (this.filter(entity))
                    {
                        return {
                            value: entity,
                            done: false
                        };
                    }
                }
                return { done: true };
            }
        }
    }
}

export default EntityView;