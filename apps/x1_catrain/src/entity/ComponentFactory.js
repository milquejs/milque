/** @interface */
export class ComponentFactory
{
    constructor(componentType)
    {
        this.componentType = componentType;
    }
    
    get(entityId) { return null; }
    getAll(entityId)
    {
        let result = this.get(entityId);
        if (result)
        {
            return [result];
        }
        else
        {
            return null;
        }
    }
    add(entityId, props) { return {}; }
    delete(entityId) {}
    keys() { return []; }
    values() { return []; }
    entries() { return []; }
    clear() {}
}
