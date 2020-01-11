import { GameLoop, Display, Input, Utils } from './milque.js';

import * as Views from './Views.js';
import * as MainScene from './MainScene.js';
import * as MainRender from './MainRender.js';

let game = {
    start()
    {
        MainScene.onStart.call(this);
    },
    update(dt)
    {
        MainScene.onPreUpdate.call(this, dt);

        Input.poll();

        MainScene.onUpdate.call(this, dt);

        this.render(Views.WORLD_VIEW, this);
    },
    render(view, world)
    {
        Utils.clearScreen(view.context, view.width, view.height);

        MainRender.onRender(view, world);

        Display.drawBufferToScreen(view.context);
    }
}

GameLoop.start(game);
