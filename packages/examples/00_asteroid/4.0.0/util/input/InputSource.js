import { Mouse } from './Mouse.js';
import { Keyboard } from './Keyboard.js';
import { EventKey } from './EventKey.js';

import { ActionInput } from './ActionInput.js';
import { RangeInput } from './RangeInput.js';
import { StateInput } from './StateInput.js';

export function createSource()
{
    let result = {
        inputs: new Set(),
        element: null,
        keyboard: new Keyboard(),
        mouse: new Mouse(),
        attach(element)
        {
            this.element = element;
            this.keyboard.attach();
            this.mouse.attach(element.getCanvas());
            return this;
        },
        detach()
        {
            this.element = null;
            this.keyboard.detach();
            this.mouse.detach();
            return this;
        },
        createAction(...eventKeyStrings)
        {
            return this.addInput(new ActionInput(eventKeyStrings));
        },
        createRange(eventKeyString)
        {
            return this.addInput(new RangeInput(eventKeyString));
        },
        createState(eventKeyMap)
        {
            return this.addInput(new StateInput(eventKeyMap));
        },
        addInput(input)
        {
            this.inputs.add(input);
            return input;
        },
        removeInput(input)
        {
            this.inputs.delete(input);
            return input;
        },
        clearInputs()
        {
            this.inputs.clear();
            return this;
        },
        poll()
        {
            for(let input of this.inputs)
            {
                input.poll();
            }
        },
        handleEvent(eventKeyString, value)
        {
            const eventKey = EventKey.parse(eventKeyString);
            for(let input of this.inputs)
            {
                input.update(eventKey, value);
            }
        }
    };
    result.handleEvent = result.handleEvent.bind(result);
    result.keyboard.setEventHandler(result.handleEvent);
    result.mouse.setEventHandler(result.handleEvent);
    return result;
}
