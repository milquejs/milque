import ComponentFactory from './ComponentFactory.js';

class ComponentFunctionFactory extends ComponentFactory
{
    constructor(componentHandler)
    {
        super();

        this.componentHandler = componentHandler;
    }

    /** @override */
    create(...args)
    {
        return this.componentHandler(...args);
    }

    /** @override */
    change(instance, ...args)
    {
        const target = this.componentHandler(...args);
        for(const key of Object.keys(target))
        {
            instance[key] = target[key];
        }
    }

    /** @override */
    destroy(instance)
    {
        // Instance can always be cached :D
    }
}

export default ComponentFunctionFactory;