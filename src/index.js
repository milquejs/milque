import * as DisplayModule from './module/DisplayModule.js';
import * as InputModule from './module/InputModule.js';
import * as EntityModule from './module/EntityModule.js';
import * as TweenModule from './module/TweenModule.js';
import * as MathHelper from './util/MathHelper.js';
import * as ColorHelper from './util/ColorHelper.js';
import * as CollisionModule from './module/CollisionModule.js';
import Eventable from './util/Eventable.js';
import GameLoop from './GameLoop.js';

const GAME = Eventable.create();
const GAME_LOOP = new GameLoop();
GAME_LOOP.on('update', onGameUpdate);

function onGameUpdate()
{
    InputModule.INPUT_MANAGER.poll();
    GAME.emit('preupdate');
    CollisionModule.COLLISION_MANAGER.update();
    TweenModule.TWEEN_MANAGER.update();
    GAME.emit('update');
    GAME.emit('postupdate');
}

function play()
{
    GAME_LOOP.start();
}

export {
    GAME as Game,
    DisplayModule as Display,
    InputModule as Input,
    EntityModule as Entity,
    TweenModule as Tween,
    CollisionModule as Collision,
    MathHelper as Math,
    ColorHelper as Color,
    Eventable,
    play
};
