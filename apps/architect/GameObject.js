export class GameObject
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.sprite = null;
        this.mask = null;
    }

    onEarlyUpdate(world) {}
    onUpdate(world, dt) {}
    onFixedUpdate(world) {}
    onLateUpdate(world) {}

    onPreDraw(world, ctx) {}
    onDraw(world, ctx) {}
    onPostDraw(world, ctx) {}
}
