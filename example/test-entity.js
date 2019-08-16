const E = Milque.Entity.ENTITY_MANAGER;
const EntityBase = Milque.Entity.EntityBase;

// Creating custom components...
function Position(x = 0, y = 0)
{
    return { x, y };
}
function Velocity(dx = 0, dy = 0)
{
    return { dx, dy };
}

// Easiest way to create entities...
const player = Milque.Entity.spawn()
    .assign(Position, 16, 16)
    .assign(Velocity, 1, 1);

console.log(player);

// Another way to create entities...
const circle = E.create();
E.assign(circle, Position, 8, 8);
E.assign(circle, Velocity, -1, 0);

console.log(circle, E.get(circle, Position, Velocity));

// A way to create custom entities...
class Box extends EntityBase
{
    constructor() { super(); }

    /** @override */
    onCreate(...args)
    {
        super.onCreate(...args);

        this.assign(Position)
            .assign(Velocity);
    }
}

const box = new Box(E).create();

console.log(box);