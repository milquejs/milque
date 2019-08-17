class ComponentBase
{
    constructor() {}

    /**
     * Creates the component instance. Must also support no args.
     * @param  {...any} args Any additional arguments.
     * @returns {this} For method chaining.
     */
    create(...args)
    {
        return this;
    }

    /**
     * Destroys the component instance.
     * @returns {Boolean} True if instance can be cached and re-used.
     */
    destroy()
    {
        return false;
    }
}

export default ComponentBase;