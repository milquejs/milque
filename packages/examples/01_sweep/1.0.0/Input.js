import * as Display from './util/Display.js';

var inputs = [];

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('contextmenu', onContextMenu);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

export function createAction(input)
{
    const result = {
        type: 'action',
        input,
        value: false,
        next: false,
        poll()
        {
            this.value = this.next;
            this.next = consumeInput(this.input, this.next);
        }
    };
    inputs.push(result);
    return result;
}

export function createRange(input)
{
    const result = {
        type: 'range',
        input,
        value: 0,
        next: 0,
        poll()
        {
            this.value = this.next;
            this.next = consumeInput(this.input, this.next);
        }
    };
    inputs.push(result);
    return result;
}

export function createState(inputMap)
{
    const result = {
        type: 'state',
        inputs: inputMap,
        value: 0,
        next: 0,
        poll()
        {
            this.value = this.next;
        }
    };
    inputs.push(result);
    return result;
}

export function consumeInput(input, next)
{
    switch(input)
    {
        case 'mouse[pos].x':
        case 'mouse[pos].y':
            return next;
        case 'mouse[pos].dx':
        case 'mouse[pos].dy':
            return 0;
        default:
            return false;
    }
}

export function handleEvent(input, value)
{
    for(let i of inputs)
    {
        if (i.type === 'state')
        {
            if (input in i.inputs) i.next = i.inputs[input];
        }
        else
        {
            if (i.input === input) i.next = value;
        }
    }
}

function onMouseDown(e)
{
    e.preventDefault();
    e.stopPropagation();

    handleEvent(`mouse[${e.button}].down`, true);
}

function onMouseUp(e)
{
    e.preventDefault();
    e.stopPropagation();

    handleEvent(`mouse[${e.button}].up`, true);
}

function onMouseMove(e)
{
    const clientWidth = Display.getClientWidth();
    const clientHeight = Display.getClientHeight();
    handleEvent(`mouse[pos].x`, (e.pageX - Display.getClientOffsetX()) / clientWidth);
    handleEvent(`mouse[pos].y`, (e.pageY - Display.getClientOffsetY()) / clientHeight);
    handleEvent(`mouse[pos].dx`, e.movementX / clientWidth);
    handleEvent(`mouse[pos].dy`, e.movementY / clientHeight);
}

function onContextMenu(e)
{
    e.preventDefault();
    e.stopPropagation();
}

function onKeyDown(e)
{
    e.preventDefault();
    e.stopPropagation();

    handleEvent(`key[${e.key}].down`, true);
}

function onKeyUp(e)
{
    e.preventDefault();
    e.stopPropagation();

    handleEvent(`key[${e.key}].up`, true);
}
