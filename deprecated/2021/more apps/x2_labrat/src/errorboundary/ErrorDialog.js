import { attachShadowTemplate } from '@milque/cuttle.macro';

import INNER_HTML from './ErrorDialog.template.html';
import INNER_STYLE from './ErrorDialog.module.css';

export class ErrorDialog extends HTMLElement
{
    constructor()
    {
        super();
        attachShadowTemplate(this, INNER_HTML, INNER_STYLE, { mode: 'open' });

        /** @private */
        this._containerElement = this.shadowRoot.querySelector('.container');
    }
}
window.customElements.define('error-dialog', ErrorDialog);
