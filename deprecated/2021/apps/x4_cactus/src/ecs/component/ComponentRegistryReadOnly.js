export class ComponentRegistryReadOnly
{
    constructor(factories)
    {
        /** @private */
        this.factories = factories;
    }
    
    isComponentType(componentType)
    {
        return componentType in this.factories;
    }

    getComponentTypes()
    {
        return Object.keys(this.factories);
    }

    getComponentFactory(componentType)
    {
        return this.factories[componentType];
    }
}
