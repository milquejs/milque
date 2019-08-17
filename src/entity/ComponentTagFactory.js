import ComponentFactory from './ComponentFactory.js';

class ComponentTagFactory extends ComponentFactory
{
    constructor(tag)
    {
        super();

        this.tag = tag;
    }

    /** @override */
    create(...args)
    {
        return null;
    }

    /** @override */
    destroy(instance)
    {
    }
}

export default ComponentTagFactory;