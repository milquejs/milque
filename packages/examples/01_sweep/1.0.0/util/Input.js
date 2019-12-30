import * as InputSource from './input/InputSource.js';

var inputSource = InputSource.createInputSource();

export function attachDisplay(element)
{
    return inputSource.attach(element);
}

export function createContext()
{
    return InputSource.createContext(inputSource);
}

export function createAction(eventKeyString)
{
    return inputSource.createAction(eventKeyString);
}

export function createRange(eventKeyString)
{
    return inputSource.createRange(eventKeyString);
}

export function createState(eventKeyMap)
{
    return inputSource.createState(eventKeyMap);
}

export function poll()
{
    return inputSource.poll();
}

export function handleEvent(eventKeyString, value)
{
    return inputSource.handleEvent(eventKeyString, value);
}
