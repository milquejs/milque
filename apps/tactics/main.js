import { Mouse } from '../../packages/input/src/index.js';
import * as Camera from './Camera.js';
import * as Sprite from './Sprite.js';
import * as Loader from './Loader.js';
import { Mask } from './Mask.js';
import { GameObjectManager } from './GameObject.js';
import * as TileMap from './TileMap.js';

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

    let camera = createCamera();
    let mouse = new Mouse(display.canvas);

    let world = {
        position: [0, 0],
        gameObjects: new GameObjectManager(),
        sprite: assets.sprites.necromancer_idle_anim,
        mask: new Mask(16, 16),
    };

    let tileMap;
    if (localStorage.getItem('tilemap'))
    {
        let tileMapData = JSON.parse(localStorage.getItem('tilemap'));
        tileMap = TileMap.loadTileMap(tileMapData);
    }
    else
    {
        tileMap = TileMap.createTileMap(16, 16, 1);
        let data = TileMap.saveTileMap(tileMap);
        localStorage.setItem('tilemap', JSON.stringify(data));
    }
    
    display.addEventListener('frame', e => {
        let dt = e.detail.deltaTime / 60;
        let ctx = e.detail.canvasContext;

        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, display.width, display.height);
        
        mouse.poll();
        world.sprite.update(dt);

        let width = display.width;
        let height = display.height;

        const viewMatrix = camera.viewMatrix;
        const projectionMatrix = camera.projectionMatrix;

        Camera.drawWorldGrid(ctx, width, height, camera.viewMatrix, camera.projectionMatrix);

        ctx.save();
        {
            ctx.setTransform(new DOMMatrix(camera.viewMatrix));
            drawTileMap(ctx, tileMap);

            let x = 54;
            let y = 54;
            drawSprite(ctx, world.sprite, x, y, 16, 16);
            drawMask(ctx, world.mask, x, y);
        }
        ctx.restore();

        Camera.drawWorldTransformGizmo(ctx, width, height, camera.viewMatrix, camera.projectionMatrix);

        ctx.fillStyle = 'white';
        ctx.fillRect(mouse.x * width - 32, mouse.y * height - 32, 64, 64);
        if (mouse.left.state) {
            camera.lookAt(mouse.x * width, mouse.y * height, 0, 1);
        }
    });
}

function drawMask(ctx, mask, offsetX = 0, offsetY = 0)
{
    ctx.strokeStyle = 'lime';
    ctx.strokeRect(mask.offset.x + offsetX, mask.offset.y + offsetY, mask.width, mask.height);
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
