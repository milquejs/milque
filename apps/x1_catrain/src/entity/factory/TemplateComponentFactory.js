import { ComponentFactory } from '../ComponentFactory.js';

export class TemplateComponentFactory extends ComponentFactory
{
    constructor(componentType, template = {})
    {
        super(componentType);

        this.template = template;

        /** @private */
        this.instances = {};
    }

    /** @private */
    create(props)
    {
        let result = {
            ...this.template,
            ...props,
        };
        return result;
    }

    /** @override */
    get(entityId) { return this.instances[entityId]; }
    /** @override */
    add(entityId, props)
    {
        let prevInstance = this.instances[entityId];
        if (!prevInstance)
        {
            let nextInstance = this.create(props);
            this.instances[entityId] = nextInstance;
            return nextInstance;
        }
        else
        {
            throw new Error(`Failed to add component - entity already has component of the same type ${getName(this.componentType)}.`);
        }
    }
    /** @override */
    delete(entityId) { this.instances[entityId] = null; }
    /** @override */
    keys() { return Object.keys(this.instances); }
    /** @override */
    values() { return Object.values(this.instances); }
    /** @override */
    clear() { this.instances = {}; }
}
