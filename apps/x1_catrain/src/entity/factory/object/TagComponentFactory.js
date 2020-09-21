import { ComponentFactory } from '../ComponentFactory.js';

export class TagComponentFactory extends ComponentFactory
{
    static fromString(entityManager, tagName)
    {
        return new TagComponentFactory(entityManager, tagName);
    }

    constructor(entityManager, componentType)
    {
        super(componentType);

        this.entityManager = entityManager;
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
    clear() { this.instances.clear(); }
}
