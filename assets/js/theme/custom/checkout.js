import PageManager from '../page-manager';
import initApolloClient from '../global/graphql/client';
import customerData from './gql/customerData.gql';
import flattenGraphQLResponse from 'humanize-graphql-response';

export default class CustomCheckout extends PageManager {
    constructor(context) {
        super(context);
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);

        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        this.observer = new MutationObserver((this.callback).bind(this));
        this.observer.observe(window.document.body, {childList: true, subtree: true});
    }
    callback (changes, observer) {
        console.log(changes);
        console.log(observer);
    }

    onReady() {

        console.log('this', this);

        this.gqlClient.query({
            query: customerData,
        }).then(res => {
           //console.log('res', res);
            const paymentMethodLabel = flattenGraphQLResponse(res)?.data?.customer?.attributes?.paymentMethodLabel?.value;
            console.log('paymentMethodLabel', paymentMethodLabel);
        })

    }
}
