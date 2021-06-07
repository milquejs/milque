import { properties, customEvents, attachShadowTemplate } from '@milque/cuttle.macro';

import INNER_HTML from './ConsoleElement.template.html';
import INNER_STYLE from './ConsoleElement.module.css';

const SCROLL_BUFFER = 300;

export class ConsoleElement extends HTMLElement
{
    static get [customEvents]()
    {
        return [
            'input',
            'command',
            'autocomplete'
        ];
    }

    constructor()
    {
        super();
        attachShadowTemplate(this, INNER_HTML, INNER_STYLE, { mode: 'open' });

        this._inputElement = this.shadowRoot.querySelector('input');
        this._outputElement = this.shadowRoot.querySelector('output');
        this._scrollTopElement = this.shadowRoot.querySelector('#scrollTop');
        this._scrollBottomElement = this.shadowRoot.querySelector('#scrollBottom');

        this._autoscroll = true;
        this._prevscroll = 0;

        this.onInputChange = this.onInputChange.bind(this);
        this.onInputKeyDown = this.onInputKeyDown.bind(this);
        this.onOutputScroll = this.onOutputScroll.bind(this);
        this.onScrollTopClick = this.onScrollTopClick.bind(this);
        this.onScrollBottomClick = this.onScrollBottomClick.bind(this);

        this._inputElement.addEventListener('input', this.onInputChange);
        this._inputElement.addEventListener('keydown', this.onInputKeyDown);
        this._outputElement.addEventListener('scroll', this.onOutputScroll);
        this._scrollTopElement.addEventListener('click', this.onScrollTopClick);
        this._scrollBottomElement.addEventListener('click', this.onScrollBottomClick);
    }

    newline(message = '')
    {
        const container = document.createElement('p');
        const p = document.createElement('pre');
        p.innerHTML = message.trim() || '&nbsp;';
        container.appendChild(p);
        this._outputElement.appendChild(container);

        if (this._autoscroll)
        {
            this._outputElement.scrollTo(0, this._outputElement.scrollHeight);
        }
    }

    clear()
    {
        this._outputElement.innerHTML = '';
    }

    onInputChange(e)
    {
        const target = e.target;
        const value = target.value;
        const data = e.data;
        this.dispatchEvent(new CustomEvent('input', {
            composed: true,
            bubbles: false,
            detail: {
                target,
                value,
                data,
            }
        }));
    }

    onInputKeyDown(e)
    {
        if (e.key === 'Enter')
        {
            const target = e.target;
            const value = target.value;
            e.target.value = '';

            this.dispatchEvent(new CustomEvent('command', {
                composed: true,
                bubbles: false,
                detail: {
                    target,
                    value,
                }
            }));
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        else if (e.key === 'Tab')
        {
            const target = e.target;
            const value = target.value;

            this.dispatchEvent(new CustomEvent('autocomplete', {
                composed: true,
                bubbles: false,
                detail: {
                    target,
                    value,
                }
            }));
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    onOutputScroll(e)
    {
        const target = e.target;
        const top = target.scrollTop;
        const height = target.scrollHeight - target.clientHeight;
        const progress = top / height;

        let goingDown = (progress - this._prevscroll) > 0;
        let autoscroll = progress >= 1;

        this._prevscroll = progress;
        this._autoscroll = autoscroll;

        let nearBounds = top < SCROLL_BUFFER || top > (height - SCROLL_BUFFER);

        this._scrollTopElement.classList.toggle('hidden', autoscroll || nearBounds || goingDown);
        this._scrollBottomElement.classList.toggle('hidden', autoscroll || nearBounds || !goingDown);
    }

    onScrollTopClick()
    {
        this._outputElement.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    onScrollBottomClick()
    {
        // NOTE: Smooth scrolling could take too long and miss auto-scroll.
        this._outputElement.scrollTo(0, this._outputElement.scrollHeight);
    }
}
window.customElements.define('console-view', ConsoleElement);
