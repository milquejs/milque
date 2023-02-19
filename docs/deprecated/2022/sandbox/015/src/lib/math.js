(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = global || self), factory((global.Maths = {})));
})(this, function (exports) {
  'use strict';

  function clampRange(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function withinRadius(fromX, fromY, toX, toY, radius) {
    const dx = fromX - toX;
    const dy = fromY - toY;
    return dx * dx + dy * dy <= radius * radius;
  }

  function lerp(a, b, dt) {
    return a + (b - a) * dt;
  }

  function distance2(fromX, fromY, toX, toY) {
    let dx = toX - fromX;
    let dy = toY - fromY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function direction2(fromX, fromY, toX, toY) {
    let dx = toX - fromX;
    let dy = toY - fromY;
    return Math.atan2(dy, dx);
  }

  function lookAt2(radians, target, dt) {
    let step = cycleRange(target - radians, -Math.PI, Math.PI);
    return clampRange(radians + step, radians - dt, radians + dt);
  }

  function cycleRange(value, min, max) {
    let range = max - min;
    let result = (value - min) % range;
    if (result < 0) result += range;
    return result + min;
  }

  exports.clampRange = clampRange;
  exports.cycleRange = cycleRange;
  exports.direction2 = direction2;
  exports.distance2 = distance2;
  exports.lerp = lerp;
  exports.lookAt2 = lookAt2;
  exports.withinRadius = withinRadius;

  Object.defineProperty(exports, '__esModule', { value: true });
});
