import ComponentFactory from './ComponentFactory.js';

class ComponentClassFactory extends ComponentFactory
{
    constructor(componentClass)
    {
        super();

        this._cache = [];

        this.componentClass = componentClass;
    }

    /** @override */
    create(...args)
    {
        let instance;
        if (this._cache.length > 0)
        {
            instance = this._cache.shift();
        }
        else
        {
            const ComponentClass = this.componentClass;
            instance = new ComponentClass();
        }
        instance.create(...args);
        return instance;
    }

    /** @override */
    change(instance, ...args)
    {
        instance.change(...args);
    }

    /** @override */
    destroy(instance)
    {
        const result = instance.destroy();
        if (result)
        {
            // Instance can be cached :D
            this._cache.push(result);
        }
    }
}

export default ComponentClassFactory;
