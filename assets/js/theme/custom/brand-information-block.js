import PageManager from '../page-manager';
import initApolloClient from '../global/graphql/client';
import brandInformationData from './gql/brandInformationData.gql';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import BrandInformation from './reactComponent/BrandInformation';

export default class CustomCategory extends PageManager {
    constructor(context) {
        super(context);
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.productId = this.context.productId;
        this.$container = $('.productView-brand')[0];
    }
    /**
     * Returns a list of brand information.
     */
    async getOptions() {
        this.gqlClient
        .query({
            query: brandInformationData,
            variables: { productId: parseInt(this.productId), },
            }).then((response) => {
                console.log('response', response.data.site.product.brand);
                ReactDOM.render(<BrandInformation
                                    name={response.data.site.product.brand.name}
                                    image={response.data.site.product.brand.defaultImage.url}
                                    metaDesc={response.data.site.product.brand.metaDesc}
                                    />, this.$container);
                console.log(this.$container);
            });
    }

    onReady() {
        this.getOptions();
    }
}