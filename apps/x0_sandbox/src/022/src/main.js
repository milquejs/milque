import { CanvasView2D } from 'milque';

import { InputSource } from './input/source/InputSource.js';
import { InputContext } from './input/InputContext.js';
import INPUT_MAP from './assets/input.json';

import { EntityManager } from './entity/EntityManager.js';
import { GameObject } from './entity/GameObject.js';

window.addEventListener('DOMContentLoaded', main);

function initializeSystems() {
  return {};
}

async function main() {
  const display = document.querySelector('display-port');
  const ctx = display.canvas.getContext('2d');
  const inputSource = InputSource.from(display);
  const input = new InputContext().setInputMap(INPUT_MAP).attach(inputSource);
  const view = new CanvasView2D(display);
  const entityManager = new EntityManager({ strictMode: true });
  const world = {
    ctx,
    display,
    input,
    inputSource,
    view,
    entityManager,
  };
  const systems = initializeSystems(world);

  display.addEventListener('frame', ({ detail: { deltaTime } }) => {
    const dt = deltaTime / 1000;
    inputSource.poll();

    updateSystems(dt, systems);
    renderSystems(ctx, view, systems);
  });
}

function updateSystems(dt, systems) {
  for (let system of Object.values(systems)) {
    if ('update' in system) {
      system.update(dt);
    }
  }
}

function renderSystems(ctx, view, systems) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  view.transformCanvas(ctx);
  {
    for (let system of Object.values(systems)) {
      if ('render' in system) {
        system.render(ctx);
      }
    }
  }
  ctx.setTransform();
}
