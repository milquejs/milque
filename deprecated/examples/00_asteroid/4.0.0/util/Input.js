import * as InputSource from './input/InputSource.js';
import * as InputContext from './input/InputContext.js';

var source = InputSource.createSource();
var context = InputContext.createContext().attach(source);

export function attachCanvas(canvasElement)
{
    return source.attach(canvasElement);
}

export function createContext(priority = 0, active = true)
{
    return InputContext.createContext().setPriority(priority).toggle(active).attach(source);
}

export function createInput(adapter)
{
    return context.registerInput(getNextInputName(), adapter);
}

export function createAction(...eventKeyStrings)
{
    return context.registerAction(getNextInputName(), ...eventKeyStrings);
}

export function createRange(eventKeyString)
{
    return context.registerRange(getNextInputName(), eventKeyString);
}

export function createState(eventKeyMap)
{
    return context.registerState(getNextInputName(), eventKeyMap);
}

export function poll()
{
    return source.poll();
}

export function handleEvent(eventKeyString, value)
{
    return source.handleEvent(eventKeyString, value);
}

var nextInputNameId = 1;
function getNextInputName()
{
    return `__input#${nextInputNameId++}`;
}