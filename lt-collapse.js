const lt_collapse_template = document.createElement('template');
lt_collapse_template.innerHTML = `
<style>
    :host #collapse {
        padding: 15px;
        border-bottom: 1px solid lightgray;
    }
    :host #collapse {
        background: white;
    }
    :host([collapsed]) #collapse {
        background: #fafafa;
    }
    slot[name=body]::slotted(*) {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
    }
    :host([collapsed]) slot[name=body]::slotted(*) {
        
    }
</style>
<div id="collapse">
    <slot name="header"></slot>
    <slot name="body"></slot>
</div>
`;
class Collapse extends HTMLElement {
    constructor() {
        super();
        if (!this.shadowRoot) {
            this.attachShadow({
                mode: 'open'
            });
            this.shadowRoot.appendChild(lt_collapse_template.content.cloneNode(true));
        }
        this.addEventListener('click', function (e) {
            this.dispatchEvent(new Event('collapse-clicked', {bubbles: true, composed: true}));
        });
    }

    connectedCallback() {
        this.hide();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.isCollapsed = this.hasAttribute('collapsed');
        const slots = this.shadowRoot.querySelectorAll('slot');
        const height = this.isCollapsed ? slots[1].assignedNodes()[0].scrollHeight + "px" : 0;
        slots[1].assignedNodes()[0].style.maxHeight = height
    }

    static get observedAttributes() {
        return ['collapsed'];
    }

    collapse() {
        this.setAttribute('collapsed', '');
        this.isCollapsed = true;
    }

    hide() {
        if (this.hasAttribute('collapsed')) {
            this.removeAttribute('collapsed');
        }
        this.isCollapsed = false;
    }
}
customElements.define('lt-collapse', Collapse);