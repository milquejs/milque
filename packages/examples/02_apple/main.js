const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
// canvas.style = 'width: 100%; image-rendering: pixelated;';
document.body.appendChild(canvas);
let prevFrameTime;
let scene;

function main()
{
    scene.load();
    run(prevFrameTime = performance.now());
}

function run(now)
{
    requestAnimationFrame(run);
    let dt = now - prevFrameTime;
    prevFrameTime = now;
    scene.update(dt);
    scene.render(ctx);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const TILE_REGISTRY = new Map();
TILE_REGISTRY.set(0, 'gray');
TILE_REGISTRY.set(1, 'dodgerblue');

const GRAVITY = 1;
const MAX_VELOCITY_Y = 1;

scene = {
    load()
    {
        this.left = 0;
        this.right = 0;
        this.up = 0;
        this.down = 0;

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        this.player = {
            x: canvas.width / 2, y: canvas.height / 2,
            dx: 0, dy: 0,
        };

        this.tileMap = createTileMap(16, 8);
        fillTileMap(this.tileMap, 1);
        strokeTileMap(this.tileMap, 0);
    },
    update(dt)
    {
        const xControl = this.right - this.left;
        const yControl = this.down - this.up;

        // Move the player
        this.player.dx += xControl;
        this.player.dy += yControl;
        this.player.dx *= 0.8;

        // Apply motion to the player
        applyGravity(this.player, GRAVITY, MAX_VELOCITY_Y);
        applyMotion(this.player);
    },
    render(ctx)
    {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // TileMap
        const TILE_SIZE = 16;
        const TILE_OFFSET_X = TILE_SIZE;
        const TILE_OFFSET_Y = TILE_SIZE / 2;
        for(let y = 0; y < this.tileMap.height; ++y)
        {
            for(let x = 0; x < this.tileMap.width; ++x)
            {
                let id = this.tileMap[x + y * this.tileMap.width] || 0;
                ctx.fillStyle = TILE_REGISTRY.get(id);
                ctx.fillRect(TILE_OFFSET_X + x * (TILE_SIZE + 1), TILE_OFFSET_Y + y * (TILE_SIZE + 1), TILE_SIZE, TILE_SIZE);
            }
        }

        // Player
        drawBox(ctx, this.player.x, this.player.y, 0, 16, 16);
    },
    onKeyDown(e)
    {
        switch(e.key)
        {
            case 'ArrowUp':
            case 'w':
                this.up = 1;
                break;
            case 'ArrowDown':
            case 's':
                this.down = 1;
                break;
            case 'ArrowLeft':
            case 'a':
                this.left = 1;
                break;
            case 'ArrowRight':
            case 'd':
                this.right = 1;
                break;
        }
    },
    onKeyUp(e)
    {
        switch(e.key)
        {
            case 'ArrowUp':
            case 'w':
                this.up = 0;
                break;
            case 'ArrowDown':
            case 's':
                this.down = 0;
                break;
            case 'ArrowLeft':
            case 'a':
                this.left = 0;
                break;
            case 'ArrowRight':
            case 'd':
                this.right = 0;
                break;
        }
    }
};

function createCollisionBody()
{
    return {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        radius: 0
    };
}

function findCollisions(collisionBodies)
{
    let dst = [];
    for(let target of collisionBodies)
    {
        for(let other of collisionBodies)
        {
            let result = testIntersection(target, other);
            if (result)
            {
                dst.push(result);
            }
        }
    }
    return dst;
}

function testIntersection(collisionBodyA, collisionBodyB)
{
    switch(collisionBodyA.shape + ':' + collisionBodyB.shape)
    {
        case 'circle:circle':
            return {};
        case 'box:box':
            return {};
        case 'circle:box':
        case 'box:circle':
            return {};
        default:
            throw new Error('Unsupported collision type pair.');
    }
}

function testCircleCircle(a, b)
{
    let dx = (a.x - b.x);
    let dy = (a.y - b.y);
    let dist = Math.sqrt(dx * dx + dy * dy);
    let radius = a.radius + b.radius;
    if (dist <= radius)
    {
        // Find the normal
        let rad = Math.atan2(dy, dx);
        return {
            normal: { x: Math.cos(-rad), y: Math.sin(-rad) },
            delta: (radius - dist) / 2
        };
    }
    else
    {
        return null;
    }
}

function testBoxBox(a, b)
{

}

function testCircleBox(a, b)
{

}

function applyMotion(entity, inverseFriction = 1)
{
    entity.dx *= inverseFriction;
    entity.dy *= inverseFriction;
    entity.x += entity.dx;
    entity.y += entity.dy;
}

function applyGravity(entity, gravity, maxVelocity)
{
    entity.dy += gravity;
    if (entity.dy > maxVelocity) entity.dy = maxVelocity;
}

function drawBox(ctx, x, y, radians, width, height = width, color = 'white')
{
    ctx.translate(x, y);
    ctx.rotate(radians);
    ctx.fillStyle = color;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawCircle(ctx, x, y, radians, radius, color = 'white')
{
    ctx.translate(x, y);
    ctx.rotate(radians);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function createTileMap(width, height = width)
{
    const result = new Array(width * height);
    result.width = width;
    result.height = height;
    return result;
}

function strokeTileMap(tileMap, value, x = 0, y = 0, w = tileMap.width, h = tileMap.height)
{
    const tileMapWidth = tileMap.width;
    for(let i = 0; i < w; ++i)
    {
        tileMap[(x + i) + y * tileMapWidth] = value;
        tileMap[(x + i) + (y + h - 1) * tileMapWidth] = value;
    }
    for(let i = 0; i < h; ++i)
    {
        tileMap[x + (y + i) * tileMapWidth] = value;
        tileMap[(x + w - 1) + (y + i) * tileMapWidth] = value;
    }
}

function fillTileMap(tileMap, value, x = 0, y = 0, w = tileMap.width, h = tileMap.height)
{
    const tileMapWidth = tileMap.width;
    for(let i = 0; i < h; ++i)
    {
        for(let j = 0; j < w; ++j)
        {
            tileMap[(x + j) + (y + i) * tileMapWidth] = value;
        }
    }
}

function forEachTile(tileMap, callback, x = 0, y = 0, w = tileMap.width, h = tileMap.height)
{
    for(let i = 0; i < h; ++i)
    {
        for(let j = 0; j < w; ++j)
        {
            callback.call(null, tileMap, x + j, y + i);
        }
    }
}

function setTile(tileMap, value, x, y)
{
    tileMap[x + y * tileMap.width] = value;
}

function getTile(tileMap, x, y)
{
    return tileMap[x + y * tileMap.width];
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

main();