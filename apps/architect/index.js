import { Keyboard } from '../../packages/input/src/index.js';

import { Loop } from './Loop.js';
import { StartRoom } from './content/StartRoom.js';

const display = document.querySelector('display-port');
const canvas = display.getCanvas();
const ctx = display.getContext();
const loop = new Loop()
    .on('early', earlyUpdate)
    .on('fixed', fixedUpdate)
    .on('step', update)
    .on('late', lateUpdate);
const keyboard = new Keyboard().setEventTarget(document);

let worldState = {
    loop,
    currentRoom: null,
    nextRoom: new StartRoom(),
    inputState: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
    }
};

keyboard.addEventHandler((source, code, event, value) => {
    let inputState = worldState.inputState;
    switch(code)
    {
        case 'w':
            if (event === 'down') inputState.up = 1;
            else if (event === 'up') inputState.up = 0;
            break;
        case 's':
            if (event === 'down') inputState.down = 1;
            else if (event === 'up') inputState.down = 0;
            break;
        case 'a':
            if (event === 'down') inputState.left = 1;
            else if (event === 'up') inputState.left = 0;
            break;
        case 'd':
            if (event === 'down') inputState.right = 1;
            else if (event === 'up') inputState.right = 0;
            break;
    }
});

main();

function main()
{
    loop.start();
}

function earlyUpdate()
{
    if (worldState.nextRoom)
    {
        let nextRoom = worldState.nextRoom;
        worldState.nextRoom = null;

        if (worldState.currentRoom)
        {
            worldState.currentRoom.onDestroy(worldState);
            worldState.currentRoom = null;
        }

        nextRoom.onCreate(worldState);
        worldState.currentRoom = nextRoom;
    }

    if (worldState.currentRoom)
    {
        for(let instance of worldState.currentRoom.getInstances())
        {
            instance.onEarlyUpdate(worldState);
        }
    }
}

function update(dt)
{
    if (worldState.currentRoom)
    {
        for(let instance of worldState.currentRoom.getInstances())
        {
            instance.onUpdate(worldState, dt);
        }
    }
}

function fixedUpdate()
{
    if (worldState.currentRoom)
    {
        for(let instance of worldState.currentRoom.getInstances())
        {
            instance.onFixedUpdate(worldState);
        }
    }
}

function lateUpdate()
{
    render();

    if (worldState.currentRoom)
    {
        for(let instance of worldState.currentRoom.getInstances())
        {
            instance.onLateUpdate(worldState);
        }
    }
}

function render()
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (worldState.currentRoom)
    {
        ctx.save();
        for(let instance of worldState.currentRoom.getInstances())
        {
            instance.onPreDraw(worldState, ctx);
        }
        ctx.restore();

        ctx.save();
        for(let instance of worldState.currentRoom.getInstances())
        {
            instance.onDraw(worldState, ctx);
        }
        ctx.restore();

        ctx.save();
        for(let instance of worldState.currentRoom.getInstances())
        {
            instance.onPostDraw(worldState, ctx);
        }
        ctx.restore();
    }
}
