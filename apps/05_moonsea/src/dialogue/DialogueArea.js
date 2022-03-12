const INNER_HTML = `
<slot></slot>
<div class="container"></div>`;

const INNER_STYLE = `
slot, ::slotted(*) {
    display: none;
}

.outer {
    overflow: hidden;
}
.outer, .inner {
    display: inline-block;
    transform-origin: top left;
    transform: scale(0, 1);
    contain: content;
}
.inner {
    white-space: pre;
}

.container p {
    margin: 0;
}

.waveChild {
    display: inline-block;
    transform-origin: top left;
    animation-name: wavy;
    animation-duration: 300ms;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}
@keyframes wavy{
    from {
        transform: translateY(-6%);
    }
    to {
        transform: translateY(6%);
    }
}`;

const STEP_TIME = 30;
const WAVY_STEP_DELAY_MILLIS = 120;
const MAX_TYPEWRITE_STEPS = 10;
const [
    TYPEWRITE_KEYFRAMES,
    INVERSE_TYPEWRITE_KEYFRAMES,
] = (() => {
    let keyframes = [];
    let invKeyframes = [];
    for (let i = 1; i <= MAX_TYPEWRITE_STEPS; ++i) {
        let step = i / MAX_TYPEWRITE_STEPS;
        let x = step.toFixed(5);
        keyframes.push({ transform: `scale(${x},1)` });
        let inverse = (1 / step).toFixed(5);
        invKeyframes.push({ transform: `scale(${inverse},1)` });
    }
    return [
        keyframes,
        invKeyframes,
    ];
})();

// https://developers.google.com/web/updates/2017/03/performant-expand-and-collapse

export class DialogueArea extends HTMLElement {
    /** @private */
    static get [Symbol.for('templateNode')]() {
        let t = document.createElement('template');
        t.innerHTML = INNER_HTML;
        Object.defineProperty(this, Symbol.for('templateNode'), { value: t });
        return t;
    }

    /** @private */
    static get [Symbol.for('styleNode')]() {
        let t = document.createElement('style');
        t.innerHTML = INNER_STYLE;
        Object.defineProperty(this, Symbol.for('styleNode'), { value: t });
        return t;
    }

    static define(customElements = window.customElements) {
        customElements.define('dialogue-area', this);
    }

    get paused() {
        return this._paused;
    }

    set paused(value) {
        if (value) {
            this.pause();
        } else {
            this.play();
        }
    }

    get autoplay() {
        return this.hasAttribute('autoplay');
    }

    set autoplay(value) {
        this.toggleAttribute('autoplay', value);
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(
            this.constructor[Symbol.for('templateNode')].content.cloneNode(true)
        );
        shadowRoot.appendChild(
            this.constructor[Symbol.for('styleNode')].cloneNode(true)
        );

        /** @private */
        this._containerElement = shadowRoot.querySelector('.container');
        /** @private */
        this._slotElement = shadowRoot.querySelector('slot');

        /**
         * @private
         * @type {Array<HTMLElement>}
         */
        this._typeWriteQueue = [];
        /** @private */
        this._typeWriteIndex = 0;
        /** @private */
        this._currentWaitTime = 0;
        /** @private */
        this._currentWaitTimeout = null;
        /**
         * @private
         * @type {Array<Animation>}
         */
        this._currentAnimations = [];

        /** @private */
        this._paused = true;

        /** @private */
        this._eventFinish = new CustomEvent('finish', {
            composed: true,
            bubbles: false,
        });

        /** @protected */
        this.onSlotChange = this.onSlotChange.bind(this);
        /** @protected */
        this.onAnimationFinish = this.onAnimationFinish.bind(this);
        /** @protected */
        this.onWaitTimeout = this.onWaitTimeout.bind(this);

        this._slotElement.addEventListener('slotchange', this.onSlotChange);
    }

    /**
     * @protected
     * Override for web component.
     */
    connectedCallback() {
        upgradeProperty(this, 'autoplay');
    }

    /**
     * @protected
     * Override for web component.
     */
    disconnectedCallback() {
        this._containerElement.innerHTML = '';
    }

    play() {
        this._paused = false;
        for(let animation of this._currentAnimations) {
            animation.play();
        }
        this.step();
    }

    pause() {
        this._paused = true;
        for(let animation of this._currentAnimations) {
            animation.pause();
        }
    }

    reset() {
        this._typeWriteIndex = 0;

        for(let animation of this._currentAnimations) {
            animation.cancel();
        }
        this._currentAnimations.length = 0;

        clearTimeout(this._currentWaitTimeout);
        this._currentWaitTimeout = null;

        let queue = this._typeWriteQueue;
        for (let outer of queue) {
            let inner = /** @type {HTMLElement} */ (outer.children.item(0));
            outer.style.removeProperty('transform');
            inner.style.removeProperty('transform');
        }
    }

    /** @protected */
    step() {
        if (this._currentAnimations.length > 0) {
            return;
        }
        if (this._currentWaitTimeout) {
            return;
        }
        if (this._paused) {
            return;
        }
        if (this._typeWriteIndex >= this._typeWriteQueue.length) {
            return;
        }

        let stepTime = STEP_TIME;
        if (this.hasAttribute('speed')) {
            let speed = Number(this.getAttribute('speed'));
            if (speed > 0) {
                stepTime /= speed;
            } else {
                stepTime = 0;
            }
        }
        if (stepTime <= 0) {
            this.skip();
            return;
        }

        const outer = /** @type {HTMLElement} */ (this._typeWriteQueue[this._typeWriteIndex]);
        const inner = /** @type {HTMLElement} */ (outer.children.item(0));
        outer.style.transform = 'scale(1,1)';
        inner.style.transform = 'scale(1,1)';

        const text = inner.textContent;
        const duration = text.length * stepTime;
        const wait = (inner.hasAttribute('data-p-wait')
            ? Number(inner.getAttribute('data-p-wait'))
            : 0) * stepTime * 4;
        let outerAnimation = outer.animate(TYPEWRITE_KEYFRAMES, duration);
        let innerAnimation = inner.animate(INVERSE_TYPEWRITE_KEYFRAMES, duration);
        this._currentAnimations.push(outerAnimation, innerAnimation);
        this._currentWaitTime = wait;
        this._typeWriteIndex += 1;
        innerAnimation.addEventListener('finish', this.onAnimationFinish);
    }

    skip() {
        if (this._typeWriteIndex >= this._typeWriteQueue.length) {
            return;
        }
        let timeoutHandle = this._currentWaitTimeout;
        this._currentWaitTimeout = null;
        clearTimeout(timeoutHandle);

        let animations = this._currentAnimations;
        this._currentAnimations.length = 0;
        for(let animation of animations) {
            animation.finish();
        }

        let queue = this._typeWriteQueue;
        let l = queue.length;
        for(let i = this._typeWriteIndex; i < l; ++i) {
            const outer = /** @type {HTMLElement} */ (queue[i]);
            const inner = /** @type {HTMLElement} */ (outer.children.item(0));
            outer.style.transform = 'scale(1,1)';
            inner.style.transform = 'scale(1,1)';
        }
        this._typeWriteIndex = queue.length;
    }

    /** @protected */
    onSlotChange() {
        this.reset();
        
        const container = this._containerElement;
        const textFragment = createTextFragment(this._slotElement);
        container.innerHTML = '';
        container.appendChild(textFragment);

        const children = container.querySelectorAll('.outer');
        let queue = this._typeWriteQueue;
        queue.length = 0;
        const l = children.length;
        for (let i = 0; i < l; ++i) {
            let outer = /** @type {HTMLElement} */ (children.item(i));
            queue.push(outer);
        }
        this._typeWriteIndex = 0;

        if (this.hasAttribute('autoplay')) {
            this.play();
        }
    }

    /** @protected */
    onAnimationFinish() {
        this._currentAnimations.length = 0;
        if (this._typeWriteIndex >= this._typeWriteQueue.length) {
            this.dispatchEvent(this._eventFinish);
            return;
        }
        let waitTime = this._currentWaitTime;
        if (waitTime > 0) {
            this._currentWaitTime = 0;
            this._currentWaitTimeout = setTimeout(this.onWaitTimeout, waitTime);
        } else {
            this.step();
        }
    }

    /** @protected */
    onWaitTimeout() {
        this._currentWaitTimeout = null;
        this.step();
    }
}
DialogueArea.define();

function upgradeProperty(element, propertyName) {
    if (Object.prototype.hasOwnProperty.call(element, propertyName)) {
        let value = element[propertyName];
        delete element[propertyName];
        element[propertyName] = value;
    }
}

/** @param {HTMLSlotElement} slotElement */
function createTextFragment(slotElement) {
    let fragment = document.createDocumentFragment();
    let roots = slotElement.assignedNodes();
    for(let root of roots) {
        root = root.cloneNode(true);
        
        if (root.nodeType === 3) {
            // We are a text node.
            let text = root.textContent;
            let words = text.split(/\s+/).filter(Boolean).map(word => word + ' ');
            let frag = document.createDocumentFragment();
            for (let word of words) {
                let punct = getPunctWeight(word);
                let pText = createPText(word, punct);
                frag.append(pText);
            }
            root = frag;
        } else {
            // We are anything else.
            let children = getTextNodes(root, /\s+/, true);
            for (let { parent, node, content } of children) {
                const name = parent.nodeName;
                if (name === 'P-WAIT') {
                    let pText = createPText('', Number(content.join('')));
                    parent.insertBefore(pText, node);
                } else {
                    for (let word of content) {
                        let punct = getPunctWeight(word);
                        let pText = createPText(word, punct);
                        parent.insertBefore(pText, node);
                    }
                }
                parent.removeChild(node);
            }
        }

        // Post-processing
        if (root instanceof Element) {
            let pWaves = [];
            if (root.nodeName === 'P-WAVE') {
                pWaves.push(root);
            }
            let result = root.querySelectorAll('p-wave');
            let l = result.length;
            for (let i = 0; i < l; ++i) {
                let pWave = result.item(i);
                pWaves.push(pWave);
            }
            for (let pWave of pWaves) {
                let children = getTextNodes(pWave, '', false);
                for (let { parent, node, content } of children) {
                    let i = 0;
                    for (let c of content) {
                        let element = document.createElement('span');
                        element.className = 'waveChild';
                        element.textContent = c;
                        element.style.animationDelay = `${i}ms`;
                        i += WAVY_STEP_DELAY_MILLIS;
                        parent.insertBefore(element, node);
                    }
                    parent.removeChild(node);
                }
            }
        }
        fragment.append(root);
    }
    return fragment;
}

/**
 * @param {Node} rootNode 
 * @param {string|RegExp} textSplitter 
 * @returns {Array<{ parent: Node, node: Node, content: Array<string> }>}
 */
function getTextNodes(rootNode, textSplitter, postWhitespace) {
    let children = [];
    let walk = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walk.nextNode()) {
        let text = node.textContent;
        let words = text.split(textSplitter).filter(Boolean);
        if (postWhitespace) {
            words = words.map(word => word + ' ');
        }
        let child = {
            parent: node.parentNode,
            node,
            content: words,
        };
        children.push(child);
    }
    return children;
}

function getPunctWeight(text) {
    let hardPunc = /([\.\!\?\:\-]+)$/.exec(text);
    let softPunc = /([\,\;]+)$/.exec(text);
    let punctuations = 0;
    if (hardPunc) {
        let [_, ending] = hardPunc;
        punctuations += ending.length * 2;
    }
    if (softPunc) {
        let [_, ending] = softPunc;
        punctuations += ending.length;
    }
    return punctuations;
}

function createPText(text, wait) {
    let outer = document.createElement('span');
    outer.className = 'outer';
    let inner = document.createElement('span');
    inner.className = 'inner';
    outer.append(inner);
    if (wait > 0) {
        inner.setAttribute('data-p-wait', String(wait));
    }
    if (text) {
        inner.textContent = text;
    }
    return outer;
}
