import PageManager from '../page-manager';
import initApolloClient from '../global/graphql/client';
import customerData from './gql/customerData.gql';
import flattenGraphQLResponse from 'humanize-graphql-response';

export default class CustomCheckout extends PageManager {
    constructor(context) {
        super(context);
        this.gqlClient = initApolloClient(this.context.storefrontAPIToken);
        this.paymentMethodLabel = false;
    }
    observe() {
        let callback = function(changes){
            changes.forEach(el => {
                if (el.target.parentNode.classList.contains("checkout-step--payment") && el.addedNodes.length > 0) {
                    if ($(".paymentProviderHeader-name").length > 0 && this.paymentMethodLabel) {
                        $(".paymentProviderHeader-name").text(this.paymentMethodLabel);
                    }
                }
            });
        }
        let observer = new MutationObserver(callback.bind(this));
        observer.observe(window.document.body, {childList: true, subtree: true});
    }


    onReady() {
        this.gqlClient.query({
            query: customerData,
        }).then(res => {
            this.paymentMethodLabel = flattenGraphQLResponse(res)?.data?.customer?.attributes?.paymentMethodLabel?.value;
        }).catch(error => console.log(error))
        this.observe()
    }
}
