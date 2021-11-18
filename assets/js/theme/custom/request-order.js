import PageManager from '../page-manager';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import CustomerData from './reactComponent/customerData'
import { showAlertModal } from '../global/modal';

export default class Custom extends PageManager {
    constructor(context) {
        super(context);
        this.$addToCartBtn = $('#request-order-btn');
        this.$inputIdOrder = $('#input-request-order')[0];
        this.$addToCartBtn.on('click', () => this.customAddToCartButton());
        this.$totalContainer = $('#request-order')[0];
        this.customerData = null;
    }
    customAddToCartButton () {
        let orderID = this.$inputIdOrder.value;
        fetch(`/api/storefront/orders/${orderID}`, { credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Provided order Id doesn't represent a valid order`);
                }
                return response.json()
            })
            .then(data => {
                ReactDOM.render(<CustomerData
                    customerId={data.customerId}
                    currency={data.currency.code}
                    orderId={data.orderId}
                    status={data.status}
                    billingAddress={data.billingAddress}
                    physicalItems={data.lineItems.physicalItems}
                    orderAmount={data.orderAmount}
                    discountAmount={data.discountAmount}
                    />, this.$totalContainer);
            })
            .catch(err => {
                console.log(err);
                showAlertModal(err);
            });
    }

}