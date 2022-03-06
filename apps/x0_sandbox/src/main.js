import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import { Game } from './game/Game.js';
import { loadImage } from './loader/ImageLoader.js';
import { loadOBJ } from './loader/OBJLoader.js';
import { loadAtlas } from './loader/AtlasLoader.js';
import { loadAudioBuffer } from './loader/AudioBufferLoader.js';
import { loadBMFont } from './loader/BMFontLoader.js';
import { loadText } from './loader/TextLoader.js';
import { Sound } from './audio/Sound.js';

// eslint-disable-next-line no-unused-vars
import { main as Archaea } from './000/main.js';
// eslint-disable-next-line no-unused-vars
import { main as Architect } from './001/main.js';
// eslint-disable-next-line no-unused-vars
import { main as Bioform } from './002/main.js';
// eslint-disable-next-line no-unused-vars
import { main as IsoGame } from './042/main.js';
// eslint-disable-next-line no-unused-vars
import { main as GerryMan } from './043/main.js';
// eslint-disable-next-line no-unused-vars
import { main as BreadBox } from './044/main.js';
// eslint-disable-next-line no-unused-vars
import { main as Miners } from './045/main.js';
// eslint-disable-next-line no-unused-vars
import { main as Moonset } from './046/main.js';

/**
 * @typedef {import('@milque/asset').AssetPack} AssetPack
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 */

window.addEventListener('DOMContentLoaded', main);
async function main()
{
    /** @type {DisplayPort} */
    const display = document.querySelector('#display');
    /** @type {InputContext} */
    const inputs = document.querySelector('#inputs').getContext('axisbutton');
    /** @type {AssetPack} */
    const assets = document.querySelector('#assets');
    let promise = new Promise((resolve, reject) => {
        assets.addEventListener('load', resolve);
        assets.addEventListener('error', reject);
    });
    assets.src = 'res.pack';
    await promise;
    await assets.pipe('res/**/*.md', async (assetData, uri) =>
        assets.cache('txt:' + uri.substring(4), await loadText(assetData)));
    await assets.pipe('res/**/*.txt', async (assetData, uri) =>
        assets.cache('txt:' + uri.substring(4), await loadText(assetData)));
    await assets.pipe('res/**/*.png', async (assetData, uri) =>
        assets.cache('image:' + uri.substring(4), await loadImage(assetData, 'image/png')));
    await assets.pipe('res/**/*.obj', async (assetData, uri) =>
        assets.cache('obj:' + uri.substring(4), await loadOBJ(assetData)));
    await assets.pipe('res/**/*.atlas', async (assetData, uri) =>
        assets.cache('atlas:' + uri.substring(4), await loadAtlas(assetData)));
    await assets.pipe('res/**/*.fnt', async (assetData, uri) =>
        assets.cache('fnt:' + uri.substring(4), await loadBMFont(assetData)));
    await assets.pipe('res/**/*.wav', async (assetData, uri) => {
        let audioContext = Sound.getAudioContext();
        let audioBuffer = await loadAudioBuffer(assetData, audioContext);
        let sound = new Sound(audioContext, audioBuffer);
        return assets.cache('sound:' + uri.substring(4), sound);
    });

    const game = new Game(display, inputs, assets);
    display.addEventListener('frame', (e) => {
        const { deltaTime, prevTime, now } = e.detail;
        game.deltaTime = deltaTime;
        game.prevTime = prevTime;
        game.now = now;
        inputs.poll(now);
        game.emit('frame');
    });

    // await Archaea(game);
    // await Architect(game);
    // await Bioform(game);
    // await IsoGame(game);
    // await BreadBox(game);
    // await GerryMan(game);
    // await Miners(game);
    await Moonset(game);
}
