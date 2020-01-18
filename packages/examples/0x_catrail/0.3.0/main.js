import * as Game from './util/Game.js';

import { SplashScene } from './SplashScene.js';
import * as MostNaiveTileScene from './MostNaiveTileScene.js';
import * as NaiveTileScene from './NaiveTileScene.js';
import * as EditableTileScene from './EditableTileScene.js';

Game.registerScene('0', new SplashScene('Powered by Milque.js', 'most'));

Game.registerScene('most', MostNaiveTileScene);
Game.registerScene('naive', NaiveTileScene);
Game.registerScene('editable', EditableTileScene);

Game.start('0');
