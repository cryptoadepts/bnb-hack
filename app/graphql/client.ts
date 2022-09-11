import { ApolloClient, InMemoryCache } from "@apollo/client";

const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  ssrMode: true,
  uri: "https://api.thegraph.com/subgraphs/name/elshan-eth/achiever",
});

export default graphqlClient;
