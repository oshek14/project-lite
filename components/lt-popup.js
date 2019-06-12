const lt_popup_template = document.createElement('template');
lt_popup_template.innerHTML = `
<style>
    :host([opened]) #popup {
        opacity: 1;
        pointer-events: all;
        top: 3vh;
    }

    :host([error]) #popup {
        background: #f8a59f;
    }

    #popup {
        position: fixed;
        top: 3vh;
        left: 35%;
        width: 30%;
        z-index: 50;
        background: #b0ffb3;
        box-shadow: 0 2px 8px rgba(0,0,0,0.26);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease-out;
        border-radius: 5px;
    }
    @media (max-width: 768px){
        #popup {
            width: 60%;
            left: 20%;
        }
    }
    @media (max-width: 640px){
        #popup {
            width: 80%;
            left: 10%;
        }
    }
    h4 {
        padding: 0.5rem;
        font-size: 0.75rem;
        color: grey;
        margin: 0;
    }
    #content {
        padding: 1rem 2rem;
    }
</style>
<div id="backdrop"></div>
<div id="popup">
    <header>
        <h4 slot="headline">MESSAGE</h4>
    </header>
    <section id="content"><h4 id="message-text"></h4></section>
</div>
`;

window.ShadyCSS && ShadyCSS.prepareTemplate(lt_popup_template, 'lt-popup');

class Popup extends HTMLElement {
    constructor() {
        super();
        window.ShadyCSS && ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({
                mode: 'open'
            });
            this.shadowRoot.appendChild(lt_popup_template.content.cloneNode(true));
        }
    }

    connectedCallback() {
        if (this.hasAttribute('opened')) this.removeAttribute('opened')
    }

    toggle(text, error){
        if(error) this.setAttribute('error', '');
        else if (this.hasAttribute('error')) this.removeAttribute('error')
        this.shadowRoot.getElementById("message-text").innerText = text;
        this._open();
        setTimeout(() => {
            this._hide();
        }, 3000);
    }

    _open(){
        this.setAttribute('opened', '');
    }

    _hide(){
        if (this.hasAttribute('opened')) this.removeAttribute('opened');
    }
}

customElements.define('lt-popup', Popup);