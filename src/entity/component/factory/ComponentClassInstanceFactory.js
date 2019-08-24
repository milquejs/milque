import ComponentFactory from './ComponentFactory.js';

class ComponentClassInstanceFactory extends ComponentFactory
{
    constructor(instanceClass)
    {
        super();

        this.instanceClass = instanceClass;
    }

    /** @override */
    create(...args)
    {
        const instanceClass = this.instanceClass;
        return new instanceClass(...args);
    }

    /** @override */
    change(instance, ...args)
    {
        instance.onChange(...args);
    }

    /** @override */
    destroy(instance)
    {
        instance.onDestroy();
    }
}

export default ComponentClassInstanceFactory;
