import { properties, customEvents, attachShadowTemplate } from '@milque/cuttle.macro';

import INNER_HTML from './ToastView.template.html';
import INNER_STYLE from './ToastView.module.css';

const DEFAULT_TOAST_TIMEOUT = 1 * 1000;

export class ToastView extends HTMLElement
{
    constructor()
    {
        super();
        attachShadowTemplate(this, INNER_HTML, INNER_STYLE, { mode: 'open' });

        /** @private */
        this._containerElement = this.shadowRoot.querySelector('.container');
        /** @private */
        this._messageElement = this.shadowRoot.querySelector('#message');

        this.postTimeout = null;

        this.onPostTimeout = this.onPostTimeout.bind(this);
    }

    post(message, timeout = DEFAULT_TOAST_TIMEOUT)
    {
        this._containerElement.toggleAttribute('open', true);
        this._messageElement.innerHTML = message;

        clearTimeout(this.postTimeout);
        this.postTimeout = setTimeout(this.onPostTimeout, timeout);
    }

    onPostTimeout()
    {
        this._containerElement.toggleAttribute('open', false);
        this.postTimeout = null;
    }
}
window.customElements.define('toast-view', ToastView);
