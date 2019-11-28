class ComponentBase
{
    constructor() {}

    /**
     * Creates the component instance. Must also support no args.
     * @param  {...any} args Any additional arguments to initialize with.
     * @returns {Object} The component instance.
     */
    onCreate(instance, ...args)
    {
        if (instance)
        {
            const keys = Object.keys(instance);
            for(let i = 0; i < keys.length; ++i)
            {
                instance[keys[i]] = args[i];
            }
            return instance;
        }
        else
        {
            return {};
        }
    }

    /**
     * Changes the component instance for the provided args.
     * @param  {...any} args Any additional arguments to change for.
     */
    onChange(instance, ...args)
    {
        const keys = Object.keys(instance);
        for(let i = 0; i < keys.length; ++i)
        {
            instance[keys[i]] = args[i];
        }
    }

    /**
     * Destroys the component instance.
     * @returns {Object} The instance to cache, null if not cacheable.
     */
    onDestroy(instance)
    {
        return true;
    }
}

export default ComponentBase;
