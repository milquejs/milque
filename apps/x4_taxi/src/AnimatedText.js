const ANIMATED_TEXT_STATE_KEY = Symbol('animatedText');

const ERROR_FRAME_TIME = 1_000_000;
const DEFAULT_CHAR_TIME = 30;
const INITIAL_WAIT_TIME = 300;
const INITIAL_INLINE_TIME = DEFAULT_CHAR_TIME;
const WHITE_PATTERN = /\s/;
const LONG_PATTERN = /[.!?]/;
const SHORT_PATTERN = /[-,:;]/;
const SUSTAIN_PATTERN = /[.-]/;

function charTime(c, next)
{
    let nextWhite = WHITE_PATTERN.test(next);
    if (nextWhite || SUSTAIN_PATTERN.test(c))
    {
        if (LONG_PATTERN.test(c)) return 800;
        else if (SHORT_PATTERN.test(c)) return 250;
    }
    else
    {
        if (LONG_PATTERN.test(c)) return 200;
        else if (SHORT_PATTERN.test(c)) return 100;
    }
    return DEFAULT_CHAR_TIME;
}

class AnimatedTextState
{
    constructor(rootElement, speed = 1)
    {
        /** @type {Element} */
        this.rootElement = rootElement;
        /** @type {Text} */
        this.targetNode = null;
        this.animatedNodes = new Set();
        this.nodeContents = new Map();

        this.deltaTime = 0;
        this.prevTime = 0;
        this.waitTime = INITIAL_WAIT_TIME;

        this.targetText = '';
        this.index = -1;

        this.disabled = true;
        this.complete = false;
        this.speed = speed;
        this.callback = null;
        this.error = null;

        this.animationFrameHandle = null;

        /** @private */
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
    }

    toggle(force = !this.disabled)
    {
        if (force)
        {
            this.pause();
        }
        else
        {
            this.resume();
        }
    }

    pause()
    {
        this.disabled = true;
        cancelAnimationFrame(this.animationFrameHandle);
        this.animationFrameHandle = null;

        // NOTE: Removes dead wait time after unpause to feel more impactful.
        this.deltaTime = this.waitTime;
    }

    resume()
    {
        this.disabled = false;
        if (!this.canSafelyResumeWithTarget(this.targetNode))
        {
            this.targetNode = null;
        }
        this.prevTime = performance.now();
        this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
    }

    reset()
    {
        this.targetNode = null;
        this.animatedNodes.clear();
    }

    skipAll()
    {
        if (this.targetNode)
        {
            this.targetNode.nodeValue = this.targetText;
            this.targetNode = null;
        }

        this.completeRemainingChildText();
    }

    /** @private */
    onAnimationFrame(now)
    {
        this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
        
        if (this.targetNode == null)
        {
            let next = this.findNextChildText();
            if (next)
            {
                let inline = next.previousSibling || window.getComputedStyle(next.parentElement).display === 'inline';
                this.targetNode = next;
                this.targetText = this.nodeContents.get(next);
                this.animatedNodes.add(next);
                this.index = -1;
                this.waitTime = inline ? INITIAL_INLINE_TIME : INITIAL_WAIT_TIME;
                this.deltaTime = 0;
                this.complete = false;
            }
            else
            {
                // The end of the road.
                this.complete = true;
                this.callback.call(undefined);
                return;
            }
        }

        let frameDelta = (now - this.prevTime);
        this.deltaTime += frameDelta * this.speed;
        this.prevTime = now;

        if (frameDelta > ERROR_FRAME_TIME)
        {
            this.skipAll();
            this.error(new Error('Frame took too long; skipping animation.'));
            return;
        }
        
        const text = this.targetText;
        let flag = false;
        while(!flag && this.deltaTime >= this.waitTime)
        {
            this.deltaTime -= this.waitTime;
            let i = ++this.index;
            if (i < text.length)
            {
                let current = text.charAt(i);
                let next = text.charAt(i + 1);
                this.waitTime = charTime(current, next);
            }
            else
            {
                this.index = text.length;
                flag = true;
            }
        }

        // Update DOM content
        if (!flag)
        {
            let newText = text.substring(0, this.index + 1);
            this.targetNode.nodeValue = newText;
        }
        else
        {
            this.targetNode.nodeValue = text;
            this.targetNode = null;
        }
    }

    /** @private */
    canSafelyResumeWithTarget(node)
    {
        if (!node) return false;
        if (!node.isConnected) return false;
        let content = node.nodeValue;
        let expected = this.targetText.substring(0, this.index + 1);
        if (content !== expected) return false;
        return true;
    }

    /** @private */
    completeRemainingChildText(parent = this.rootElement)
    {
        for(let child of parent.childNodes)
        {
            if (child instanceof Text)
            {
                if (this.nodeContents.has(child))
                {
                    if (!this.animatedNodes.has(child))
                    {
                        child.nodeValue = this.nodeContents.get(child);
                        this.nodeContents.delete(child);
                        this.animatedNodes.add(child);
                    }
                }
            }
            else
            {
                this.completeRemainingChildText(child);
            }
        }
    }
    
    /**
     * @private
     * @param {HTMLElement|Text} parent 
     * @returns {Text|null}
     */
    findNextChildText(parent = this.rootElement, result = null)
    {
        for(let child of parent.childNodes)
        {
            if (child instanceof Text)
            {
                let hasAnimated = this.animatedNodes.has(child);
                let content = child.nodeValue;
                if (content && content.trim().length > 0 && this.nodeContents.get(child) !== content)
                {
                    this.nodeContents.set(child, content);
                    child.nodeValue = '';

                    if (hasAnimated)
                    {
                        this.animatedNodes.delete(child);
                    }
                }

                if (!result && !hasAnimated && this.nodeContents.has(child))
                {
                    result = child;
                }
            }
            else
            {
                result = this.findNextChildText(child, result);
            }
        }
        return result;
    }
}

export const AnimatedText = {
    async play(element, speed = 1)
    {
        if (!(element instanceof Element))
        {
            throw new Error('Cannot animate text for non-element.');
        }
        if (speed <= 0)
        {
            throw new Error('Cannot animate text at non-positive speed.');
        }

        let state = new AnimatedTextState(element, speed);
        element[ANIMATED_TEXT_STATE_KEY] = state;
        return new Promise((resolve, reject) => {
            state.error = e => {
                reject(e);
            };
            state.callback = () => {
                state.pause();
                delete element[ANIMATED_TEXT_STATE_KEY];
                resolve();
            };
            state.resume();
        });
    },
    pause(element)
    {
        let state = element[ANIMATED_TEXT_STATE_KEY];
        state.pause();
    },
    resume(element)
    {
        let state = element[ANIMATED_TEXT_STATE_KEY];
        state.resume();
    },
    skip(element)
    {
        let state = element[ANIMATED_TEXT_STATE_KEY];
        state.skipAll();
    },
    toggle(element, force = undefined)
    {
        let state = element[ANIMATED_TEXT_STATE_KEY];
        state.toggle(force);
    }
};
