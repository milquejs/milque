import * as InputSource from './input/InputSource.js';
import * as InputContext from './input/InputContext.js';

var source = InputSource.createSource();
var context = InputContext.createContext().attach(source);
var nextInputNameId = 1;

export function attachDisplay(element)
{
    return source.attach(element);
}

export function createContext(priority = 0)
{
    return InputContext.createContext().setPriority(priority).attach(source);
}

export function nextUniqueInputName()
{
    return `__input#${nextInputNameId++}`;
}

export function registerAction(...eventKeyStrings)
{
    return context.registerAction(nextUniqueInputName(), ...eventKeyStrings);
}

export function registerRange(eventKeyString)
{
    return context.registerRange(nextUniqueInputName(), eventKeyString);
}

export function registerState(eventKeyMap)
{
    return context.registerState(nextUniqueInputName(), eventKeyMap);
}

export function poll()
{
    return source.poll();
}

export function handleEvent(eventKeyString, value)
{
    return source.handleEvent(eventKeyString, value);
}
