import { Mouse } from '../../packages/input/src/index.js';
import * as Camera from './Camera.js';
import * as Sprite from './Sprite.js';
import * as Loader from './Loader.js';

window.addEventListener('DOMContentLoaded', () => load().then(main));

let assets = {};

async function load()
{
    assets = await Loader.loadAssets([
        'image:dungeon/dungeon.png',
        'text:dungeon/dungeon.atlas',
    ], '../../res');
    assets.sprites = Sprite.loadSpriteSheet(
        assets['image:dungeon/dungeon.png'],
        assets['text:dungeon/dungeon.atlas']);
}

function main()
{
    const display = document.querySelector('display-port');
    const ctx = display.getContext();

    let camera = createCamera();
    let tileMap = createTileMap(16, 16, 1);
    let mouse = new Mouse(display.canvas);

    let world = {
        position: [0, 0],
        sprite: assets.sprites.necromancer_idle_anim,
    };
    
    display.addEventListener('frame', e => {
        let dt = e.detail.delta / 60;

        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, display.canvas.clientWidth, display.canvas.clientHeight);
        
        mouse.poll();
        world.sprite.update(dt);

        let width = display.canvas.clientWidth;
        let height = display.canvas.clientHeight;

        Camera.drawWorldGrid(ctx, width, height, camera.viewMatrix, camera.projectionMatrix);

        ctx.save();
        {
            ctx.setTransform(new DOMMatrix(camera.viewMatrix));
            drawTileMap(ctx, tileMap);
        }
        ctx.restore();

        drawSprite(ctx, world.sprite, 54, 54, 100, 100);

        Camera.drawWorldTransformGizmo(ctx, width, height, camera.viewMatrix, camera.projectionMatrix);

        if (mouse.left.state) {
            ctx.fillStyle = 'white';
            ctx.fillRect(mouse.x * width - 32, mouse.y * height - 32, 64, 64);
            camera.lookAt(mouse.x * width, mouse.y * height, 0, 1);
        }
    });
}

function drawSprite(ctx, sprite, offsetX = 0, offsetY = 0, width = undefined, height = undefined)
{
    if (sprite.frames.length > 0)
    {
        let frame = sprite.frames[Math.max(0, Math.min(sprite.frameIndex, sprite.frames.length - 1))];
        ctx.drawImage(sprite.texture,
            frame.x, frame.y, sprite.width, sprite.height,
            offsetX, offsetY, width || sprite.width, height || sprite.height);
    }
}

function drawTileMap(ctx, tileMap, offsetX = 0, offsetY = 0, tileWidth = 16, tileHeight = tileWidth)
{
    let i = 0;
    for(let y = 0; y < tileHeight; ++y)
    {
        for(let x = 0; x < tileWidth; ++x)
        {
            if (tileMap.tileData[i])
            {
                ctx.fillStyle = 'saddlebrown';
                ctx.fillRect(offsetX + x * tileWidth, offsetY + y * tileHeight, tileWidth, tileHeight);
            }
            ++i;
        }
    }
}

function lerp(a, b, dt)
{
    return (b - a) * dt + a;
}

function createCamera()
{
    return {
        viewMatrix: [1, 0, 0, 1, 0, 0],
        projectionMatrix: [1, 0, 0, 1, 0, 0],
        lookAt(x, y, z, dt = 1)
        {
            this.viewMatrix[4] = x;
            this.viewMatrix[5] = y;
            return this;
        }
    };
}

function createTileMap(width, height = width, depth = 1)
{
    let tileData = new Array(width * height * depth);
    tileData.fill(0);

    for(let i = 0; i < tileData.length; ++i)
    {
        tileData[i] = Math.floor(Math.random() * 2);
    }

    return {
        width,
        height,
        depth,
        tileData,
    };
}
