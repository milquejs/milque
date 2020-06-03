export function createButton()
{
    return {
        up: 0,
        down: 0,
        value: 0,
        next: {
            up: 0,
            down: 0,
        },
    };
}

export function nextButton(button, event, value)
{
    if (event === 'down')
    {
        button.next.down = value;
    }
    else
    {
        button.next.up = value;
    }
}

export function pollButton(button)
{
    if (button.value)
    {
        if (button.up && !button.next.up)
        {
            button.value = 0;
        }
    }
    else if (button.next.down)
    {
        button.value = 1;
    }

    button.down = button.next.down;
    button.up = button.next.up;

    button.next.down = 0;
    button.next.up = 0;
}
