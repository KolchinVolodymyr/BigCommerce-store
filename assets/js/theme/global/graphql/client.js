import { ApolloClient, InMemoryCache } from '@apollo/client';

export default function (token) {
    return new ApolloClient({
        uri: '/graphql',
        headers: { Authorization: `Bearer ${token}` },
        cache: new InMemoryCache(),
    });
}