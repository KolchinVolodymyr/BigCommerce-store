import PageManager from '../page-manager';
import get from 'bigcommerce-graphql';
import regeneratorRuntime from 'regenerator-runtime';
import utils from '@bigcommerce/stencil-utils';

export default class Custom extends PageManager {
    onReady() {
        let countryProduct = null;
        get (`{site { products(entityIds: [81,103,111]) { edges{ node{ id, entityId, name, description, sku, inventory {isInStock}, createdAt {utc} prices { price { value, currencyCode } } defaultImage { url(width:1280) } } } } } }`)
        .then((data) => {
            data.site.products.forEach(el => {
                var block = document.createElement("DIV");
                block.innerHTML = ` <p id="title" title="${el.name}"> ${el.name} <p>
                                    <img src="${el.defaultImage.url}" alt="">
                                    ${el.description}
                                    <input id="input_${el.entityId}" name="country" type="text"> `;

                document.getElementById("containerCustom").appendChild(block);
                el.count = 1;
                document.getElementById(`input_${el.entityId}`).addEventListener("input", function(e) {

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

                    var countryProduct = document.getElementById(`input_${el.entityId}`).value;

                    el.count =  countryProduct;
                    el.sumProd = el.count*el.prices.price.value;
                    sum(products);
                });
                el.sumProd = el.count*el.prices.price.value;
            });

            //listener input addToCart
            document.getElementById('addToCart').addEventListener('click', customAddToCartButton);

            var total_price = document.createElement("DIV");
            document.getElementById("containerCustom").appendChild(total_price);
            let products = data.site.products;

            function sum(products) {
                let priceArr = [];
                products.forEach(el=> {
                    priceArr.push(el.sumProd);
                });
                let total = priceArr.reduce((previousValue, currentValue) => previousValue + currentValue);
                total_price.innerHTML = `Total: ${total}`;
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