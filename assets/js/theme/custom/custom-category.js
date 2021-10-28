import PageManager from '../page-manager';
import get from 'bigcommerce-graphql';
import regeneratorRuntime from 'regenerator-runtime';
import utils from '@bigcommerce/stencil-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import ProductItem from './reactComponent/productItemOrder';
import ProductTotal from "./reactComponent/productOrderTotal";
import { showAlertModal } from '../global/modal';
import nod from "nod-validate";
import initApolloClient from '../global/graphql/client';
import flattenGraphQLResponse from 'humanize-graphql-response';
import productCategory from './gql/productCategory.gql';
import { gql } from '@apollo/client';

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
        this.stock_level = null;
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.$addToCartBtnAbove = $('#addToCart-above');
        this.$addToCartBtnBelow = $('#addToCart-below');
        this.$addToCartBtnAbove.on('click', () => this.customAddToCartButton());
        this.$addToCartBtnBelow.on('click', () => this.customAddToCartButton());
        this.Nod = nod();
        this.cartItemsID = '';
    }

    /**
    *
    *
    */
    getProduct(productID) {
        //console.log('this.context', this.context);
        console.log('productId',  productID);
        console.log('this,gqlClient', this.gqlClient);
        return this.gqlClient
            .query({
                query: productCategory,
                variables: { productId: productID },
            }).then((data) => {
                let newData = flattenGraphQLResponse(data);
                console.log('newData22', newData);
            });

        // return this.gqlClient
        //     .query({
        //         query:  gql`
        //             query getProductsIds {
        //                 site {
        //                     ${productID.reduce((query, product, index) => query + `
        //                         product${index}: product (sku: "${product.sku}") {
        //                             entityId
        //                         }
        //                     `, '')}
        //                 }
        //             }
        //         `,
        //         fetchPolicy: 'no-cache'
        //     }).then((data) => {
        //                 let newData = flattenGraphQLResponse(data);
        //                 console.log('newData22', newData);
        //             });

        // get (`{site { products(entityIds: [${productID}]) { edges {node {id,entityId,name,description, sku, productOptions {
        //         edges { node { entityId displayName
        //             ... on MultipleChoiceOption { displayStyle values { edges { node { entityId label } } } } } } }
        //     variants(first: 100) { edges { node { sku prices { price { value currencyCode } } } } }
        //     inventory { aggregated { availableToSell } } prices { price { value, currencyCode } } defaultImage { url(width:1280)}}}}}}`)
        //     .then((data) => {
        //         this.products = data.site.products.filter(el => el.productOptions.length === 0);
        //         ReactDOM.render(<ProductItem data={this.products} onChange={this.onChange.bind(this)}/>, this.$container);
        //         this.amountProduct(this.products);
        //         ReactDOM.render(<ProductTotal total={this.total} currencyCode={this.currencyCode}/>, this.$totalContainer);
        //     })
    }

    /**
    *
    *
    */
    onChange(e) {
        const $input = $(e.target);
        this.Nod.add([{
            // Raw dom element
            selector: $input,
            // Custom function. Notice that a call back is used. This means it should
            // work just fine with ajax requests (is user name already in use?).
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
            errorMessage: this.context.errorStockOn
        },{
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
    *
    *
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
    *
    *
    *
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
    *
    *
    *
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
                showAlertModal('Cart is empty, add product to cart ');
            }
        } else {
            showAlertModal('Enter valid data (0-10)');
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
    //console.log('this', this.context);
        this.$addToCartBtnAbove.prop('disabled', true);
        this.$addToCartBtnBelow.prop('disabled', true);
        this.getCart(`/api/storefront/carts`);

        this.context.products.forEach(element => {
            this.productsId.push(element.id);
            //this.stock_level = element.stock_level;
            this.currencyCode = element.price.without_tax.currency;
        });
        this.getProduct(this.productsId);
    }
}