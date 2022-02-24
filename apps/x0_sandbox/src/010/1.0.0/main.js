import { GameLoop, Input, Display, Utils } from './milque.js';

import * as MainScene from './scene/MainScene.js';
import * as Views from './scene/Views.js';

document.title = 'spacetrain';

MainScene.load().then(() => {
    GameLoop.start()
        .on('start', function start()
        {
            MainScene.onStart.call(this);
        })
        .on('update', function update(dt)
        {
            MainScene.onPreUpdate.call(this, dt);

            Input.poll();

            MainScene.onUpdate.call(this, dt);

            let view = Views.WORLD_VIEW;
            Utils.clearScreen(view.context, view.width, view.height);

            MainScene.onRender.call(this, view, this);

            Display.drawBufferToScreen(view.context);
        });
});
