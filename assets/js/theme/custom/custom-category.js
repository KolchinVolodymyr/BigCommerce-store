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
        get (`{site { products(entityIds: [${productID}]) { edges {
                            node {
                                id,
                                entityId,
                                name,
                                description,
                                sku,
                                productOptions {
                                    edges {
                                      node {
                                        entityId
                                        displayName
                                        ... on MultipleChoiceOption {
                                          displayStyle
                                          values {
                                            edges {
                                              node {
                                                entityId
                                                label
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                variants(first: 100) {
                                    edges {
                                      node {
                                        sku
                                        prices {
                                            price {
                                                value
                                                currencyCode
                                              }
                                        }
                                      }
                                    }
                                  }
                                inventory {
                                    aggregated {
                                        availableToSell
                                    }
                                }
                                prices {
                                    price { value, currencyCode }
                                }
                                defaultImage { url(width:1280) }
                            }
                        }
                     }
                   }
                 }`)
            .then((data) => {
                this.products = data.site.products;
                ReactDOM.render(<ProductItem data={data} onChange={this.onChange.bind(this)}/>, this.$container);
                this.amountProduct(data);
                ReactDOM.render(<ProductTotal total={this.total} currencyCode={this.currencyCode}/>, this.$totalContainer);
            }).then(()=>{
                this.products.forEach(el => {
                    el.productOptions.forEach(i=>{
                        document.getElementById(`${i.entityId}`).addEventListener('change', function (e){
                            el.optionSelections = [];
                            el.optionSelections.push({ "optionId": i.entityId, "optionValue": this.value});
                        });
                    });
                })
            })
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
                if(!isNaN(value) && value<=10) {
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
            errorMessage: 'Please enter a valid product quantity(from 0 to 10)'
        },{
            selector: $input,
            validate: function (callback, value) {
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
            }.bind(this),
            errorMessage: `We dont have enough stock on. Available quantity ${$input.context.dataset.productStock}. Please try again.`
        }]);
        this.Nod.performCheck();
    };

    /**
    *
    *
    */
    amountProduct(data) {
        data.site.products.forEach(el => {
            el.count = 0;
            document.getElementById(`${el.entityId}`).addEventListener("input", function() {
                el.count = document.getElementById(`${el.entityId}`).value;
                el.sumProduct = el.count*el.prices.price.value;
                this.sum(data.site.products);
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
        //let productCount = document.getElementById('qty[]').value;
        if (this.Nod.areAll('valid')) {
            if (this.total !== 0) {
                this.$overlay.show();
                for (const product of this.products) {
                    if(product.count !==0 && product.productOptions.length!==0) {
                        await this.createCartItems(`/api/storefront/carts/${this.cartItemsID ? `${this.cartItemsID}/item` : ''}`, {
                            "lineItems": [{
                                "quantity": product.count,
                                "productId": product.entityId,
                                "optionSelections":  product.optionSelections
                            }]
                        }).then(cart => {
                            this.cartItemsID = cart?.id;
                        })
                    }
                    if(product.count !==0 && product.productOptions.length==0) {
                         await this.createCartItems(`/api/storefront/carts/${this.cartItemsID ? `${this.cartItemsID}/item` : ''}`, {
                                "lineItems": [{
                                    "quantity": product.count,
                                    "productId": product.entityId
                                }]
                         }).then(cart => {
                             this.cartItemsID = cart?.id;
                         })
                    }
                }
                this.$overlay.hide();
                window.location = '/cart.php'
            } else {
                showAlertModal('корзина пустая, добавьте товар в корзину');
            }
        } else {
            showAlertModal('введите, валидные данные');
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
        }).then(response => response.json());
    };

    onReady() {
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