import PageManager from '../page-manager';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import initApolloClient from '../global/graphql/client';
import customBrands from './gql/customBrands.gql';
import flattenGraphQLResponse from 'humanize-graphql-response';
import BrandItemProduct from './reactComponent/brandItemProduct';

export default class CustomBrands extends PageManager {
    constructor(context) {
        super(context);
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.brandsList = [];
        this.$container = $('.brandGrid')[0];
        this.value;
        this.url = window.location.search.toString();
    }

    /**
     * Returns a list of brands products.
     */
    async getBrandsProduct(cursor) {
        return this.gqlClient
        .query({
            query: customBrands,
            variables: {cursor: cursor},
          }).then((data) => {
                let newData = flattenGraphQLResponse(data);
                this.brandsList = [...this.brandsList, ...newData.data.site.brands];
                if (data.data.site.brands.pageInfo.hasNextPage) {
                    return this.getBrandsProduct(data.data.site.brands.pageInfo.endCursor);
                }
          }).catch(error => console.log(error));

    }

    onReady() {
        $('.brand').hide();
        Promise.resolve(this.getBrandsProduct())
            .then(()=> {
                let brandsList = this.brandsList.filter(el => el.name.toLowerCase().startsWith(this.url.slice(-1)));
                ReactDOM.render(<BrandItemProduct value={this.url.slice(-1)} brandsList={brandsList}/>, this.$container);
            });

    }
}