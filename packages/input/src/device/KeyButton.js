export function createButton()
{
    return {
        up: 0,
        down: 0,
        state: 0,
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
    if (button.state)
    {
        if (button.up && !button.next.up)
        {
            button.state = 0;
        }
    }
    else if (button.next.down)
    {
        button.state = 1;
    }

    button.down = button.next.down;
    button.up = button.next.up;

    button.next.down = 0;
    button.next.up = 0;
}
