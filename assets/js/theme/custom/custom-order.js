import PageManager from '../page-manager';
import get from 'bigcommerce-graphql';
import regeneratorRuntime from 'regenerator-runtime';
import utils from '@bigcommerce/stencil-utils';
import React from 'react'
import ReactDOM from 'react-dom'
import ProductItem from './reactComponent/productItemOrder'
import ProductTotal from "./reactComponent/productOrderTotal";

export default class Custom extends PageManager {
    onReady() {
        let countryProduct = null;
        get (`{site { products(entityIds: [81,103,111]) { edges{ node{ id, entityId, name, description, sku, inventory {isInStock}, createdAt {utc} prices { price { value, currencyCode } } defaultImage { url(width:1280) } } } } } }`)
        .then((data) => {
            const container = $('#root')[0];
            const container2 = $('#total')[0];
            ReactDOM.render(<ProductItem context={data}/>, container);

            data.site.products.forEach(el => {
                el.count = 1;
                document.getElementById(`${el.entityId}`).addEventListener("input", function(e) {

                /* Validation start */
                const regex = /[0-9]/;
                const chars = e.target.value.split('');
                const char = chars.pop();
                if (!regex.test(char)) {
                    e.target.value = chars.join('');
                    alert('restricted symbol');
                }
                if(chars.length > 1 ){
                    alert('please input correct number');
                }
                /* Validation end */
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
                ReactDOM.render(<ProductTotal context={total}/>, container2);
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
    }
}