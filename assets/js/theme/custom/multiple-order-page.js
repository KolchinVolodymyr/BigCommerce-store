import PageManager from '../page-manager'
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import initApolloClient from '../global/graphql/client';
import flattenGraphQLResponse from 'humanize-graphql-response';
import { render } from 'react-dom';
import customProductOptions from '../../gql/productOption.gql';
import MultipleProductItem from './reactComponent/multipleProductItem';

export default class CustomDemo extends PageManager {

    constructor(context) {
        super(context);
        this.$container = $('#variantsFormProduct')[0];
        this.productVariants = [];
        this.productId = this.context.productId;
        this.productInStock = this.context.productInStock;
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.pageSize = 10;
        this.cartItemsID = '';
    }


    async getOptions(cursor) {
        return this.gqlClient
        .query({
            query: customProductOptions,
            variables: { productId: parseInt(this.productId), pageSize: this.pageSize, cursor: cursor },
          }).then((data) => {
                let newData = flattenGraphQLResponse(data);
                this.productVariants = [...this.productVariants, ...newData.data.site.product.variants];
                if (data.data.site.product.variants.pageInfo.hasNextPage) {
                    return this.getOptions(data.data.site.product.variants.pageInfo.endCursor);
                }
          });
    }

    addToCart() {
        let cartItems = [];
        let qtyFields = Array.from(document.getElementsByClassName('qtyField'));
        for (const [i, item] of qtyFields.entries()) {
            if (item.value > 0 && parseInt(item.value)) {
                let lineItem = {
                    "quantity": parseInt(item.value),
                    "product_id": this.productId,
                    "variant_id": this.productVariants[i].entityId
                }
                cartItems.push(lineItem);
            }
        }
        this.createCart(cartItems);
    }



    /**
    *
    */
    createCart(lineitems) {
        fetch(`/api/storefront/cart`)
            .then(response => response.json())
            .then(cart => {
                this.cartItemsID = cart[0]?.id;
            })
            .then(()=> {
                this.createCartItems(`/api/storefront/carts/${this.cartItemsID ? `/${this.cartItemsID}/item` : ''}`, lineitems)
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


    onReady() {
        Promise.all([this.getOptions()]).then((data) => {
               ReactDOM.render(<MultipleProductItem variants={this.productVariants} />, this.$container);
               $('#productVariants').on('click', () => this.addToCart());
        })
    }
}