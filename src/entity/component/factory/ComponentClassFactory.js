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
        const ComponentClass = this.componentClass;
        const result = new ComponentClass();
        result.create(...args);
        return result;
    }

    /** @override */
    update(instance, ...args)
    {
        instance.update(...args);
    }

    /** @override */
    destroy(instance)
    {
        const result = instance.destroy();
        if (result)
        {
            // Instance can be cached :D
        }
    }
}

export default ComponentClassFactory;
