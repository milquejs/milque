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
    destroy(instance)
    {
        instance.destroy();
    }
}

export default ComponentClassFactory;
