import { Utils, ViewHelper } from './milque.js';
import { Camera2D } from './Camera2D.js';

import { DefaultEntity, DefaultComponent, Query, World } from './entity/index.js';

export async function load(game)
{
    return new World();
}

export function onStart()
{
    this.camera = new Camera2D();
    this.player = new Player(this);
}

export function onUpdate(dt)
{
    let xControl = Math.random() - 0.5;
    let yControl = Math.random() - 0.5;

    this.player.x += xControl;
    this.player.y += yControl;
}

export function onRender(ctx, view, world)
{
    this.camera.setOffset(view.width / 2, view.height / 2);
    ViewHelper.setViewTransform(view, this.camera);
    {
        Utils.drawBox(ctx, this.player.x, this.player.y);
        for(let entityId of BOXES.select(world))
        {
            let box = world.getComponent(entityId, Box);
            Utils.drawBox(ctx, box.x, box.y);
        }
    }
}

class Position
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
    }
}

class Player extends DefaultEntity
{
    constructor(world)
    {
        super(world);

        this.addComponent(Position);
    }
}

class Box extends DefaultComponent
{
    constructor(world, entityId)
    {
        super(world, entityId);

        this.x = Math.random() * 100;
        this.y = Math.random() * 100;
    }
}

const BOXES = new Query([Box]);
