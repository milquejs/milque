/**
 * Inspired by Game Maker Tutorials.
 * This uses the basic set of Milque tools. In theory, all future
 * versions should still be able to support this.
 */

Milque.Display.attach(document.getElementById('display1'));
const ctx = Milque.Display.VIEW.canvas.getContext('2d');

const Center = {
    get x() { return Milque.Display.width() / 2; },
    get y() { return Milque.Display.height() / 2; }
};

function Transform(x = 0, y = 0, rotation = 0, scale = 1, parent = null)
{
    return {
        _x: x,
        _y: y,
        _rotation: rotation,
        _scale: scale,
        parent,
        get x()
        {
            return this.parent ? this.parent.x + this._x : this._x;
        },
        set x(value)
        {
            this._x = this.parent ? value - this.parent.x : value;
        },
        get y()
        {
            return this.parent ? this.parent.y + this._y : this._y;
        },
        set y(value)
        {
            this._y = this.parent ? value - this.parent.y : value;
        },
        get rotation()
        {
            return this.parent ? this.parent.rotation + this._rotation : this._rotation;
        },
        get scale()
        {
            return this.parent ? this.parent.scale + this._scale : this._scale;
        }
    };
}

function Motion(dx = 0, dy = 0)
{
    return { dx, dy };
}

function Box(x = 0, y = 0, width = 16, height = width, parent = null)
{
    const entity = Milque.Entity.spawn()
        .component(Transform, x, y, 0, 1, parent)
        .component(Motion, 0, 0);
    entity.width = width;
    entity.height = height;
    return entity;
}

function MainScene()
{
    this.moveUp = Milque.Input.State('moveup', 'key[w]');
    this.moveDown = Milque.Input.State('movedown', 'key[s]');
    this.moveLeft = Milque.Input.State('moveleft', 'key[a]');
    this.moveRight = Milque.Input.State('moveright', 'key[d]');

    this.player = Box(Center.x, Center.y);
    this.gun = Box(8, 0, 4, 8, this.player);
    
    Milque.Game.on('update', () => {
        Milque.Display.clear();

        if (this.moveUp.get()) this.player.dy -= 1;
        if (this.moveDown.get()) this.player.dy += 1;
        if (this.moveLeft.get()) this.player.dx -= 1;
        if (this.moveRight.get()) this.player.dx += 1;
    
        this.player.x += this.player.dx;
        this.player.y += this.player.dy;

        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > Milque.Display.width()) this.player.x = Milque.Display.width();
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y > Milque.Display.height()) this.player.y = Milque.Display.height();

        this.player.dx *= 0.8;
        this.player.dy *= 0.8;

        ctx.fillStyle = 'red';
        ctx.fillRect(this.player.x - this.player.width / 2, this.player.y - this.player.height / 2, this.player.width, this.player.height);

        ctx.fillStyle = 'green';
        ctx.fillRect(this.gun.x - this.gun.width / 2, this.gun.y - this.gun.height / 2, this.gun.width, this.gun.height);
    });
}

// TODO: This should be called automatically in the future...
MainScene();

Milque.play();