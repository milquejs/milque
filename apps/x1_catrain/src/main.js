import { AxisAlignedBoundingBoxGraph, CanvasView2D } from 'milque';

import { World } from './World.js';

import { InputSource } from './input/source/InputSource.js';
import { InputContext } from './input/InputContext.js';
import INPUT_MAP from './assets/input.json';

import { EntityManager } from './entity/EntityManager.js';
import { GameObject } from './entity/GameObject.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { CollisionMask } from './systems/CollisionMask.js';
import { Collidable } from './systems/Collidable.js';

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

    const entityManager = new EntityManager({
        components: [
            'Player',
            Collidable,
            CollisionMask,
            GameObject,
        ],
        strictMode: true,
    });
    const aabbGraph = new AxisAlignedBoundingBoxGraph();

    const systems = {
        collision: new CollisionSystem(entityManager, aabbGraph),
    };

    const player = new GameObject(
        entityManager,
        ['Player', CollisionMask],
        { x: 0, y: 0 })
        .on('create', entity => {});
    
    const world = World.provide({
        display,
        input,
        view,
        entityManager,
        player,
        systems,
        aabbGraph,
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
    const { input, player, view } = world;
    
    const moveSpeed = 50;
    let dx = input.getInputValue('MoveRight') - input.getInputValue('MoveLeft');
    let dy = input.getInputValue('MoveDown') - input.getInputValue('MoveUp');
    player.x += dx * dt * moveSpeed;
    player.y += dy * dt * moveSpeed;
    view.camera.moveTo(player.x, player.y, 0, dt);

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

        const { player } = world;
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, 16, 16);
    }
    ctx.setTransform();
}
