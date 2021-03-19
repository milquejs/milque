import { AnimatedText } from './AnimatedText.js';

export function load(world)
{
    let container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.bottom = '32px';
    container.innerHTML = `
        <style>
            .container {
                background-color: #ffffff;
                padding: 0.5em 1em;
                width: 30em;
            }
        </style>
        <div class="container">
            <article>
                <h2>The Cat Papers</h2>
                <section>
                    <h3>Some really BIG cats.</h3>
                    <p>Sometimes you <b>just</b> need some big, big cats. You know?</p>
                    <p>And other times...you need small ones. :)</p>
                    <p>
                    You know... I know, though not really, what kind of cat would
                    be a car? Have you seen my cat? I think it's somewhere out
                    there. Maybe it's on that hill over there? Oh NO! It's in a
                    TREE!!!
                    
                    Help me go get it plea-- great... Now I need another cat.
                    </p>
                    (hello from the other side)
                </section>
            </article>
        </div>`;

    world.display.appendChild(container);
    let article = container.querySelector('article');
    article.addEventListener('click', () => {
        AnimatedText.toggle(article);
    });
    AnimatedText.play(article).then(() => {
        article.innerHTML = 'BOO!';
    });

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
