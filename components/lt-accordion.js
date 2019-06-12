const lt_accordion_template = document.createElement('template');
lt_accordion_template.innerHTML = `
<style>
    #accordion {
        max-height: 340px; 
        overflow: auto;
        max-height 0.5s cubic-bezier(0, 1, 0, 1);
    }
    ::-webkit-scrollbar {
        width: 7px;
    }
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey; 
    }
    ::-webkit-scrollbar-thumb {
        background: grey; 
        border-radius: 6px;
    }

</style>
<div id="accordion">
    <slot></slot>
</div>
`;

window.ShadyCSS && ShadyCSS.prepareTemplate(lt_accordion_template, 'lt-accordion');

class Accordion extends HTMLElement {
    constructor() {
        super();
        this.collapsedOne;
        window.ShadyCSS && ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(lt_accordion_template.content.cloneNode(true));
        }
        this.addEventListener('collapse-clicked', this.collapseClickedAction);
    }

    clear() {
        const first_collapse = this.shadowRoot.querySelector('slot').assignedNodes()[0];
        //Let's remove all collapses
        if(first_collapse) first_collapse.parentElement.innerHTML = "";
    }

    collapseClickedAction(e) {
        if(e.srcElement.hasAttribute('collapsed')){
            e.srcElement.hide();
            delete this.collapsedOne;
        }else{
            e.srcElement.collapse();
            if(this.collapsedOne) this.collapsedOne.hide();
            this.collapsedOne = e.srcElement;
        }
    }

    disconnectedCallback() {
        this.removeEventListener('collapse-clicked', this.collapseClickedAction);
    }
}
customElements.define('lt-accordion', Accordion);