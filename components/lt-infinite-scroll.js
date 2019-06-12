const lt_infinite_scroll_template = document.createElement('template');
lt_infinite_scroll_template.innerHTML = `
<style>
:host #scroll-container {
    padding: 15px;
    background: white;
}
:host([active]) .lds-dual-ring {
    display: inline-block;
    width: 32px;
    height: 32px;
}
:host([active]) .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 23px;
    height: 23px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #d2ddeb;
    border-color: #d2ddeb transparent #d2ddeb transparent;
    animation: lds-dual-ring 1.2s linear infinite;
}
:host([active]) #no-more-content {
    display: none;
}
#no-more-content {
    color: #d2ddeb;
    font-weight: bold;
}
@keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
}

</style>
<div id="scroll-container">
    <div class="lds-dual-ring"><span id="no-more-content">No more content</span></div>
</div>
`;

window.ShadyCSS && ShadyCSS.prepareTemplate(lt_infinite_scroll_template, 'lt-infinite-scroll');

class InfiniteScroll extends HTMLElement {
    constructor() {
        super();
        this.page = 0;
        this.filter = null;
        window.ShadyCSS && ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({
                mode: 'open'
            });
            this.shadowRoot.appendChild(lt_infinite_scroll_template.content.cloneNode(true));
        }
    }
    connectedCallback() {
        this.setAttribute('active', '');
        let options = {
            rootMargin: '0px',
            threshold: 0.1
        }
        const callback = (entries, observer) => {
            if(this.active){
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.page++;
                        this.dispatchEvent(new Event('request-data', {
                            bubbles: true,
                            composed: true
                        }));
                    }
                });
            }
        };
        this.observer = new IntersectionObserver(callback, options);
        let target = this.shadowRoot.getElementById('scroll-container');
        this.observer.observe(target);
    }

    get active() {
        return this.hasAttribute('active');
    }

    set active(val) {
        if (val) this.setAttribute('active', ''); 
        else this.removeAttribute('active');
    }
}
customElements.define('lt-infinite-scroll', InfiniteScroll);