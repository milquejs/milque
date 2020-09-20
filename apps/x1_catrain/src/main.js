import { CanvasView2D } from 'milque';

import { World } from './World.js';

import { InputSource } from './input/source/InputSource.js';
import { InputContext } from './input/InputContext.js';
import INPUT_MAP from './assets/input.json';

import { EntityManager } from './entity/EntityManager.js';
import { Renderable } from './entity/Renderable.js';
import { GameObject } from './entity/GameObject.js';

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

    const entityManager = new EntityManager();

    const player = new GameObject(
        entityManager,
        ['Player', Renderable],
        {
            x: 0,
            y: 0,
        })
        .on('create', entity => {
            entity.get(Renderable).renderType = 'box';
        });

    const world = World.provide({
        display,
        input,
        entityManager,
        view,
        player,
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
}

function renderWorld(ctx, world)
{
    const { view } = world;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    view.transformCanvas(ctx);
    {
        const { player } = world;
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, 16, 16);
    }
    ctx.setTransform();
}
