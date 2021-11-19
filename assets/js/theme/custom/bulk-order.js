import PageManager from '../page-manager';
import initApolloClient from '../global/graphql/client';
import customerData from './gql/customerData.gql';
import getProductsSKU from './gql/getProductsSKU.gql';
import React from 'react';
import ReactDOM from 'react-dom';
import OrderBulkProductsTable from './reactComponent/OrderBulkProductsTable';
import 'regenerator-runtime/runtime';
import swal from '../global/sweet-alert';

export default class CustomBulkOrder extends PageManager {
    constructor(context) {
        super(context);
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.productSKUsArray = null;
        this.productsList = [];
        this.$container = $('.bulk-order-container')[0];
        this.showPage = null;
        this.productVariants = [];
    }

    onReady() {
        this.gqlClient.query({
            query: customerData,
        }).then(res => {
            this.showPage = Number(res.data.customer.attributes.showPage.value);
            this.productSKUsArray = res.data.customer.attributes.productBulkOrderList.value.replace(/\s/g, '').split(',');
            this.getProductsData(this.productSKUsArray);
        })
    }


     /**
     *
     * @param {String} productSkuItem
     */
     productsSKU(productSkuItem) {
        return this.gqlClient.query({
            query: getProductsSKU,
            variables: { sku: productSkuItem },
        }).then(res => {
            if(res.data.site.product !== null) {
                this.productsList.push(res.data.site.product);
            }
        })
    }

     /**
     *
     * @param {Array} productSKUs
     */
     getProductsData(productSKUs){
        this.forEachPromise(productSKUs)
            .then(() => {
                this.showPage === 1 ?  ReactDOM.render(<OrderBulkProductsTable productsList={this.productsList}/>, this.$container) : null;
                $('#productVariants').on('click', () => this.addToCart());
                $('#productVariants')[0].setAttribute("disabled", "");
            });
     }

    /**
    *
    * @param items An array of items.
    * @returns {Promise}
    */
    forEachPromise(items) {
        return items.reduce(function (promise, item) {
            return promise.then(function () {
                return this.productsSKU(item);
            }.bind(this));
        }.bind(this), Promise.resolve());
    }

    /**
    * Adds a product to the cart
    */
    addToCart() {
    let num = Number($('#totalPriceValue')[0].innerHTML).toFixed(0);
        if(Number(num)!== 0) {
            let cartItems = [];
            let qtyFields = Array.from(document.getElementsByClassName('qtyField'));
            for (const [i, item] of qtyFields.entries()) {
                if (item.value > 0 && parseInt(item.value)) {
                    let lineItem = {
                        "quantity": parseInt(item.value),
                        "productId": this.productsList[i].entityId,
                    }
                    cartItems.push(lineItem);
                }
            }
            this.createCart(cartItems);
        } else {
           return swal.fire({
               text: "Please select at least one product",
               icon: 'error',
           });
        }
    }

    /**
    * Adds a line items to the Cart
    */
    createCart(lineItems) {
        fetch(`/api/storefront/cart`)
            .then(response => response.json())
            .then(cart => {
                this.cartItemsID = cart[0]?.id;
            })
            .then(()=> {
                this.createCartItems(`/api/storefront/carts/${this.cartItemsID ? `${this.cartItemsID}/item` : ''}`, lineItems)
            })
    }

    /**
    * Creates a Cart
    */
    createCartItems(url, cartItems) {
        return fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ lineItems: cartItems}),
        })
        .then(response => response.json())
        .then(()=> {window.location = '/cart.php'})
    };

}