import ComponentFactory from './ComponentFactory.js';

class ComponentTagFactory extends ComponentFactory
{
    constructor(tagName)
    {
        super();

        this.tagName = tagName;
    }
    
    /** @override */
    create(...args) { return null; }
}

export default ComponentTagFactory;