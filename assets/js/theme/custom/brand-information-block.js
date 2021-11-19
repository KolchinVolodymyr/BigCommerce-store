import PageManager from '../page-manager';
import initApolloClient from '../global/graphql/client';
import brandInformationData from './gql/brandInformationData.gql';
import 'regenerator-runtime/runtime';

export default class CustomCategory extends PageManager {
    constructor(context) {
        super(context);
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.productId = this.context.productId;
    }
    /**
     * Returns a list of product Variant Options.
     */
    async getOptions() {
        this.gqlClient
        .query({
            query: brandInformationData,
            variables: { productId: parseInt(this.productId), },
            }).then((data) => {
                console.log('data', data);
            });
    }

    onReady() {
    console.log('s', this.context.storefrontAPIToken);
        console.log('hello');
        console.log(this.productId);
        this.getOptions()
    }
}