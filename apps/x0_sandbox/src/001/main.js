import { Keyboard } from '@milque/input';
import { Loop } from './Loop.js';
import { StartRoom } from './content/StartRoom.js';

document.title = 'Architect';

/**
 * @param {import('../game/Game.js').Game} game 
 */
export async function main(game) {
    const display = game.display;
    const canvas = display.canvas;
    const ctx = display.getContext();
    const loop = new Loop()
        .on('early', earlyUpdate)
        .on('fixed', fixedUpdate)
        .on('step', update)
        .on('late', lateUpdate);
    const keyboard = new Keyboard(display);
    
    const assets = game.assets;

    let worldState = {
        loop,
        currentRoom: null,
        nextRoom: new StartRoom(),
        inputState: {
            left: 0,
            right: 0,
            up: 0,
            down: 0,
        },
        assets,
    };

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

        inputUpdate();
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

    function inputUpdate() {
        let inputState = worldState.inputState;
        if (keyboard.KeyW.pressed) {
            inputState.up = 1;
        } else if (keyboard.KeyW.released) {
            inputState.up = 0;
        }
        if (keyboard.KeyS.pressed) {
            inputState.down = 1;
        } else if (keyboard.KeyS.released) {
            inputState.down = 0;
        }
        if (keyboard.KeyA.pressed) {
            inputState.left = 1;
        } else if (keyboard.KeyA.released) {
            inputState.left = 0;
        }
        if (keyboard.KeyD.pressed) {
            inputState.right = 1;
        } else if (keyboard.KeyD.released) {
            inputState.right = 0;
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

}
