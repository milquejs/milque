import * as Game from './Game.js';
import * as MenuScene from './MenuScene.js';
import * as MainScene from './MainScene.js';

Game.registerScene('menu', MenuScene);
Game.registerScene('main', MainScene);

Game.start(MenuScene);
