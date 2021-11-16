import PageManager from '../page-manager';
import initApolloClient from '../global/graphql/client';
import customerData from './gql/customerData.gql';
import getProductsSKU from './gql/getProductsSKU.gql';
import React from 'react';
import ReactDOM from 'react-dom';
import OrderBulkProductsTable from './reactComponent/OrderBulkProductsTable';
import 'regenerator-runtime/runtime';


export default class CustomBulkOrder extends PageManager {
    constructor(context) {
        super(context);
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.productSKUsArray = null;
        this.productsList = [];
        this.$container = $('.bulk-order-container')[0];
    }

    onReady() {
        this.gqlClient.query({
            query: customerData,
        }).then(res => {
            this.productSKUsArray = res.data.customer.attributes.productBulkOrderList.value.replace(/\s/g, '').split(',');
//            console.log('this.productSKUsArray', this.productSKUsArray);
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
            this.productsList.push(res.data.site.product);
        })
    }

    /**
     *
     * @param {Array} productSKUs
     */
     getProductsData(productSKUs){
        this.forEachPromise(productSKUs)
            .then(() => {
                ReactDOM.render(<OrderBulkProductsTable productsList={this.productsList}/>, this.$container);
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

}