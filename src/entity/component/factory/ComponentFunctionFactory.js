import ComponentFactory from './ComponentFactory.js';

class ComponentFunctionFactory extends ComponentFactory
{
    constructor(handler)
    {
        super();

        this.handler = handler;
    }

    /** @override */
    create(...args)
    {
        return this.handler(...args);
    }

    /** @override */
    destroy(instance)
    {
    }
}

export default ComponentFunctionFactory;