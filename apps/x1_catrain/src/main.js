import { CanvasView2D } from 'milque';

import { World } from './World.js';

import { InputSource } from './input/source/InputSource.js';
import { InputContext } from './input/InputContext.js';
import INPUT_MAP from './assets/input.json';

import { EntityManager } from './entity/EntityManager.js';
import { GameObject } from './entity/GameObject.js';

import { Transform } from './systems/Transform.js';

import { CollisionSystem } from './systems/CollisionSystem.js';
import { CollisionMask } from './systems/CollisionMask.js';
import { Collidable } from './systems/Collidable.js';
import { MotionSystem } from './systems/MotionSystem.js';
import { Motion } from './systems/Motion.js';
import { GameObjectSystem } from './systems/GameObjectSystem.js';

import { createWall } from './Wall.js';
import { Player } from './Player.js';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const ctx = display.canvas.getContext('2d');
    const inputSource = InputSource.from(display);
    const input = new InputContext()
        .setInputMap(INPUT_MAP)
        .attach(inputSource);
    const view = new CanvasView2D(display);

    const entityManager = new EntityManager({ strictMode: true })
        .register('Player')
        .register('Wall')
        .register(Collidable)
        .register(GameObject)
        .register(Transform)
        .register(Motion)
        .register(CollisionMask);

    const systems = {
        motion: new MotionSystem(entityManager),
        collision: new CollisionSystem(entityManager),
        gameObject: new GameObjectSystem(entityManager),
    };

    const player = new Player(entityManager, input, view);
    createWall(entityManager, -100, 0, 100, 8);
    createWall(entityManager, -100, 8, -100 + 16, 100);
    createWall(entityManager, 100 - 16, 8, 100, 100);

    const world = World.provide({
        display,
        input,
        view,
        entityManager,
        player,
        systems,
    });

    display.addEventListener('frame', ({ detail: { deltaTime } }) => {
        const dt = deltaTime / 1000;
        inputSource.poll();

        updateWorld(dt, world);
        renderWorld(ctx, world);
    });
}

function updateWorld(dt, world)
{
    const { systems } = world;
    for(let system of Object.values(systems))
    {
        if ('update' in system)
        {
            system.update(dt);
        }
    }
}

function renderWorld(ctx, world)
{
    const { systems, view } = world;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    view.transformCanvas(ctx);
    {
        for(let system of Object.values(systems))
        {
            if ('render' in system)
            {
                system.render(ctx);
            }
        }
    }
    ctx.setTransform();
}
