import PageManager from '../page-manager';
import get from 'bigcommerce-graphql';
import regeneratorRuntime from 'regenerator-runtime';
import utils from '@bigcommerce/stencil-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import ProductItem from './reactComponent/productItemOrder';
import ProductTotal from "./reactComponent/productOrderTotal";
import { showAlertModal } from '../global/modal';

export default class CustomCategory extends PageManager {
    constructor(context) {
        super(context);
        this.$overlay = $('.loadingOverlay');
        this.productsId = [];
        this.$container = $('#root')[0];
        this.$totalContainer = $('#total')[0];
        this.$input = $('.form-input-order');
        this.total = 0;
        this.preTotal = 0;
        this.currencyCode = null;
        this.products = [];
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.$addToCartBtnAbove = $('#addToCart-above');
        this.$addToCartBtnBelow = $('#addToCart-below');
        this.$addToCartBtnAbove.on('click', () => this.customAddToCartButton());
        this.$addToCartBtnBelow.on('click', () => this.customAddToCartButton());
        this.Nod = nod();
        this.cartItemsID = '';
    }

    /**
    * Get all products from a category
    */
    getProduct() {
        return this.gqlClient
            .query({
                query: productCategory,
            }).then((data) => {
                let newData = flattenGraphQLResponse(data);
                this.products = newData.data.site.route.node.products.filter(el => el.productOptions.length === 0);
                this.currencyCode = this.products[0]?.prices.price.currencyCode
                ReactDOM.render(<ProductItem data={this.products} onChange={this.onChange.bind(this)}/>, this.$container);
                this.amountProduct(this.products);
                ReactDOM.render(<ProductTotal total={this.total} currencyCode={this.currencyCode}/>, this.$totalContainer);
            });
    }

    /**
    * Event Listener input
    */
    onChange(e) {
        const $input = $(e.target);
        this.Nod.add([
        {
            selector: $input,
            validate: function (callback, value) {
                if(!isNaN(value) && value<10) {
                    if(this.total == 0) {
                        callback(true);
                        this.$addToCartBtnAbove.prop('disabled', true);
                        this.$addToCartBtnBelow.prop('disabled', true);
                    } else {
                        if(isNaN(this.preTotal)) {
                            callback(true);
                            this.$addToCartBtnAbove.prop('disabled', true);
                            this.$addToCartBtnBelow.prop('disabled', true);
                        } else {
                            callback(true);
                            this.$addToCartBtnAbove.prop('disabled', false);
                            this.$addToCartBtnBelow.prop('disabled', false);
                        }
                    }
                } else {
                    callback(false);
                    this.$addToCartBtnAbove.prop('disabled', true);
                    this.$addToCartBtnBelow.prop('disabled', true);
                }
          }.bind(this),
            errorMessage: this.context.enterValidData
        },
        {
            selector: $input,
            validate: function (callback, value) {
                if(this.total == 0) {
                    callback(true);
                    this.$addToCartBtnAbove.prop('disabled', true);
                    this.$addToCartBtnBelow.prop('disabled', true);
                } else {
                    if($input.context.dataset?.productStock == undefined) {
                        callback(true);
                    } else {
                        if(value <=  $input.context.dataset?.productStock) {
                            callback(true);
                            if( $('.form-field--error').length >= 1 ){
                                this.$addToCartBtnAbove.prop('disabled', true);
                                this.$addToCartBtnBelow.prop('disabled', true);
                            } else {
                                this.$addToCartBtnAbove.prop('disabled', false);
                                this.$addToCartBtnBelow.prop('disabled', false);
                            }
                        } else {
                            callback(false);
                            this.$addToCartBtnAbove.prop('disabled', true);
                            this.$addToCartBtnBelow.prop('disabled', true);
                        }
                    }
                }
            }.bind(this),
            errorMessage: `${this.context.errorStockOn} ${$input.context.dataset.productStock}`
        }]);
        this.Nod.performCheck();
    };

    /**
    * The amount of product on the page
    */
    amountProduct(data) {
        data.forEach(el => {
            el.count = 0;
            document.getElementById(`${el.entityId}`).addEventListener("input", function() {
                el.count = document.getElementById(`${el.entityId}`).value;
                el.sumProduct = el.count*el.prices.price.value;
                this.sum(data);
            }.bind(this));
            el.sumProduct = el.count*el.prices.price.value;
        });
    }

    /**
    * The total the page
    */
    sum(products) {
        let priceArr = [];
        let arr = [];
        products.forEach(el=> {
            arr.push(el.sumProduct);
            if(!isNaN(el.sumProduct)) {
                priceArr.push(el.sumProduct);
            }
        });
        this.total = priceArr.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0).toFixed(2);
        this.preTotal = arr.reduce((previousValue, currentValue) => {return previousValue + currentValue}, 0);
        ReactDOM.render(<ProductTotal total={this.total} currencyCode={this.currencyCode}/>, this.$totalContainer);
    }

    /**
    *  Add to cart
    */
    async customAddToCartButton () {
        if (this.Nod.areAll('valid')) {
            if (this.total !== 0) {
                this.$overlay.show();
                for (const product of this.products) {
                    if(product.count !==0) {
                         await this.createCartItems(`/api/storefront/carts/${this.cartItemsID ? `${this.cartItemsID}/item` : ''}`, {
                            "lineItems": [{
                                "quantity": product.count,
                                "productId": product.entityId
                            }]
                         })
                    }
                }
                this.$overlay.hide();
                window.location = '/cart.php';
            } else {
                showAlertModal(this.context.cartEmpty);
            }
        } else {
            showAlertModal(this.context.enterValidData);
        }
    }

    /**
     * Returns a Cart
     */
    getCart(url) {
        return fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(cart => {
            this.cartItemsID = cart[0]?.id
        })
        .catch(error => console.error(error));
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
            body: JSON.stringify(cartItems),
        }).then(response => response.json())
          .then((cart) => {this.cartItemsID = cart?.id})
    };

    onReady() {
        this.$addToCartBtnAbove.prop('disabled', true);
        this.$addToCartBtnBelow.prop('disabled', true);
        this.getCart(`/api/storefront/carts`);
        this.getProduct();
    }
}