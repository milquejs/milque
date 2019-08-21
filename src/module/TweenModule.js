import TweenManager from '../tween/TweenManager.js';
import Tween from '../tween/Tween.js';
import * as Easing from '../tween/Easing.js';
import * as Interpolation from '../tween/Interpolation.js';

const TWEEN_MANAGER = new TweenManager();

function create(target, result, delay = 0, duration = undefined)
{
    // In order to start, tween must know at least the target, result, and start delay.
    const tween = new Tween(target).to(result, duration).delay(delay);
    TWEEN_MANAGER.add(tween);
    return tween;
}

export {
    TWEEN_MANAGER,
    Easing,
    Interpolation,
    create
};