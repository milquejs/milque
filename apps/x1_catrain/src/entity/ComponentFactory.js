export class ComponentFactory
{
    constructor(componentType)
    {
        this.componentType = componentType;
    }
    
    get(entityId) { return null; }
    add(entityId, props) { return {}; }
    delete(entityId) {}
    keys() { return []; }
    values() { return []; }
    entries() { return []; }
    clear() {}
}
