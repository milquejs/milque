import { InputEventHandler } from './InputEventHandler.js';
import { Keyboard, Mouse } from './InputDevices.js';

const EVENT_HANDLER = new InputEventHandler()
    .registerDevice('key', new Keyboard())
    .registerDevice('mouse', new Mouse());
const ADAPTER_EVENTS = new Map();

function registerInput(input, adapter)
{
    
}

function getState(input)
{
    
}

function getAction(input)
{

}

function getRange(input)
{

}