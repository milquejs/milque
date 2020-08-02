import { CanvasView, Camera2D } from '../lib.js';
/**
 * It should place using gravity instead of the line algorithm.
 * (if there is no ground, use the other side's gravity).
 * 
 * This way, it behaves more naturally.
 * 
 * Every piece should also be a random color.
 * 
 * What if it's just one direction? instead of all directions?
 * 
 * It just keeps going forever, and maybe biomes slowly develop over
 * time.
 */
document.addEventListener('DOMContentLoaded', main);

const SHAPES = [
    {
        solids: [
            1, 0,
            1, 0,
            1, 1,
        ],
        width: 2,
        height: 3,
    },
    {
        solids: [
            1, 1, 1,
            1, 0, 0,
        ],
        width: 3,
        height: 2,
    },
    {
        solids: [
            1, 1,
            0, 1,
            0, 1,
        ],
        width: 2,
        height: 3,
    },
    {
        solids: [
            0, 0, 1,
            1, 1, 1,
        ],
        width: 3,
        height: 2,
    },
];

function overlapShape(shape, x, y, tilemap, width, height)
{
    const { solids, width: shapeWidth, height: shapeHeight } = shape;
    if (x + shapeWidth >= width) return true;
    if (y + shapeHeight >= height) return true;
    for(let i = 0; i < shapeHeight; ++i)
    {
        for(let j = 0; j < shapeWidth; ++j)
        {
            if (solids[j + i * shapeWidth])
            {
                if (tilemap[(x + j) + (y + i) * width])
                {
                    return true;
                }
            }
        }
    }
    return false;
}

function placeShape(shape, x, y, tilemap, width, height)
{
    const { solids, width: shapeWidth, height: shapeHeight } = shape;
    for(let i = 0; i < shapeHeight; ++i)
    {
        for(let j = 0; j < shapeWidth; ++j)
        {
            if (solids[j + i * shapeWidth])
            {
                tilemap[(x + j) + (y + i) * width] = 1;
            }
        }
    }
}

function drawShape(ctx, shape, x, y, tileSize)
{
    ctx.translate(x * tileSize, y * tileSize);
    {
        const { solids, width: shapeWidth, height: shapeHeight } = shape;
        for(let i = 0; i < shapeHeight; ++i)
        {
            for(let j = 0; j < shapeWidth; ++j)
            {
                if (solids[j + i * shapeWidth])
                {
                    ctx.translate(j * tileSize, i * tileSize);
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, tileSize, tileSize);
                    ctx.translate(-j * tileSize, -i * tileSize);
                }
            }
        }
    }
    ctx.translate(-x * tileSize, -y * tileSize);
}

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');
    
    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const cursorX = input.getInput('cursorX');
    const cursorY = input.getInput('cursorY');
    const activate = input.getInput('activate');
    const rotate = input.getInput('rotate');

    const view = new CanvasView();
    const camera = new Camera2D();
    camera.moveTo(-display.width / 2, -display.height / 2);

    let currentShapeIndex = 0;
    let currentShape = SHAPES[currentShapeIndex];

    const tileSize = 8;
    const width = 17;
    const height = 17;
    const length = width * height;
    let tilemap = new Array(length);
    {
        let i = Math.floor(width / 2) + Math.floor(height / 2) * width;
        tilemap[i] = 1;
        tilemap[i + 1] = 1;
        tilemap[i + width] = 1;
        tilemap[i + width + 1] = 1;
        tilemap[i + width - 1] = 1;
        tilemap[i - 1] = 1;
        tilemap[i - width] = 1;
        tilemap[i - width - 1] = 1;
        tilemap[i - width + 1] = 1;
    }

    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;

        if (rotate.value)
        {
            ++currentShapeIndex;
            if (currentShapeIndex >= SHAPES.length)
            {
                currentShapeIndex = 0;
            }
            currentShape = SHAPES[currentShapeIndex];
        }

        let [cursorPosX, cursorPosY] = Camera2D.screenToWorld(cursorX * display.width, cursorY * display.height, camera.getViewMatrix(), camera.getProjectionMatrix());
        cursorPosX -= tileSize / 2;
        cursorPosY -= tileSize / 2;

        const cursorTileX = (Math.floor(cursorPosX / tileSize) + 0.5) * tileSize;
        const cursorTileY = (Math.floor(cursorPosY / tileSize) + 0.5) * tileSize;
        
        ctx.clearRect(0, 0, display.width, display.height);
        view.begin(ctx, camera.getViewMatrix(), camera.getProjectionMatrix());
        {
            let place = false;
            let placeX = 0;
            let placeY = 0;
            let prev = false;
            let prevX;
            let prevY;
            discreteLine(Math.ceil(cursorTileX / tileSize), Math.ceil(cursorTileY / tileSize), 0, 0, (x, y) =>
            {
                ctx.fillStyle = 'gray';
                if (!place)
                {
                    let tw = Math.floor(width / 2);
                    let th = Math.floor(height / 2);
                    let tx = Math.min(width, Math.max(0, x + tw));
                    let ty = Math.min(height, Math.max(0, y + th));
                    let ti = tx + ty * width;

                    let canPlace = !overlapShape(currentShape, tx, ty, tilemap, width, height);
                    if (canPlace)
                    {
                        prevX = tx;
                        prevY = ty;
                        prev = true;
                    }
                    else if (prev)
                    {
                        placeX = prevX;
                        placeY = prevY;
                        place = true;
                    }
                }

                ctx.translate(x * tileSize, y * tileSize);
                ctx.fillRect(-tileSize / 2, -tileSize / 2, tileSize, tileSize);
                ctx.translate(-x * tileSize, -y * tileSize);
            });
    
            if (activate.value)
            {
                placeShape(currentShape, placeX, placeY, tilemap, width, height);
            }
            else if (place)
            {
                let tw = Math.floor(width / 2);
                let th = Math.floor(height / 2);
                drawShape(ctx, currentShape, placeX - tw - 0.5, placeY - th - 0.5, tileSize);
            }

            let tw = (width / 2) * tileSize;
            let th = (height / 2) * tileSize;
            ctx.translate(-tw, -th);
            for(let y = 0; y < height; ++y)
            {
                for(let x = 0; x < width; ++x)
                {
                    let i = x + y * width;
                    let tile = tilemap[i];
                    if (tile > 0)
                    {
                        let tx = tileSize * x;
                        let ty = tileSize * y;
                        ctx.translate(tx, ty);
                        ctx.fillStyle = getColor(tile);
                        ctx.fillRect(0, 0, tileSize, tileSize);
                        ctx.translate(-tx, -ty);
                    }
                }
            }
            ctx.translate(tw, th);

            ctx.fillStyle = 'black';
            ctx.fillRect(-tileSize / 2, -tileSize / 2, tileSize, tileSize);

            ctx.translate(cursorTileX, cursorTileY);
            ctx.fillStyle = 'blue';
            ctx.fillRect(0, 0, tileSize, tileSize);
            ctx.translate(-cursorTileX, -cursorTileY);
        }
        view.end(ctx);
    });
}

function getColor(tile)
{
    switch(tile)
    {
        case 0: return 'none';
        case 1: return 'dodgerblue';
        case 2: return 'navyblue';
        case 3: return 'saddlebrown';
        case 4: return 'gold';
        case 5: return 'orange';
        default: return 'green';
    }
}

// Bresenham's Line Algorithm
export function discreteLine(fromX, fromY, toX, toY, callback)
{
    let fx = Math.floor(fromX);
    let fy = Math.floor(fromY);
    let tx = Math.floor(toX);
    let ty = Math.floor(toY);

    let dx = Math.abs(toX - fromX);
    let sx = fromX < toX ? 1 : -1;
    let dy = -Math.abs(toY - fromY);
    let sy = fromY < toY ? 1 : -1;
    let er = dx + dy;

    let x = fx;
    let y = fy;
    callback(x, y);
    
    let maxLength = dx * dx + dy * dy;
    let length = 0;
    while(length < maxLength && (x !== tx || y !== ty))
    {
        // Make sure it doesn't go overboard.
        ++length;

        let er2 = er * 2;

        if (er2 >= dy)
        {
            er += dy;
            x += sx;
        }

        if (er2 <= dx)
        {
            er += dx;
            y += sy;
        }

        callback(x, y);
    }
}
