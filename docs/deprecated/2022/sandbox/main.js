import '@milque/display';
import '@milque/input';
import './error.js';

import { AssetManager, cacheAssetPackAsRaw, ImageLoader } from '@milque/asset';
import { AssetPipeline } from './loader/AssetPipeline.js';

import { Game } from './game/Game.js';
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
import { main as Moonset } from './046/main.js';
// eslint-disable-next-line no-unused-vars
import { main as Starfield } from './047/main.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 */

window.addEventListener('DOMContentLoaded', main);
async function main() {
  /** @type {DisplayPort} */
  const display = document.querySelector('#display');
  /** @type {InputContext} */
  const inputs = /** @type {import('@milque/input').InputPort} */ (document.querySelector('#inputs')).getContext('axisbutton');
  const assets = new AssetManager();
  const pipeline = new AssetPipeline(assets);
  await cacheAssetPackAsRaw(assets, 'res.pack', (src, uri, path) => assets.cache('res/' + path, src));
  await pipeline.pipe('res/**/*.md', async (assetData, uri) =>
    this.asset.cache('txt:' + uri.substring(4), await loadText(assetData))
  );
  await pipeline.pipe('res/**/*.txt', async (assetData, uri) =>
    this.asset.cache('txt:' + uri.substring(4), await loadText(assetData))
  );
  await pipeline.pipe('res/**/*.png', async (assetData, uri) =>
    this.asset.cache(
      'image:' + uri.substring(4),
      await ImageLoader(assetData, { imageType: 'image/png' }),
    )
  );
  await pipeline.pipe('res/**/*.obj', async (assetData, uri) =>
    this.asset.cache('obj:' + uri.substring(4), await loadOBJ(assetData))
  );
  await pipeline.pipe('res/**/*.atlas', async (assetData, uri) =>
    this.asset.cache('atlas:' + uri.substring(4), await loadAtlas(assetData))
  );
  await pipeline.pipe('res/**/*.fnt', async (assetData, uri) =>
    this.asset.cache('fnt:' + uri.substring(4), await loadBMFont(assetData))
  );
  await pipeline.pipe('res/**/*.wav', async (assetData, uri) => {
    let audioContext = Sound.getAudioContext();
    let audioBuffer = await loadAudioBuffer(assetData, audioContext);
    let sound = new Sound(audioContext, audioBuffer);
    return this.assets.cache('sound:' + uri.substring(4), sound);
  });

  const game = new Game(display, inputs);
  display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
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
  // await Starfield(game);
}
