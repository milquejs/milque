Milque.Display.attach(document.getElementById('display1'));

function Position(x = 0, y = 0)
{
    return { x, y };
}

function MainScene()
{
    const action = Milque.Input.Action('action', 'key[a]:down');
    const state = Milque.Input.State('state', 'key[s]');
    const range = Milque.Input.Range('mousex', 'mouse[pos]:x', 0, 1);

    const player = Milque.Entity.spawn().assign(Position, 16, 16);

    // Dependent on the current view position and world scale.
    // const mouse = Milque.Mouse();

    Milque.Game.on('update', () => {
        const ctx = Milque.Display.VIEW.canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, Milque.Display.width(), Milque.Display.height());

        if (state.get())
        {
            ctx.fillStyle = '#FF0000';
        }
        else
        {
            ctx.fillStyle = '#00FF00';
        }

        for(const entity of Milque.Entity.keys(Position))
        {
            const pos = Milque.Entity.component(entity, Position);
            ctx.fillRect(pos.x, pos.y, 16, 16);
        }
    });
}

// TODO: This should be called by the system later...
MainScene();

Milque.Game.start();