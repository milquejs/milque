import * as Game from './util/Game.js';

import { SplashScene } from './SplashScene.js';
import * as TileScene from './TileScene.js';

Game.registerScene('0', new SplashScene('Powered by Milque.js', 'tile'));
Game.registerScene('tile', TileScene);

Game.start('0');
