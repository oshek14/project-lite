const lt_modal_template = document.createElement('template');
lt_modal_template.innerHTML = `
<style>
    #backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(45, 57, 90, 0.76);
        z-index: 10;
        opacity: 0;
        pointer-events: none;
    }

    :host([opened]) #backdrop,
    :host([opened]) #modal {
        opacity: 1;
        pointer-events: all;
    }

    :host([opened]) #modal {
        top: 15vh;
    }

    #modal {
        position: fixed;
        top: 15vh;
        left: 35%;
        width: 30%;
        z-index: 20;
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.26);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease-out;
    }
    @media (max-width: 1200px){
        #modal {
            width: 40%;
            left: 30%;
        }
    }
    @media (max-width: 1024px){
        #modal {
            width: 50%;
            left: 25%;
        }
    }
    @media (max-width: 768px){
        #modal {
            width: 70%;
            left: 15%;
        }
    }
    @media (max-width: 640px){
        #modal {
            width: 90%;
            left: 5%;
        }
    }
    header ::slotted(*) {
        padding: 0.5rem;
        font-size: 0.75rem;
        color: #75788a;
        margin: 0;
    }
    #content {
        padding: 1rem 2rem;
    }
    #modal-close {
        position: absolute;
        top: 0px;
        right: 10px;
        font-size: 20px;
        cursor: pointer;
        color: grey;
    }
</style>
<div id="backdrop"></div>
<div id="modal">
    <header>
        <slot name="headline"></slot>
        <span id="modal-close">x<span>
    </header>
    <section id="content">
        <slot></slot>
    </section>
</div>
`;

window.ShadyCSS && ShadyCSS.prepareTemplate(lt_modal_template, 'lt-modal');

class Modal extends HTMLElement {
    constructor() {
        super();
        window.ShadyCSS && ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({
                mode: 'open'
            });
            this.shadowRoot.appendChild(lt_modal_template.content.cloneNode(true));
        }
        this.isOpen = false;
        const backdrop = this.shadowRoot.querySelector('#backdrop');
        const modal_close = this.shadowRoot.querySelector('#modal-close');
        backdrop.addEventListener('click', this.hide.bind(this));
        modal_close.addEventListener('click', this.hide.bind(this));
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
customElements.define('lt-modal', Modal);