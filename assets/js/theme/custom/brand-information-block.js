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
                ReactDOM.render(<BrandInformation
                                    name={response.data.site.product.brand.name}
                                    defaultImage={response.data.site.product.brand.defaultImage}
                                    metaDesc={response.data.site.product.brand.metaDesc}
                                    />, this.$container);
            });
    }

    onReady() {
        this.getOptions();
    }
}