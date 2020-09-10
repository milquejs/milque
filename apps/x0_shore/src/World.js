const WORLD_STATIC_INSTANCE = Symbol('worldInstance');
const WORLD_PROVIDED = Symbol('worldProvided');
const WORLD_DEPENDENCIES = Symbol('worldDependencies');

// Should be able to un-provide to allow control over
// where the globals are used. Maybe have a key that
// is only passed around in systems.
export class World
{
    static getWorld(opts = {})
    {
        const { lazy = true } = opts;
        if (!(WORLD_STATIC_INSTANCE in this))
        {
            if (!lazy)
            {
                throw new Error('Invalid immediate access to uninitialized world. Must call World.provide() before this or be lazily loaded.');
            }

            let world = new (this)(WORLD_STATIC_INSTANCE);
            this[WORLD_STATIC_INSTANCE] = world;
            return world;
        }
        else
        {
            let world = this[WORLD_STATIC_INSTANCE];
            return world;
        }
    }

    static provide(values)
    {
        let world = this.getWorld();
        if (world[WORLD_PROVIDED])
        {
            throw new Error('Can only provide world values once.');
        }

        let required = new Set(world[WORLD_DEPENDENCIES]);
        for(let [key, value] of Object.entries(values))
        {
            world[key] = value;
            if (required.has(key)) required.delete(key);
        }
        world[WORLD_PROVIDED] = true;
        if (required.size <= 0)
        {
            Object.freeze(world);
            return world;
        }
        else
        {
            throw new Error(`Missing required world dependencies: ${Array.from(required)}`);
        }
    }

    static require(...dependencies)
    {
        let world = this.getWorld();
        if (world[WORLD_PROVIDED])
        {
            let missing = [];
            for(let dependency of dependencies)
            {
                if (!world[WORLD_DEPENDENCIES].has(dependency))
                {
                    missing.push(dependency);
                }
            }
            if (missing.length > 0)
            {
                throw new Error(`Missing required world dependencies: ${missing}`);
            }
        }
        else
        {
            for(let dependency of dependencies)
            {
                world[WORLD_DEPENDENCIES].add(dependency);
            }
        }
        return this;
    }

    /** @private */
    constructor(init)
    {
        if (init !== WORLD_STATIC_INSTANCE)
        {
            throw new Error('World cannot be instantiated externally.');
        }

        this[WORLD_DEPENDENCIES] = new Set();
        this[WORLD_PROVIDED] = false;
    }
}
