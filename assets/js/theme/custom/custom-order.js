import PageManager from '../page-manager';
import get from 'bigcommerce-graphql';
import regeneratorRuntime from 'regenerator-runtime';
import utils from '@bigcommerce/stencil-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import ProductItem from './reactComponent/productItemOrder';
import ProductTotal from "./reactComponent/productOrderTotal";
import nod from "nod-validate";

export default class Custom extends PageManager {
    constructor(context) {
        super(context);
    }
    onReady() {
        let countryProduct = null;
        let currencyCode = null;
        get (`{site { products(entityIds: [81,103,111]) { edges{ node{ id, entityId, name, description, sku, inventory {isInStock}, createdAt {utc} prices { price { value, currencyCode } } defaultImage { url(width:1280) } } } } } }`)
        .then((data) => {
            const container = $('#root')[0];
            const container2 = $('#total')[0];
            ReactDOM.render(<ProductItem data={data} onChange={onChange}/>, container);

            data.site.products.forEach(el => {
                el.count = 1;
                currencyCode = el.prices.price.currencyCode;
                document.getElementById(`${el.entityId}`).addEventListener("input", function(e) {
                var countryProduct = document.getElementById(`${el.entityId}`).value;
                    el.count =  countryProduct;
                    el.sumProd = el.count*el.prices.price.value;
                    sum(products);
                });
                el.sumProd = el.count*el.prices.price.value;
            });

            //listener input addToCart
            document.getElementById('addToCart').addEventListener('click', customAddToCartButton);
            let products = data.site.products;

            function sum(products) {
                let priceArr = [];
                products.forEach(el=> {
                    priceArr.push(el.sumProd);
                });
                let total = priceArr.reduce((previousValue, currentValue) => previousValue + currentValue);
                ReactDOM.render(<ProductTotal total={total} currencyCode={currencyCode}/>, container2);
            }
            sum(products);

            async function customAddToCartButton () {
                for( const product of products) {
                    await fetch(`/cart.php?action=add&product_id=${product.entityId}&qty=${product.count}`);
                }
                // go to cart
                window.location = "/cart.php";
            };
        });

function announceInputErrorMessage({ element, result }) {
    if (result) {
        return;
    }
    const activeInputContainer = $(element).parent();
    // the reason for using span tag is nod-validate lib
    // which does not add error message class while initialising form.
    // specific class is added since it can be multiple spans
    const errorMessage = $(activeInputContainer).find('span.form-inlineMessage');

    if (errorMessage.length) {
        const $errMessage = $(errorMessage[0]);

        if (!$errMessage.attr('role')) {
            $errMessage.attr('role', 'alert');
        }
    }
} ;


        const onChange = (e) => {
            const $input = $(e.target);
            nod().add([{
                // Raw dom element
                selector: $input,
                // Custom function. Notice that a call back is used. This means it should
                // work just fine with ajax requests (is user name already in use?).
                validate: function (callback, value) {
                    if(!isNaN(value) && value<10) {
                        $input.removeClass("form-field--error");
                        callback(true);
                    } else {
                        $input.addClass("form-field--error");
                        callback(false);
                    }
                },
                errorMessage: 'Please enter a valid product quantity(from 0 to 10)'
            }]);
        };
    }
}