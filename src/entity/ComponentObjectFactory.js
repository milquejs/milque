import ComponentFactory from './ComponentFactory.js';

class ComponentObjectFactory extends ComponentFactory
{
    constructor(object)
    {
        super();

        this.object = object;
    }

    /** @override */
    create(...args)
    {
        return Object.create(this.object);
    }

    /** @override */
    destroy(instance)
    {
    }
}

export default ComponentObjectFactory;