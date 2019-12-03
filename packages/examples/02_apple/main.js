const CANVAS = document.createElement('canvas');
const CTX = CANVAS.getContext('2d');
document.body.appendChild(CANVAS);
let prevFrameTime;

function main()
{
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    load();
    run(prevFrameTime = performance.now());
}

function run(now)
{
    requestAnimationFrame(run);
    const dt = now - prevFrameTime;
    update(dt);
    render(CTX);
}

const GRAVITY = 0.1;
const MAX_VELOCITY_X = 1;
const MAX_VELOCITY_Y = 1;

const PLAYER_FRICTION_X = 0.1;
const TILE_SIZE = 16;

let world = {};

function BoxFactory(entity, x, y, w, h)
{
    return Object.assign(entity, {
        x, y,
        width: w, height: h
    });
}

function load()
{
    world.input = {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
    };
    world.player = {
        x: 0, y: 0,
        dx: 0, dy: 0
    };

    world.tilemap = {
        tiles: new Array(16 * 8),
        width: 16,
        height: 8,
    };
    for(let i = 0; i < world.tilemap.tiles.length; ++i)
    {
        world.tilemap.tiles[i] = Math.round(Math.random());
    }
}

function update(dt)
{
    const hmoveControl = world.input.right - world.input.left;
    const vmoveControl = world.input.down - world.input.up;
    world.player.dx += hmoveControl;
    world.player.dy += vmoveControl;
    world.player.dx *= 1 - PLAYER_FRICTION_X;

    // applyCollisionResolution(world, world.player);
    applyGravity(world, world.player, GRAVITY);
    applyMotion(world, world.player);
}

function render(ctx)
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);

    // TileMap
    drawTileMap(ctx, 0, 0, world.tilemap);

    // Player
    drawBox(ctx, world.player.x, world.player.y);
}

function testRectangleIntersection(a, b)
{

}

function applyCollisionResolution(world, entity)
{

}

function applyGravity(world, entity, gravity)
{
    entity.dy += gravity;
}

function applyMotion(world, entity)
{
    if (entity.dx > MAX_VELOCITY_X) entity.dx = MAX_VELOCITY_X;
    if (entity.dx < -MAX_VELOCITY_X) entity.dx = -MAX_VELOCITY_X;
    if (entity.dy > MAX_VELOCITY_Y) entity.dy = MAX_VELOCITY_Y;
    if (entity.dy < -MAX_VELOCITY_Y) entity.dy = -MAX_VELOCITY_Y;
    entity.x += entity.dx;
    entity.y += entity.dy;
}

function drawTileMap(ctx, offsetX, offsetY, tilemap)
{
    ctx.translate(offsetX, offsetY);
    for(let x = 0; x < tilemap.width; ++x)
    {
        for(let y = 0; y < tilemap.height; ++y)
        {
            ctx.fillStyle = 'slategray';
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1);
        }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawBox(ctx, x = 0, y = 0, rotation = 0, width = 16, height = 16, color = 'white')
{
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function onKeyDown(e)
{
    switch(e.key)
    {
        case 'ArrowUp':
        case 'w':
            world.input.up = 1;
            break;
        case 'ArrowDown':
        case 's':
            world.input.down = 1;
            break;
        case 'ArrowLeft':
        case 'a':
            world.input.left = 1;
            break;
        case 'ArrowRight':
        case 'd':
            world.input.right = 1;
            break;
        default:
            console.log(e.key);
    }
}

function onKeyUp(e)
{
    switch(e.key)
    {
        case 'ArrowUp':
        case 'w':
            world.input.up = 0;
            break;
        case 'ArrowDown':
        case 's':
            world.input.down = 0;
            break;
        case 'ArrowLeft':
        case 'a':
            world.input.left = 0;
            break;
        case 'ArrowRight':
        case 'd':
            world.input.right = 0;
            break;
        default:
            console.log(e.key);
    }
}

main();