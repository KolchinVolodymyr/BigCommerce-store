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
        this.value = null;
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
//                console.log('data', data);
//                console.log('newData', newData);
                this.brandsList = [...this.brandsList, ...newData.data.site.brands];
                if (data.data.site.brands.pageInfo.hasNextPage) {
                    return this.getBrandsProduct(data.data.site.brands.pageInfo.endCursor);
                }
          console.log('this.brandsList', this.brandsList);
          }).catch(error => console.log(error));

    }

    onReady() {
        //$('.brand').hide();
        console.log('this.$container', this.$container);
        const divs = document.querySelectorAll('.subMenu-item');
        divs.forEach(el => el.addEventListener('click', e => {
            event.preventDefault();
            //console.log('Window.location.href/', window.location.href);
            //console.log('e.target.getAttribute', e.target.getAttribute('href').replace('#', ''));
            this.value = e.target.getAttribute('href').slice(-1);
            //console.log('value', value);
            //console.log('brand name', el.name.toLowerCase().startsWith(value))
            //this.brandsList.filter(el =>{ el.name.toLowerCase().startsWith(value)=='o'})
            this.brandsList.filter(el => {el.name.toLowerCase().startsWith(this.value)})
            //console.log('filter', arrNew);
            ReactDOM.render(<BrandItemProduct value={this.value} brandsList={this.brandsList}/>, this.$container);
        }));

        Promise.resolve(this.getBrandsProduct()).then(()=> {
            ReactDOM.render(<BrandItemProduct brandsList={this.brandsList}/>, this.$container);
        });

    }
}