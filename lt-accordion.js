const lt_accordion_template = document.createElement('template');
lt_accordion_template.innerHTML = `
<style>
    #accordion {
        max-height: 300px; 
        overflow: auto;
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
class Accordion extends HTMLElement {
    constructor() {
        super();
        this.collapsedOne;
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(lt_accordion_template.content.cloneNode(true));
        }
        this.addEventListener('collapse-clicked', function (e) {
            if(e.srcElement.hasAttribute('collapsed')){
                e.srcElement.hide();
                delete this.collapsedOne;
            }else{
                e.srcElement.collapse();
                if(this.collapsedOne) this.collapsedOne.hide();
                this.collapsedOne = e.srcElement;
            }
        });
    }

    clear() {
        const first_collapse = this.shadowRoot.querySelector('slot').assignedNodes()[0];
        //Let's remove all collapses
        if(first_collapse) first_collapse.parentElement.innerHTML = "";
    }
}
customElements.define('lt-accordion', Accordion);