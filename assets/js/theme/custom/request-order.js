import PageManager from '../page-manager';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import CustomerData from './reactComponent/customerData'

export default class Custom extends PageManager {
    constructor(context) {
        super(context);
        this.$addToCartBtn = $('#request-order-btn');
        this.$inputIdOrder = $('#input-request-order')[0];
        this.$addToCartBtn.on('click', () => this.customAddToCartButton());
        this.$totalContainer = $('#request-order')[0];
        this.customerData = null;
    }
    onReady() {

    }

    async customAddToCartButton () {
        let orderID = this.$inputIdOrder.value;
        const response = await fetch(`/api/storefront/orders/${orderID}`, { credentials: 'include' });
        const data = await response.json();
        console.log('data', data);
        ReactDOM.render(<CustomerData
                            orderId={data.orderId}
                            status={data.status}
                            billingAddress={data.billingAddress}
                            physicalItems={data.lineItems.physicalItems}
                            orderAmount={data.orderAmount}
                            discountAmount={data.discountAmount}
                            />, this.$totalContainer);
    }

}