import PageManager from '../page-manager';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import CustomerData from './reactComponent/customerData'
import { showAlertModal } from '../global/modal';
import initApolloClient from '../global/graphql/client';
import customerData from './gql/customerData.gql';
import CustomerLogged from './reactComponent/CustomerLogged';
import nod from "nod-validate";

export default class Custom extends PageManager {
    constructor(context) {
        super(context);
        this.$addToCartBtn = $('#request-order-btn');
        this.$inputIdOrder = $('#input-request-order')[0];
        this.$addToCartBtn.on('click', () => this.customAddToCartButton());
        this.$totalContainer = $('#request-order')[0];
        this.customerData = null;
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
    }
    onReady() {
        this.gqlClient.query({
           query: customerData,
        }).then(res => {
            ReactDOM.render(<CustomerLogged logged={res.data.customer}/>, this.$totalContainer);
        })
   }
   /*
   handleChange(e) {
           const $input = $(e.target);
           const inputValue =  e.target.value.replace(/[^0-9]/g, "");
           this.setState({ inputValue });

           this.Nod.add([{
               selector:  $input,
               validate: function (callback, value){
                   if (value>this.stock) {
                       callback(false);
                       $('#productVariants')[0].setAttribute("disabled", "");
                   } else {
                       callback(true);
                       if( $('.form-field--error').length >= 1 ){
                           $('#productVariants')[0].setAttribute("disabled", "");
                       } else {
                           $('#productVariants')[0].removeAttribute("disabled");
                       }
                   }
               }.bind(this),
               errorMessage: `${this.props.errorMessageStock} ${this.stock}`
           }]);
           this.Nod.performCheck();

           this.productVariantPrice = e.target.value.replace(/[^\d]/g,'') * this.props.variant.prices.price.value;
           this.props.changeTotal(this.props.variant.entityId, this.productVariantPrice);
       }
       */
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