import PageManager from '../page-manager';
import get from 'bigcommerce-graphql';
import regeneratorRuntime from 'regenerator-runtime';
import utils from '@bigcommerce/stencil-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import ProductItem from './reactComponent/productItemOrder';
import ProductTotal from "./reactComponent/productOrderTotal";
import nod from "nod-validate";

export default class CustomCategory extends PageManager {
    constructor(context) {
        super(context);
        this.productsId = [];
        this.$container = $('#root')[0];
        this.$totalContainer = $('#total')[0];
        this.$input = $('.form-input-order');
        this.total = 0;
        this.products = [];
        this.$addToCartBtnAbove = $('#addToCart-above');
        this.$addToCartBtnBelow = $('#addToCart-below');
        this.$addToCartBtnAbove.on('click', () => this.customAddToCartButton());
        this.$addToCartBtnBelow.on('click', () => this.customAddToCartButton());
    }
    onReady() {
        this.context.products.forEach(element => {
            this.productsId.push(element.id);
        });
        this.getProduct(this.productsId);
    }

    /*
    *
    *
    */
    getProduct(productID) {
        get (`{site { products(entityIds: [${productID}]) { edges{ node{ id, entityId, name, description, sku, inventory {isInStock}, createdAt {utc} prices { price { value, currencyCode } } defaultImage { url(width:1280) } } } } } }`)
            .then((data) => {
                $('#addToCart-above')[0].setAttribute("disabled", "");
                $('#addToCart-below')[0].setAttribute("disabled", "")
                this.products = data.site.products;
                ReactDOM.render(<ProductItem data={data} onChange={this.onChange}/>, this.$container);
                this.amountProduct(data);
                ReactDOM.render(<ProductTotal total={this.total}/>, this.$totalContainer);
            });
    }

    /*
    *
    *
    */
    onChange(e) {
        const $input = $(e.target);
        nod().add([{
            // Raw dom element
            selector: $input,
            // Custom function. Notice that a call back is used. This means it should
            // work just fine with ajax requests (is user name already in use?).
            validate: function (callback, value) {
                if(!isNaN(value) && value<=10) {
                    $input.removeClass("form-field--error");
                    callback(true);
                    $('#addToCart-above')[0].removeAttribute("disabled");
                    $('#addToCart-below')[0].removeAttribute("disabled");
                } else {
                    $input.addClass("form-field--error");
                    callback(false);
                    $('#addToCart-above')[0].setAttribute("disabled", "");
                    $('#addToCart-below')[0].setAttribute("disabled", "");
                }
            },
            errorMessage: 'Please enter a valid product quantity(from 0 to 10)'
        }]);
    };

    /*
    *
    *
    */
    amountProduct(data) {
        data.site.products.forEach(el => {
            el.count = 0;
            document.getElementById(`${el.entityId}`).addEventListener("input", function(e) {
                el.count = document.getElementById(`${el.entityId}`).value;
                el.sumProduct = el.count*el.prices.price.value;
                this.sum(data.site.products);
            }.bind(this));
            el.sumProduct = el.count*el.prices.price.value;
        });
    }

    /*
    *
    *
    *
    */
    sum(products) {
        let priceArr = [];
        products.forEach(el=> {
            if(!isNaN(el.sumProduct)) {
                priceArr.push(el.sumProduct);
            }
        });
        this.total = priceArr.reduce((previousValue, currentValue) => previousValue + currentValue);
        ReactDOM.render(<ProductTotal total={this.total}/>, this.$totalContainer);
    }

    /*
    *
    *
    *
    */
    async customAddToCartButton () {
        for(const product of this.products) {
            $('.loadingOverlay')[0].style.display = 'block';
            await fetch(`/cart.php?action=add&product_id=${product.entityId}&qty=${product.count}`)
                .then(data => {
                    console.log('data', data);
                })
                .catch(error => {
                    console.log('error', error);
                    //showAlertModal('Hello')
                });
            $('.loadingOverlay')[0].style.display = 'none';
        }
        // go to cart
        window.location = "/cart.php";
    }
}