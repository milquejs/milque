Milque.Display.attach(document.getElementById('display1'));
const ctx = Milque.Display.VIEW.canvas.getContext('2d');

Milque.Collision.COLLISION_MANAGER.addCircle(100, 200, 16);

Milque.Game.on('update', () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, Milque.Display.width(), Milque.Display.height());

    Milque.Collision.draw();
});

Milque.Game.start();