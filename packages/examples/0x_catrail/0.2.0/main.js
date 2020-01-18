import * as Game from './Game.js';

import { SplashScene } from './SplashScene.js';
import * as MenuScene from './MenuScene.js';
import * as MainScene from './MainScene.js';
import * as PlayScene from './PlayScene.js';

Game.registerScene('0', new SplashScene('Powered by Milque.js', 'play'));
Game.registerScene('1', new SplashScene('Created by Andrew Kuo', '2'));
Game.registerScene('2', new SplashScene('15 seconds of logos are fun.', 'main'));
Game.registerScene('main', MainScene);
Game.registerScene('play', PlayScene);

Game.start('0');
