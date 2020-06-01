import { Application, ApplicationLoop } from './ApplicationLoop.js'

class Game extends Application
{
    constructor(context)
    {
        super();

        this.context = context;

        this.display = null;
        this.renderContext = null;
    }

    setDisplay(display)
    {
        this.display = display;
        this.renderContext = display.canvas.getContext('2d');
        return this;
    }

    /** @override */
    onStart()
    {
        this.context.start();
    }

    /** @override */
    onUpdate(dt)
    {
        this.context.update(dt);
        this.context.render(this.renderContext);
    }
}

const GAME_PROPERTY = Symbol('game');
const LOOP_PROPERTY = Symbol('loop');

export function start(context)
{
    let gameContext = { ...context };

    let game = new Game(gameContext);
    let loop = new ApplicationLoop(game);

    gameContext[GAME_PROPERTY] = game;
    gameContext[LOOP_PROPERTY] = loop;
    gameContext.display = null;

    window.addEventListener('DOMContentLoaded', () => {
        let display = document.querySelector('display-port');
        game.setDisplay(display);
        gameContext.display = display;
        context.load().then(() => loop.start());
    });

    return gameContext;
}

export function stop(gameContext)
{
    gameContext[LOOP_PROPERTY].stop();

    delete gameContext[GAME_PROPERTY];
    delete gameContext[LOOP_PROPERTY];
}
