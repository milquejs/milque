
const CONTAINER_MARGIN_TOP = 8;
const CONTAINER_MARGIN_LEFT = 64;
const CONTAINER_HEIGHT = 48;

function updateText(world, text)
{
    world.dialogue.text = text;
    let p = world.dialogue.element.querySelector('p');
    p.textContent = text;
}

export function load(world)
{
    let container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.bottom = '32px';
    container.innerHTML = `
        <style>
            .container {
                background-color: #ffffff;
                padding: 0.5rem 1rem;
            }
        </style>
        <div class="container">
            <p></p>
        </div>
    `;
    world.display.appendChild(container);

    world.dialogue = {
        text: '',
        element: container,
    };

    updateText(world, 'Hello my fellow hoomans. What a surprise.');
}

export function update(dt, world)
{

}

export function render(ctx, world)
{
}
