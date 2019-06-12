const apiBaseUrl = "http://localhost";
// const apiBaseUrl = "http://178.128.90.148";
const dbPort = 3000;

/** 
 * Fetches paginated data and data count from json-server
 * calls renderPaymentData function with that information 
 * and deactivates infinite scroll if data runs out
 */
const fetchPaymentData = async () => {
    const infinite_scroll = document.querySelector('lt-infinite-scroll');
    const page = infinite_scroll.page;
    const filter = infinite_scroll.filter;
    const limit = 5;
    const popup = document.querySelector('lt-popup');
    const url = filter ? 
            `${apiBaseUrl}:${dbPort}/payments?searchfield_like=${filter}&_sort=id&_order=desc&_page=${page}&_limit=${limit}` :
            `${apiBaseUrl}:${dbPort}/payments?_sort=id&_order=desc&_page=${page}&_limit=${limit}`;
    try {
        const response = await fetch(url);
        if (response.status !== 200) throw err;
        try {
            const count = response.headers.get("X-Total-Count");
            const payments = await response.json();
            renderPaymentData(payments, count)
            if (payments.length < limit || payments.length == 0) infinite_scroll.active = false;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        popup.toggle("Upss.. something bad happened", true);
    }
}


/** 
 * Adds privided data in json-server database and
 * uppend new record in our list
 */
const addPaymentData = async (data, form) => {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const loader = document.querySelector('lt-loader');
    const modal = document.querySelector('lt-modal');
    const popup = document.querySelector('lt-popup');
    loader.open();
    url = `${apiBaseUrl}:${dbPort}/payments`;
    try {
        const response = await fetch(url, options);
        if (response.status !== 201) throw err;
        try {
            const data = await response.json();
            modal.hide();
            form.reset();
            appendPayment(data);
            loader.hide();
            popup.toggle("Payment added succesfully", false);
        } catch (err) {
            throw err;
        }
    } catch (err) {
        popup.toggle("Upss.. something bad happened", true);
        loader.hide();
    }
}


/** 
 * Clears our accordeon and uppends only infinite scroll
 * so that infinite scroll will fetch data again
 */
const refreshPaymentData = (filter) => {
    const accordion = document.querySelector('lt-accordion');
    const infinite_scroll = document.createElement('lt-infinite-scroll');
    infinite_scroll.filter = filter;
    accordion.clear();
    accordion.appendChild(infinite_scroll);
}


/** 
 * Takes payments array and uppends
 * each of them in our list
 */

const renderPaymentData = (payments, count) => {
    payments.map(payment => {
        appendPayment(payment, true, count);
    })
}


/** 
 * Creates payment template and appends it in our list
 * Appends below if position is given and it's true
 * Appends above if not is given or it's false
 * Also updates payments count or increments it if count isn't given (this means just new payment is added)
 * If filter is applied to infinite scroll, refreshes data.
 */
const appendPayment = (payment, position, count) => {
    const total_payment = document.querySelector('.payment-total');
    const infinite_scroll = document.querySelector('lt-infinite-scroll');
    const accordion = document.querySelector('lt-accordion');
    const collapse_template = document.getElementById('collapse-template');
    const records_count = document.getElementById('records-number');
    const tmpl = collapse_template.content.cloneNode(true);
    buildPaymentTemplate(tmpl, payment);
    records_count.innerText = count ? count : parseInt(records_count.innerText) + 1;
    total_payment.innerText = Math.round((parseFloat(total_payment.innerText) + parseFloat(payment.amount)) * 100) / 100;
    
    if (position) accordion.insertBefore(tmpl, infinite_scroll);
    else if (infinite_scroll.filter) refreshPaymentData(); 
    else accordion.insertBefore(tmpl, accordion.firstChild);
}


/**Builds given template with given payment data */
const buildPaymentTemplate = (tmpl, payment) => {
    tmpl.querySelector("lt-collapse").setAttribute('id', 'lt-collapse-' + payment.id);
    tmpl.querySelector('h3').innerText = payment.title;
    tmpl.querySelector('.payment-value').innerText = payment.amount;
    tmpl.querySelector('.payment-category').innerText = payment.category;
    tmpl.querySelector('.payment-value-container').classList.add((parseFloat(payment.amount) > 0) ? "payment-positive" : "payment-negative");
    tmpl.querySelector('.payment-date').innerText = "on " + (new Date(payment.date)).toDateString();
    tmpl.querySelector('.payment-comment').innerText = payment.comment;
}


/**Just opens modal */
const showModal = () => {
    document.querySelector('lt-modal').open();
}


/**Validates and submits our modal form */
const submitForm = () => {
    const form = document.getElementById('my-form');
    if (form.checkValidity()) {
        const formData = new FormData(form);
        const postData = {};
        for (let pair of formData.entries()) {
            postData[pair[0]] = pair[1];
        }
        //json-server doesn't provide OR operator, so let's create one string to filter by any property.
        const search_text = postData['title'] + "/^%" + postData['category'] + "/^%" + postData['comment'];
        postData['searchfield'] = search_text.toLowerCase();
        addPaymentData(postData, form);
    } else {
        //so that for is not valid and we can submit for validation error check
        form.querySelector('#hidden-submit').click();
    }
}


/**Refreshes payment data providing filter text */
const filter = () => {
    document.querySelector('.payment-total').innerText = 0;
    let filter_text = document.getElementById('filter-input').value;
    filter_text = filter_text.replace('/^%', '').toLowerCase();
    refreshPaymentData(filter_text);
}