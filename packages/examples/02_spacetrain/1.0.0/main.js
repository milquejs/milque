import { GameLoop, Input, Display, Utils } from './milque.js';

import * as Views from './Views.js';
import * as Cart from './Cart.js';
import * as Player from './Player.js';
import * as Planet from './Planet.js';

const entityClasses = {
    carts: Cart,
    players: Player,
    planets: Planet,
};

function start()
{
    for(let [key, entityClass] of Object.entries(entityClasses))
    {
        this[key] = [];
    }

    this.player = Player.create(this);
    Cart.createSequence(this, this.player, 4);
    Planet.create(this, 100, 100);
}

function update(dt)
{
    for(let [key, entityClass] of Object.entries(entityClasses))
    {
        if ('onPreUpdate' in entityClass)
        {
            entityClass.onPreUpdate(dt, this, this[key]);
        }
    }

    Input.poll();

    for(let [key, entityClass] of Object.entries(entityClasses))
    {
        if ('onUpdate' in entityClass)
        {
            entityClass.onUpdate(dt, this, this[key]);
        }
    }

    for(let [key, entityClass] of Object.entries(entityClasses))
    {
        if ('onPostUpdate' in entityClass)
        {
            entityClass.onPostUpdate(dt, this, this[key]);
        }
    }

    this.render(Views.WORLD_VIEW);
}

function render(view)
{
    let ctx = view.context;
    Utils.clearScreen(ctx, view.width, view.height);
    {
        for(let [key, entityClass] of Object.entries(entityClasses))
        {
            if ('onRender' in entityClass)
            {
                entityClass.onRender(view, this, this[key]);
            }
        }
    }
    Display.drawBufferToScreen(ctx);
}

let loaders = [];
for(let [key, entityClass] of Object.entries(entityClasses))
{
    if ('load' in entityClass)
    {
        loaders.push(entityClass.load());
    }
}
Promise.all(loaders).then(() => {
    GameLoop.start({ start, update, render });
});
