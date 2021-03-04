import { MainMenu } from './MainMenu.js';

export class MainMenuState
{
    constructor()
    {
        this.mainMenu = new MainMenu(this);
        this.menu = this.mainMenu;
    }

    tick(world)
    {
        this.menu.tick(world);
    }

    update(world)
    {
        this.menu.update(world);
    }

    render(world)
    {
        this.menu.render(world);
    }
}
