/**
 * Inspired by Tradewinds.
 * This uses the basic set of Milque tools. In theory, all future
 * versions should still be able to support this.
 */

Milque.Display.attach(document.getElementById('display1'));
const ctx = Milque.Display.VIEW.canvas.getContext('2d');

const pointer = Milque.Controller.Pointer();

const TAG_BOX = 'box';
function Box(x = 0, y = 0, width = 16, height = width, color = '#FFFFFF')
{
    const entity = Milque.Entity.spawn().tag(TAG_BOX);
    entity.x = x;
    entity.y = y;
    entity.rotation = 0;
    entity.width = width;
    entity.height = height;
    entity.color = color;
    entity.moveSpeed = 2;
    entity.rotateSpeed = 0.06;
    return entity;
}

const TAG_MOVING = 'moving';
const TAG_FOLLOW = 'follow';
const TAG_BOX_CART = 'box-cart';
function BoxCart(parent)
{
    const entity = Box().tag(TAG_BOX_CART).tag(TAG_FOLLOW);
    entity.parent = parent;
    entity.rotateSpeed = 1;
    return entity;
}

const TAG_GOODS = 'goods';
function BoxGoods()
{
    const entity = Box().tag(TAG_GOODS);
    randomizePosition(entity);
    entity.width = 8;
    entity.height = 8;
    entity.color = '#FFFF00';
    return entity;
}

function follow(entity, target, minDistance)
{
    if (Milque.Math.distanceSqu(entity.x, entity.y, target.x, target.y) > minDistance * minDistance)
    {
        const dx = target.x - entity.x;
        const dy = target.y - entity.y;
        const nextRotation = Math.atan2(dy, dx);
        entity.rotation = nextRotation;
        // Milque.Math.lerp(entity.rotation, nextRotation, entity.rotateSpeed);

        if (entity.has(TAG_FOLLOW))
        {
            entity.x += Math.cos(entity.rotation) * entity.moveSpeed;
            entity.y += Math.sin(entity.rotation) * entity.moveSpeed;
        }
    }
}

function randomizePosition(entity)
{
    entity.x = Math.random() * ctx.canvas.clientWidth;
    entity.y = Math.random() * ctx.canvas.clientHeight;
}

function MainScene()
{
    this.target = { x: 0, y: 0 };
    this.player = Box(0, 0, 16, 16, '#FF0000').tag(TAG_MOVING);
    this.carts = [];
    this.carts.push(BoxCart(this.player));
    this.carts.push(BoxCart(this.carts[this.carts.length - 1]));
    this.carts.push(BoxCart(this.carts[this.carts.length - 1]));
    this.carts.push(BoxCart(this.carts[this.carts.length - 1]));
    this.carts.push(BoxCart(this.carts[this.carts.length - 1]));
    this.carts.push(BoxCart(this.carts[this.carts.length - 1]));
    this.carts.push(BoxCart(this.carts[this.carts.length - 1]));

    BoxGoods();
    BoxGoods();
    BoxGoods();
    BoxGoods();
    BoxGoods();
    BoxGoods();
    BoxGoods();

    Milque.Game.on('update', (dt) => {
        if (pointer.down)
        {
            this.target.x = pointer.x;
            this.target.y = pointer.y;
        }

        follow(this.player, this.target, 8);

        for(const entity of Milque.Entity.entities(TAG_GOODS))
        {
            if (Milque.Math.distanceSqu(entity.x, entity.y, this.player.x, this.player.y) < 128)
            {
                entity.destroy();
            }
        }

        for(const entity of Milque.Entity.entities(TAG_MOVING))
        {
            entity.x += Math.cos(entity.rotation) * entity.moveSpeed;
            entity.y += Math.sin(entity.rotation) * entity.moveSpeed;
        }

        for(const entity of Milque.Entity.entities(TAG_BOX_CART))
        {
            if (entity.parent)
            {
                follow(entity, entity.parent, 20);
            }
        }
    });

    Milque.Game.on('update', (dt) => {
        ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

        for(const entity of Milque.Entity.entities(TAG_BOX))
        {
            ctx.fillStyle = entity.color;
            ctx.fillRect(entity.x - entity.width / 2, entity.y - entity.height / 2, entity.width, entity.height);
        }
    });
}

// TODO: This should be called automatically in the future...
MainScene();

Milque.play();