import { GameLoop, Input, Viewport, Display, Utils } from './milque.js';
import * as MainScene from './MainScene.js';

document.title = 'spacetrain';

const WORLD_VIEW = Viewport.createView(320, 240);
GameLoop.start()
  .on('start', function start() {
    MainScene.onStart.call(this);
  })
  .on('update', function update(dt) {
    MainScene.onPreUpdate.call(this, dt);
    Input.poll();
    MainScene.onUpdate.call(this, dt);
    let view = WORLD_VIEW;
    Utils.clearScreen(view.context, view.width, view.height);
    MainScene.onRender.call(this, view, this);
    Display.drawBufferToScreen(view.context);
  });
