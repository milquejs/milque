/**
 * @module InputSource
 * Can be used without InputContext.
 */

import { Mouse } from './Mouse.js';
import { Keyboard } from './Keyboard.js';
import { EventKey } from './EventKey.js';
import { MAX_CONTEXT_PRIORITY, MIN_CONTEXT_PRIORITY } from './InputContext.js';

export function createSource()
{
    let result = {
        _contexts: new Array(MAX_CONTEXT_PRIORITY - MIN_CONTEXT_PRIORITY),
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
        addContext(context)
        {
            const priority = context.priority - MIN_CONTEXT_PRIORITY;
            if (!this._contexts[priority]) this._contexts[priority] = [];
            this._contexts[priority].push(context);
            return this;
        },
        removeContext(context)
        {
            const priority = context.priority - MIN_CONTEXT_PRIORITY;
            let contexts = this._contexts[priority];
            if (contexts)
            {
                contexts.splice(contexts.indexOf(context), 1);
            }
            return this;
        },
        poll()
        {
            for(let contexts of this._contexts)
            {
                if (contexts)
                {
                    for(let context of contexts)
                    {
                        if (context.active)
                        {
                            context.poll();
                        }
                    }
                }
            }
        },
        handleEvent(eventKeyString, value)
        {
            const eventKey = EventKey.parse(eventKeyString);
            for(let contexts of this._contexts)
            {
                if (contexts)
                {
                    for(let context of contexts)
                    {
                        if (context.active)
                        {
                            let result;
                            result = context.update(eventKey, value);
                            if (result)
                            {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
    };
    result.handleEvent = result.handleEvent.bind(result);
    result.keyboard.setEventHandler(result.handleEvent);
    result.mouse.setEventHandler(result.handleEvent);
    return result;
}
