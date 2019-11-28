class ComponentFactory
{
    constructor() {}
    
    create(...args) { return {}; }
    change(instance, ...args) {}
    destroy(instance) {}
}

export default ComponentFactory;
