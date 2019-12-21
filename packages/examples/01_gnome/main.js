import * as Display from './util/Display.js';
import * as GameLoop from './util/GameLoop.js';
import * as Util from './lib.js';
import * as Input from './util/Input.js';

import * as Boxes from './Boxes.js';
import * as PlayerControls from './PlayerControls.js';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

let game = {
    start()
    {
        this.entities = {
            [Boxes.ENTITY_CLASS_NAME]: []
        };

        let centerX = Display.getWidth() / 2;
        let centerY = Display.getHeight() / 2;
        Boxes.createBox(this, centerX, centerY, 16, 16);
        Boxes.createBox(this, centerX, centerY, 8, 8);
        Boxes.createBox(this, centerX, centerY, 8, 8);
        Boxes.createBox(this, centerX, centerY, 8, 8);
        Boxes.createBox(this, centerX, centerY, 8, 8);

        Boxes.createBox(this, Display.getWidth() / 2, Display.getHeight(), Display.getWidth(), 8, false);
        Boxes.createBox(this, Display.getWidth() / 2, 0, Display.getWidth(), 8, false);
        Boxes.createBox(this, 0, Display.getHeight() / 2, 8, Display.getHeight(), false);
        Boxes.createBox(this, Display.getWidth(), Display.getHeight() / 2, 8, Display.getHeight(), false);

        this.player = Boxes.createBox(this, centerX, centerY, 8, 8);

        PlayerControls.CONTEXT.enable();
    },
    update(dt)
    {
        Input.poll();
        this.render(Display.getContext());

        const moveControls = PlayerControls.RIGHT.value - PlayerControls.LEFT.value;
        const jumpControls = PlayerControls.UP.value;
        
        this.player.dx += moveControls * 0.3;

        if (jumpControls && this.player.ground)
        {
            this.player.dy -= jumpControls * 2;
        }

        Boxes.update(dt, this);
    },
    render(ctx)
    {
        Util.clearScreen(ctx, Display.getWidth(), Display.getHeight());

        Boxes.render(ctx, this);
    }
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

GameLoop.start(game);
