import * as InputSource from './input/InputSource.js';
import * as InputContext from './input/InputContext.js';

var source = InputSource.createSource();

export function attachDisplay(element)
{
    return source.attach(element);
}

export function createContext()
{
    return InputContext.createContext(source);
}

export function createAction(eventKeyString)
{
    return source.createAction(eventKeyString);
}

export function createRange(eventKeyString)
{
    return source.createRange(eventKeyString);
}

export function createState(eventKeyMap)
{
    return source.createState(eventKeyMap);
}

export function poll()
{
    return source.poll();
}

export function handleEvent(eventKeyString, value)
{
    return source.handleEvent(eventKeyString, value);
}
