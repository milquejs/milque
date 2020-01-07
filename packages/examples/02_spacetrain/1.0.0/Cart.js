import { Utils } from './milque.js';

export const CART_SPEED = 0.1;
export const CART_ROT_SPEED = 0.2;

export async function load(assets)
{
    
}

export function create(world, x = 0, y = 0, target = null)
{
    let result = {
        x,
        y,
        rotation: 0,
        target
    };
    world.carts.push(result);
    return result;
}

export function createSequence(world, head = null, amount = 1)
{
    let result = [];
    let prev = head;
    let x = prev ? prev.x : 0;
    let y = prev ? prev.y : 0;
    for(; amount > 0; --amount)
    {
        prev = create(world, x, y, prev);
        result.push(prev);
    }
    return result;
}

export function onPreUpdate(dt, world, entities)
{

}

export function onUpdate(dt, world, entities)
{
    for(let cart of entities)
    {
        let target = cart.target;
        if (!target) continue;

        let dx = target.x - cart.x;
        let dy = target.y - cart.y;
        let length = Math.sqrt(dx * dx + dy * dy);
        if (length > 16)
        {
            cart.x = Utils.lerp(cart.x, target.x, CART_SPEED);
            cart.y = Utils.lerp(cart.y, target.y, CART_SPEED);
            cart.rotation = Utils.lookAt2D(cart.rotation, Math.atan2(dy, dx), CART_ROT_SPEED);
        }
    }
}

export function onPostUpdate(dt, world, entities)
{
    
}

export function onRender(view, world, entities)
{
    let ctx = view.context;
    for(let cart of entities)
    {
        Utils.drawBox(ctx, cart.x, cart.y, cart.rotation, 16, 16, 'yellow');
    }
}

export function destroy(world, entity)
{
    world.carts.splice(world.carts.indexOf(entity), 1);
}

export function unload(assets)
{

}
