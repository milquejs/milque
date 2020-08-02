import * as AssetStorage from './AssetStorage.js';
import { Logger, Camera2D, CanvasView } from './lib.js';

import { CameraPan } from './CameraPan.js';

Logger.useDefaultDomain('peermap')
    .useDefaultLevel(Logger.TRACE);

const LOGGER = Logger.getLogger('MainApplication');
LOGGER.info('Starting application...');

const display = document.querySelector('display-port');
const canvas = display.canvas;
const context = canvas.getContext('2d');
const input = document.querySelector('input-context');

const pointerX = input.getInput('pointerX');
const pointerY = input.getInput('pointerY');
const grabbing = input.getInput('grabbing');

async function main()
{
    let view = new CanvasView();
    let camera = new Camera2D();
    let image = await AssetStorage.getImage('dungeon');

    let panner = new CameraPan();
    let tokens = [
        { x: 0, y: 0 },
        { x: 100, y: 100 },
    ];
    
    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 60;
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        
        let screenX = pointerX.value * display.width - display.width / 2;
        let screenY = pointerY.value * display.height - display.height / 2;

        panner.update(dt, camera, screenX, screenY, grabbing.value);

        let viewMatrix = camera.getViewMatrix();
        let projectionMatrix = camera.getProjectionMatrix();
        view.begin(context, viewMatrix, projectionMatrix);
        {
            context.drawImage(image, 0, 0);
            for(let token of tokens)
            {
                context.fillStyle = 'blue';
                context.fillRect(token.x, token.y, 16, 16);
            }
        }
        view.end(context);
    });
}

main();
