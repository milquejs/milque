import { InputContext } from '@milque/input';

export const MAIN_MENU_INPUT_CONTEXT = new InputContext();
const MENU_UP = MAIN_MENU_INPUT_CONTEXT.getInput('MenuUp');
const MENU_DOWN = MAIN_MENU_INPUT_CONTEXT.getInput('MenuDown');
const MENU_SELECT = MAIN_MENU_INPUT_CONTEXT.getInput('MenuSelect');

export class MainMenu
{
    constructor(gameState)
    {
        this.gameState = gameState;
        this.index = 0;
    }

    tick(world)
    {
        if ((MENU_UP.value - MENU_UP.prev) > 0)
        {
            this.index -= 1;
        }

        if ((MENU_DOWN.value - MENU_DOWN.prev) > 0)
        {
            this.index += 1;
        }

        if ((MENU_SELECT.value - MENU_SELECT.prev) > 0)
        {
            switch(this.index)
            {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }
    }

    update(world)
    {

    }

    render(world)
    {

    }
}
