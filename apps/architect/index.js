import { Loop } from './Loop.js';
import { Keyboard } from '../../packages/input/src/index.js';
import { GameObject } from './GameObject.js';

const display = document.querySelector('display-port');
const canvas = display.getCanvas();
const ctx = display.getContext();
const loop = new Loop()
    .on('fixed', fixedUpdate)
    .on('step', update)
    .on('early', render);
const keyboard = new Keyboard().setEventTarget(document);
const inputState = {
    value: {},
    event: {},
};
const inputMap = {
    'left.1': 'keyboard[a].down',
    'left.0': 'keyboard[a].up',
    'up': 'keyboard[w].down',
    'down': 'keyboard[s].down',
    'right': 'keyboard[d].down',
};
let worldState = {
    objects: [],
    inputState: {
        value: {},
        next: {},
    }
};
keyboard.addEventHandler((source, code, event, value) => {
    worldState.inputState.next[source + '[' + code + '].' + event] = value;
});

class Player extends GameObject
{
    onUpdate(world, dt)
    {
        if (world.inputState.value[inputMap.left])
        {
            this.moveLeft = true;
        }
        if (world.inputState.value[inputMap.right])
        {
            this.x += 1;
        }

        if (this.moveLeft)
        {
            this.x -= 1;
        }
    }

    onDraw(world, ctx)
    {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, 16, 16);
    }
}

function main()
{
    worldState.objects.push(new Player());
    loop.start();
}

function update(dt)
{
    poll(worldState.inputState);

    for(let object of worldState.objects)
    {
        object.onUpdate(worldState, dt);
    }
}

function fixedUpdate()
{
    for(let object of worldState.objects)
    {
        object.onFixedUpdate(worldState, ctx);
    }
}

function poll(inputState)
{
    let { value, next } = inputState;
    for(let key of Object.keys(next))
    {
        value[key] = next[key];
        next[key] = false;
    }
}

function render()
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let object of worldState.objects)
    {
        ctx.save();
        object.onDraw(worldState, ctx);
        ctx.restore();
    }
}

main();
