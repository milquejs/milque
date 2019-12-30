import { Mouse } from './Mouse.js';
import { Keyboard } from './Keyboard.js';
import { ActionInput } from './ActionInput.js';
import { RangeInput } from './RangeInput.js';
import { StateInput } from './StateInput.js';

export function createInputSource()
{
    let result = {
        inputs: [],
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
        createAction(eventKeyString)
        {
            return this.addInput(new ActionInput(eventKeyString));
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
            this.inputs.push(input);
            return this;
        },
        removeInput(input)
        {
            this.inputs.splice(this.inputs.indexOf(input), 1);
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
            for(let input of this.inputs)
            {
                input.update(eventKeyString, value);
            }
        }
    };
    result.handleEvent = result.handleEvent.bind(result);
    result.keyboard.setEventHandler(result.handleEvent);
    result.mouse.setEventHandler(result.handleEvent);
    return result;
}

export function createContext(inputSource)
{
    return {
        inputSource,
        actions: new Map(),
        ranges: new Map(),
        states: new Map(),
        registerAction(name, eventKeyString)
        {
            let result = new ActionInput(eventKeyString);
            this.inputSource.addInput(result);
            this.actions.set(name, result);
            return result;
        },
        registerRange(name, eventKeyString)
        {
            let result = new RangeInput(eventKeyString);
            this.inputSource.addInput(result);
            this.ranges.set(name, result);
            return result;
        },
        registerState(name, eventKeyMap)
        {
            let result = new StateInput(eventKeyMap);
            this.inputSource.addInput(result);
            this.states.set(name, result);
            return result;
        },
        poll()
        {
            for(let action of this.actions.values())
            {
                action.poll();
            }
            for(let range of this.ranges.values())
            {
                range.poll();
            }
            for(let state of this.states.values())
            {
                state.poll();
            }
        }
    };
}
