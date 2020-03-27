let inputs = [];

export function init()
{
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    window.addEventListener('gamepadconnected', e => {
        // TODO: Not yet implemented...
    });
    window.addEventListener('gamepaddisconnected', e => {
        // TODO: Not yet implemented...
    });
}

export function clear()
{
    inputs.length = 0;
}

export function poll()
{
    // TODO: Nothing as of yet...
}

export function createInput(key, onChange = undefined)
{
    let result = { key, value: false, onChange };
    inputs.push(result);
    return result;
}

export function handleEvent(key, value)
{
    for(let input of inputs)
    {
        if (input.key.includes(key) || input.key.includes('*'))
        {
            let prev = input.value;
            if (prev !== value)
            {
                input.value = value;
                if (input.onChange) input.onChange(value, prev);
            }
        }
    }
}

function onKeyDown(e)
{
    handleEvent(e.key, true);
}

function onKeyUp(e)
{
    handleEvent(e.key, false);
}
