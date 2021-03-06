const MAIN_MENU_INPUT_NAMES = {
    MENU_UP: 'MenuUp',
    MENU_DOWN: 'MenuDown',
    MENU_SELECT: 'MenuSelect',
};

export class MainMenu
{
    constructor(gameState)
    {
        this.gameState = gameState;
        this.index = 0;
    }

    tick(world)
    {
        if (world.input.getInputChanged(MAIN_MENU_INPUT_NAMES.MENU_UP) > 0)
        {
            this.index -= 1;
        }

        if (world.input.getInputChanged(MAIN_MENU_INPUT_NAMES.MENU_DOWN) > 0)
        {
            this.index += 1;
        }

        if (world.input.getInputChanged(MAIN_MENU_INPUT_NAMES.MENU_SELECT) > 0)
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
