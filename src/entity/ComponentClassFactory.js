import ComponentFactory from './ComponentFactory.js';

class ComponentClassFactory extends ComponentFactory
{
    constructor(componentClass)
    {
        super();

        this.componentClass = componentClass;
    }

    /** @override */
    create(...args)
    {
        const result = new (this.componentClass)();
        result.create(...args);
        return result;
    }

    /** @override */
    destroy(instance)
    {
        instance.destroy();
    }
}

export default ComponentClassFactory;