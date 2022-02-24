import { ComponentFactory } from '../ComponentFactory.js';

export class TagComponentFactory extends ComponentFactory
{
    constructor(componentType)
    {
        super(componentType);
        
        this.instances = new Set();
    }

    /** @override */
    get(entityId) { return this.instances.has(entityId); }
    /** @override */
    add(entityId, props) { this.instances.add(entityId); }
    /** @override */
    delete(entityId) { this.instances.delete(entityId); }
    /** @override */
    keys() { return this.instances.values(); }
    /** @override */
    values() { return this.instances.values(); }
    /** @override */
    entries() { return this.instances.entries(); }
    /** @override */
    clear() { this.instances.clear(); }
}
