import * as DisplayModule from './module/DisplayModule.js';
import * as InputModule from './module/InputModule.js';
import * as EntityModule from './module/EntityModule.js';
import * as TweenModule from './module/TweenModule.js';
import * as MathHelper from './util/MathHelper.js';
import * as ColorHelper from './util/ColorHelper.js';
import * as CollisionModule from './module/CollisionModule.js';
import Eventable from './util/Eventable.js';
import GameLoop from './GameLoop.js';

const GAME_LOOP = new GameLoop();
GAME_LOOP.on('update', onGameUpdate);

function onGameUpdate()
{
    InputModule.INPUT_MANAGER.poll();
    TweenModule.TWEEN_MANAGER.update();
    CollisionModule.COLLISION_MANAGER.update();
}

export {
    GAME_LOOP as Game,
    DisplayModule as Display,
    InputModule as Input,
    EntityModule as Entity,
    TweenModule as Tween,
    CollisionModule as Collision,
    MathHelper as Math,
    ColorHelper as Color,
    Eventable,
};
