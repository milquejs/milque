import ComponentFactory from './ComponentFactory.js';

class ComponentFunctionFactory extends ComponentFactory
{
    constructor(handlerFunction)
    {
        super();

        this.handler = handlerFunction;
        this._cached = [];
    }

    /** @override */
    create(...args)
    {
        let instance;
        if (this._cached.length > 0)
        {
            instance = this._cached.shift();

            if (typeof this.handler.onRecreate === 'function')
            {
                this.handler.onRecreate.call(this.handler, instance, ...args);
            }
            else
            {
                const keys = Object.keys(instance);
                for(let i = 0; i < keys.length; ++i)
                {
                    instance[keys[i]] = args[i];
                }
            }
        }
        else
        {
            instance = this.handler.call(this.handler, ...args);
        }
        
        return instance;
    }

    /** @override */
    change(instance, ...args)
    {
        if (typeof this.handler.onChange === 'function')
        {
            this.handler.onChange.call(this.handler, instance, ...args);
        }
        else
        {
            const keys = Object.keys(instance);
            const length = Math.min(args.length, keys.length);
            for(let i = 0; i < length; ++i)
            {
                instance[keys[i]] = args[i];
            }
        }
    }

    /** @override */
    destroy(instance)
    {
        if (typeof this.handler.onDestroy === 'function')
        {
            const result = this.handler.onDestroy.call(this.handler, instance);
            
            // See if instance can be cached...
            if (result)
            {
                this._cached.push(instance);
            }
        }
    }
}

export default ComponentFunctionFactory;