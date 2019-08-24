import ComponentFactory from './ComponentFactory.js';

class ComponentClassFactory extends ComponentFactory
{
    constructor(handlerClass)
    {
        super();

        this.handler = new handlerClass();
        this._cached = [];
    }

    /** @override */
    create(...args)
    {
        let instance;
        if (this._cached.length > 0)
        {
            instance = this._cached.shift();
        }
        else
        {
            instance = {};
        }

        return this.handler.onCreate(instance, ...args);
    }

    /** @override */
    change(instance, ...args)
    {
        this.handler.onChange(instance, ...args);
    }

    /** @override */
    destroy(instance)
    {
        const result = this.handler.onDestroy(instance);
        
        // See if instance can be cached...
        if (result)
        {
            this._cached.push(instance);
        }
    }
}

export default ComponentClassFactory;