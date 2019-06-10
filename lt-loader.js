const lt_loader_template = document.createElement('template');
lt_loader_template.innerHTML = `
<style>
    :host([opened]) #backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        pointer-events: all;
        z-index: 100;
    }
    :host([opened]) #lt-loader {
        position: fixed;
        top: 35vh;
        left: calc(50% - 32px);
        display: inline-block;
        width: 64px;
        height: 64px;
        z-index: 200;
    }
    :host([opened]) #lt-loader:after {
        content: " ";
        display: block;
        width: 46px;
        height: 46px;
        margin: 1px;
        border-radius: 50%;
        border: 5px solid #03a9f4;
        border-color: #03a9f4 transparent #03a9f4 transparent;
        animation: lt-loader 1.2s linear infinite;
    }
    @keyframes lt-loader {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
<div id="backdrop"></div>
<div id="lt-loader"></div>
`;
class Loader extends HTMLElement {
    constructor() {
        super();
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(lt_loader_template.content.cloneNode(true));
        }
        this.isOpen = false;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.isOpen = this.hasAttribute('opened');
    }

    static get observedAttributes() {
        return ['opened'];
    }

    open() {
        this.setAttribute('opened', '');
        this.isOpen = true;
    }

    hide() {
        if (this.hasAttribute('opened')) {
            this.removeAttribute('opened');
        }
        this.isOpen = false;
    }
}
customElements.define('lt-loader', Loader);