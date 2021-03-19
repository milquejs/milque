import { AnimatedText } from './AnimatedText.js';

export function load(world)
{
    let container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.bottom = '0.8em';
    container.style.right = '0.8em';
    container.innerHTML = `
        <style>
            .container {
                position: relative;
                background-color: #091b3d;
                color: #eeeeee;
                padding: 0.5em;
                width: 20em;
                height: 5em;
                overflow: auto;
                font-family: monospace;
            }
        </style>
        <div class="container">
            <article>
                There is something amiss in Marde. The stench of unrest is baked into every nook and alley and not a corner is left
                untainted
                by the foulness of its mindless residents. No windows unshattered. No doors unlocked.
            </article>
        </div>`;

    world.display.appendChild(container);
    let article = container.querySelector('article');
    article.addEventListener('click', () => {
        AnimatedText.skip(article);
    });
    AnimatedText.play(article);

    world.dialogue = {
        text: '',
        element: container,
    };
}

export function update(dt, world)
{
    
}

export function render(ctx, world)
{
}
