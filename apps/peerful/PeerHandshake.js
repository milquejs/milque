import * as peerful from './peerful.js';

export class PeerHandshake extends HTMLElement
{
    static get template()
    {
        const INNER_HTML = `
        <dialog id="handshakeRequest">
            <p>Ready to join?</p>
            <input type="text" placeholder="Offer Code" id="handshakeOfferInput">
            <button id="handshakeOfferPaste">Paste</button>
            <p class="centered">
                <button id="handshakeJoin" class="fullWidth" disabled>Join</button>
            </p>
            <hr>
            <p>Or are you hosting?</p>
            <p class="centered">
                <button id="handshakeHost" class="fullWidth">Host</button>
            </p>
            <button id="handshakeBack" class="fullWidth">Back</button>
        </dialog>
        <dialog id="handshakeResponse">
            <p>Give this to them to start.</p>
            <p>
                <output>
                    <input type="text" readonly id="handshakeResponseInput">
                    <button id="handshakeResponseCopy">Copy</button>
                </output>
            </p>
            <hr>
            <p>Waiting for response...</p>
            <div id="handshakeResponseAnswerRoot" class="hidden">
                <p>
                    <input type="text" placeholder="Answer Code" id="handshakeAnswerInput">
                    <button id="handshakeAnswerPaste">Paste</button>
                </p>
                <p>
                    <button id="handshakeSelf" class="fullWidth">Answer Self</button>
                </p>
            </div>
            <button id="handshakeStart" class="fullWidth" disabled>Start Session</button>
            <button id="handshakeCancel" class="fullWidth">Cancel</button>
        </dialog>
        `;
        const template = document.createElement('template');
        template.innerHTML = INNER_HTML;
        Object.defineProperty(this, 'template', {
            value: template
        });
        return template;
    }

    static get style()
    {
        const INNER_STYLE = `
        dialog {
            background-color: white;
            color: black;
        }
        .fullWidth {
            width: 100%;
        }
        .centered {
            text-align: center;
        }
        .hidden {
            display: none;
        }
        `;
        const style = document.createElement('style');
        style.innerHTML = INNER_STYLE;
        Object.defineProperty(this, 'style', {
            value: style
        });
        return style;
    }

    static get observedAttributes()
    {
        return ['open'];
    }

    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.constructor.template.content.cloneNode(true));
        this.shadowRoot.appendChild(this.constructor.style.cloneNode(true));

        this._requestDialog = this.shadowRoot.querySelector('#handshakeRequest');
        this._responseDialog = this.shadowRoot.querySelector('#handshakeResponse');

        this._joinOfferInput = this.shadowRoot.querySelector('#handshakeOfferInput');
        this._joinOfferPaste = this.shadowRoot.querySelector('#handshakeOfferPaste');

        this._hostAnswerInput = this.shadowRoot.querySelector('#handshakeAnswerInput');
        this._hostAnswerPaste = this.shadowRoot.querySelector('#handshakeAnswerPaste');

        this._responseInput = this.shadowRoot.querySelector('#handshakeResponseInput');
        this._responseCopy = this.shadowRoot.querySelector('#handshakeResponseCopy');
        this._responseAnswerRoot = this.shadowRoot.querySelector('#handshakeResponseAnswerRoot');
        
        this._host = this.shadowRoot.querySelector('#handshakeHost');
        this._join = this.shadowRoot.querySelector('#handshakeJoin');
        this._start = this.shadowRoot.querySelector('#handshakeStart');
        this._hostSelf = this.shadowRoot.querySelector('#handshakeSelf');

        this._back = this.shadowRoot.querySelector('#handshakeBack');
        this._cancel = this.shadowRoot.querySelector('#handshakeCancel');

        this.onHost = this.onHost.bind(this);
        this.onJoin = this.onJoin.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onHostSelf = this.onHostSelf.bind(this);

        this.onOfferInputChange = this.onOfferInputChange.bind(this);
        this.onAnswerInputChange = this.onAnswerInputChange.bind(this);

        this.onOfferPaste = this.onOfferPaste.bind(this);
        this.onAnswerPaste = this.onAnswerPaste.bind(this);
        this.onResponseCopy = this.onResponseCopy.bind(this);

        this.onBack = this.onBack.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.oncomplete = null;
        this.onerror = null;

        this.handshake = null;
        this._selfHandshake = null;
    }

    /** @override */
    connectedCallback()
    {
        this._host.addEventListener('click', this.onHost);
        this._join.addEventListener('click', this.onJoin);
        this._start.addEventListener('click', this.onStart);
        this._hostSelf.addEventListener('click', this.onHostSelf);

        this._joinOfferInput.addEventListener('input', this.onOfferInputChange);
        this._hostAnswerInput.addEventListener('input', this.onAnswerInputChange);

        this._joinOfferPaste.addEventListener('click', this.onOfferPaste);
        this._hostAnswerPaste.addEventListener('click', this.onAnswerPaste);
        this._responseCopy.addEventListener('click', this.onResponseCopy);

        this._back.addEventListener('click', this.onBack);
        this._cancel.addEventListener('click', this.onCancel);
    }

    /** @override */
    attributeChangedCallback(attribute, prev, value)
    {
        switch(attribute)
        {
            case 'open':
                if (value !== null)
                {
                    this._requestDialog.open = true;
                }
                else
                {
                    this._requestDialog.open = false;
                    this._responseDialog.open = false;
                }
                break;
        }
    }

    onHost(e)
    {
        // Stop for processing...
        this._host.disabled = true;

        // Start trying to host.
        peerful.offerHandshake()
            .then(handshake => {
                this.handshake = handshake;

                let offerData = this.handshake.offer;
                let offerCode = peerful.encodeOfferCode(offerData);
                this._responseInput.value = offerCode;
                copyTextToClipboard(offerCode);
                // Now simply wait for the remote key...

                // Prepare the next dialog.
                this._responseAnswerRoot.classList.toggle('hidden', false);
                this._hostAnswerInput.value = '';
                this._start.disabled = true;
                this._hostSelf.disabled = false;

                // Auto-resolve when connected...
                handshake.get().then(() => {
                    this.dispatchEvent(new CustomEvent('complete', {composed: true, bubbles: false, detail: { handshake }}));
                    this.open = false;
                });

                // Got to the next dialog.
                this._requestDialog.open = false;
                this._responseDialog.open = true;
                
                // Restart.
                this._host.disabled = false;
            })
            .catch(e => {
                console.error(e);
                window.alert(JSON.stringify(e));

                this.handshake.cancel();

                // Restart.
                this._host.disabled = false;
            });
    }

    onJoin(e)
    {
        let offerCode = this._joinOfferInput.value;
        if (!offerCode) return;
        let offerData = peerful.decodeOfferCode(offerCode);

        // Stop for processing...
        this._joinOfferPaste.disabled = true;
        this._joinOfferInput.disabled = true;
        this._join.disabled = true;

        // Start trying to join the offer code.
        peerful.answerHandshake(offerData)
            .then(handshake => {
                this.handshake = handshake;

                let answerData = this.handshake.answer;
                let answerCode = peerful.encodeAnswerCode(answerData);
                this._responseInput.value = answerCode;
                copyTextToClipboard(answerCode);
                // Now simply wait for the remote key...

                // Prepare the next dialog.
                this._responseAnswerRoot.classList.toggle('hidden', true);
                this._start.disabled = true;

                // Auto-resolve when connected...
                handshake.get().then(() => {
                    this.dispatchEvent(new CustomEvent('complete', {composed: true, bubbles: false, detail: { handshake }}));
                    this.open = false;
                });

                // Got to the next dialog.
                this._requestDialog.open = false;
                this._responseDialog.open = true;
                
                // Restart.
                this._joinOfferInput.value = '';
                this._joinOfferPaste.disabled = false;
                this._joinOfferInput.disabled = false;
                this._join.disabled = false;
            })
            .catch(e => {
                console.error(e);
                window.alert(JSON.stringify(e));

                this.handshake.cancel();

                // Restart.
                this._joinOfferInput.value = '';
                this._joinOfferPaste.disabled = false;
                this._joinOfferInput.disabled = false;
                this._join.disabled = false;
            });
    }

    onStart(e)
    {
        let answerCode = this._hostAnswerInput.value;
        if (!answerCode) return;
        let answerData = peerful.decodeAnswerCode(answerCode);

        // Stop for processing...
        this._start.disabled = true;

        // Start trying to join the offer code.
        peerful.acceptHandshake(answerData, this.handshake)
            .then(handshake => {
                // Restart.
                this._start.disabled = false;
            })
            .catch(e => {
                console.error(e);
                window.alert(JSON.stringify(e));

                this.handshake.cancel();

                // Restart.
                this._start.disabled = false;
            });
    }

    onHostSelf(e)
    {
        let offerCode = this._responseInput.value;
        if (!offerCode) return;
        let offerData = peerful.decodeOfferCode(offerCode);

        // Start trying to join the offer code.
        peerful.answerHandshake(offerData)
            .then(handshake => {
                this._selfHandshake = handshake;

                let answerData = handshake.answer;
                let answerCode = peerful.encodeAnswerCode(answerData);
                this._hostAnswerInput.value = answerCode;

                this._start.disabled = false;
                this._hostSelf.disabled = true;

                // Auto-resolve when connected...
                handshake.get().then(() => {
                    this.dispatchEvent(new CustomEvent('complete', {composed: true, bubbles: false, detail: { handshake }}));
                    this.open = false;
                });
            })
            .catch(e => {
                console.error(e);
                window.alert(JSON.stringify(e));

                this._selfHandshake.cancel();

                // Restart.
                this._joinOfferInput.value = '';
                this._joinOfferPaste.disabled = false;
                this._joinOfferInput.disabled = false;
                this._join.disabled = false;
            });
    }

    onOfferInputChange(e)
    {
        if (this._joinOfferInput.value)
        {
            this._join.disabled = false;
        }
        else
        {
            this._join.disabled = true;
        }
    }

    onAnswerInputChange(e)
    {
        if (this._hostAnswerInput.value)
        {
            this._start.disabled = false;
        }
        else
        {
            this._start.disabled = true;
        }
    }

    onOfferPaste(e)
    {
        pasteTextFromClipboard(this._joinOfferInput).then(() => this.onOfferInputChange());
    }

    onAnswerPaste(e)
    {
        pasteTextFromClipboard(this._hostAnswerInput).then(() => this.onAnswerInputChange());
    }

    onResponseCopy(e)
    {
        copyTextToClipboard(this._responseInput.value);
    }

    onCancel(e)
    {
        // Close the existing connection.
        if (this.handshake)
        {
            this.handshake.cancel(new Error('Connection cancelled.'));
        }

        this.onBack(e);
    }

    onBack(e)
    {
        if (this.open) this.open = false;
    }

    get open() { return this.hasAttribute('open'); }
    set open(value) { return value ? this.setAttribute('open', '') : this.removeAttribute('open'); }
}
window.customElements.define('peer-handshake', PeerHandshake);

async function copyTextToClipboard(value)
{
    await navigator.clipboard.writeText(value);
}

async function pasteTextFromClipboard(element)
{
    let text = await navigator.clipboard.readText();
    element.value = text;
}
