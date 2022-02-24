export class Room
{
    constructor(width, height, initials = [])
    {
        this.width = width;
        this.height = height;

        this.initials = initials;
        this.instances = [];
    }

    start()
    {
        for(let initial of this.initials)
        {
            const ObjectConstructor = initial.object;
            if (ObjectConstructor)
            {
                this.createInstance(initial.x || 0, initial.y || 0, initial.object);
            }
            else
            {
                this.instances.push({
                    x: initial.x || 0,
                    y: initial.y || 0,
                    room: this,
                });
            }
        }
    }

    createInstance(x, y, object)
    {
        let instance = new object();
        instance.x = x;
        instance.y = y;
        instance.room = this;
        if (instance.onCreate)
        {
            instance.onCreate.call(instance);
        }
        this.instances.push(instance);
        return instance;
    }

    update(dt)
    {
        let deadInstances = [];
        for(let instance of this.instances)
        {
            if (instance.dead)
            {
                if (instance.onDestroy)
                {
                    instance.onDestroy();
                }
                
                deadInstances.push(instance);
            }
            else if (instance.onUpdate)
            {
                instance.onUpdate.call(instance, dt);
            }
        }

        for(let instance of deadInstances)
        {
            this.instances.splice(this.instances.indexOf(instance), 1);
        }
    }

    render(ctx)
    {
        for(let instance of this.instances)
        {
            if (instance.onRender)
            {
                ctx.translate(instance.x, instance.y);
                {
                    instance.onRender.call(instance, ctx);
                }
                ctx.translate(-instance.x, -instance.y);
            }
        }
    }

    stop()
    {
        this.instances.length = 0;
    }
}

export class GameObject
{
    constructor()
    {
        this.name = 'object';
        this.sprite = null;
        this.mask = null;
        this.dead = false;
    }

    /** @override */
    onCreate() {}
    /** @override */
    onDestroy() {}
    /** @override */
    onUpdate(dt) {}
    /** @override */
    onRender(ctx)
    {
        if (this.sprite)
        {
            this.sprite.render(ctx, ctx.assets);
        }
    }
}

export class Sprite
{
    constructor(src)
    {
        this.src = src;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    render(ctx, assets)
    {
        let image = assets.getAsset(this.src);
        if (image)
        {
            ctx.drawImage(image, this.offsetX, this.offsetY);
        }
        else
        {
            ctx.fillStyle = 'white';
            ctx.fillRect(this.offsetX, this.offsetY, 16, 16);
        }
    }
}
