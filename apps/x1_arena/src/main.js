import '@milque/display';
import '@milque/input';

window.addEventListener('DOMContentLoaded', main);

const MAP_WIDTH = 8;
const MAP_HEIGHT = 8;
const MAP_LENGTH = MAP_WIDTH * MAP_HEIGHT;

const TILE_PIXEL_WIDTH = 16;
const TILE_PIXEL_HEIGHT = 16;
const HALF_TILE_PIXEL_WIDTH = TILE_PIXEL_WIDTH / 2;
const HALF_TILE_PIXEL_HEIGHT = TILE_PIXEL_HEIGHT / 2;

const UNIT_TOKEN_PIXEL_WIDTH = TILE_PIXEL_WIDTH - 4;
const UNIT_TOKEN_PIXEL_HEIGHT = TILE_PIXEL_HEIGHT - 4;
const HALF_UNIT_TOKEN_PIXEL_WIDTH = UNIT_TOKEN_PIXEL_WIDTH / 2;
const HALF_UNIT_TOKEN_PIXEL_HEIGHT = UNIT_TOKEN_PIXEL_HEIGHT / 2;

const MAP_PIXEL_WIDTH = MAP_WIDTH * TILE_PIXEL_WIDTH;
const MAP_PIXEL_HEIGHT = MAP_HEIGHT * TILE_PIXEL_HEIGHT;
const HALF_MAP_PIXEL_WIDTH = MAP_PIXEL_WIDTH / 2;
const HALF_MAP_PIXEL_HEIGHT = MAP_PIXEL_HEIGHT / 2;

async function main()
{
    const display = document.querySelector('#main');
    const input = document.querySelector('#mainInput');
    const ctx = display.canvas.getContext('2d');

    const localPlayer = { x: 0, y: 0 };
    const tokens = [
        localPlayer,
        { x: 16, y: 16 },
    ];
    const grid = new Uint8Array(MAP_LENGTH);

    display.addEventListener('frame', ({ deltaTime }) => {
        input.source.poll();

        const displayWidth = display.width;
        const displayHeight = display.height;
        const halfDisplayWidth = displayWidth / 2;
        const halfDisplayHeight = displayHeight / 2;
        
        const PointerX = input.context.getInputValue('PointerX');
        const PointerY = input.context.getInputValue('PointerY');

        // localPlayer.x = (PointerX * displayWidth) - halfDisplayWidth + HALF_MAP_PIXEL_WIDTH - HALF_TILE_PIXEL_WIDTH;
        // localPlayer.y = (PointerY * displayHeight) - halfDisplayHeight + HALF_MAP_PIXEL_HEIGHT - HALF_TILE_PIXEL_HEIGHT;
        
        ctx.translate(halfDisplayWidth, halfDisplayHeight);
        {
            ctx.translate(-HALF_MAP_PIXEL_WIDTH, -HALF_MAP_PIXEL_HEIGHT);
            {
                renderTileMap(ctx, grid);
    
                ctx.translate(HALF_TILE_PIXEL_WIDTH, HALF_TILE_PIXEL_HEIGHT);
                {
                    for(let token of tokens)
                    {
                        const { x, y } = token;
                        let pixelX = Math.floor(x);
                        let pixelY = Math.floor(y);
                        ctx.translate(pixelX, pixelY);
                        renderToken(ctx, token);
                        ctx.translate(-pixelX, -pixelY);
                    }
                }
                ctx.translate(-HALF_TILE_PIXEL_WIDTH, -HALF_TILE_PIXEL_HEIGHT);
            }
            ctx.translate(HALF_MAP_PIXEL_WIDTH, HALF_MAP_PIXEL_HEIGHT);
        }
        ctx.translate(-halfDisplayWidth, -halfDisplayHeight);
    });
}

function renderTileMap(ctx, mapData)
{
    for(let i = 0; i < MAP_HEIGHT; ++i)
    {
        for(let j = 0; j < MAP_WIDTH; ++j)
        {
            let x = j * TILE_PIXEL_WIDTH;
            let y = i * TILE_PIXEL_HEIGHT;
            ctx.translate(x, y);
            {
                renderTile(ctx, i, j, 0);
            }
            ctx.translate(-x, -y);
        }
    }
}

function renderTile(ctx, tileX, tileY, tileZ)
{
    if (tileX % 2 === tileY % 2)
    {
        ctx.fillStyle = 'gray';
    }
    else
    {
        ctx.fillStyle = 'white';
    }
    ctx.fillRect(0, 0, TILE_PIXEL_WIDTH, TILE_PIXEL_HEIGHT);
}

function renderToken(ctx, token)
{
    const { renderType } = token;
    switch(renderType)
    {
        case 'decorSmall':
        default:
            ctx.fillStyle = 'blue';
            ctx.fillRect(
                -HALF_UNIT_TOKEN_PIXEL_WIDTH,
                -HALF_UNIT_TOKEN_PIXEL_HEIGHT,
                UNIT_TOKEN_PIXEL_WIDTH,
                UNIT_TOKEN_PIXEL_HEIGHT);
            break;
    }
}
