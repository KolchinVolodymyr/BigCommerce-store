import PageManager from '../page-manager';
//import initApolloClient from '../global/graphql/client';
//import customerAttributesQuery from './gql/customerAttributes.gql';
//import flattenGraphQLResponse from 'humanize-graphql-response';

export default class CustomCheckout extends PageManager {
    constructor(context) {
        super(context);
    }

    onReady() {
       console.log('hello world');
       console.log('this', this);
    }
}
