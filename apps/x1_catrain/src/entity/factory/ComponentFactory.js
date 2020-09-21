export class ComponentFactory
{
    constructor(componentType)
    {
        this.componentType = componentType;
    }

    /** @abstract */
    get(entityId) {}
    /** @abstract */
    add(entityId, props) {}
    /** @abstract */
    delete(entityId) {}
    /** @abstract */
    keys() { return []; }
    /** @abstract */
    values() { return []; }
    /** @abstract */
    clear() {}
}
