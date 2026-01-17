import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import './App.css';
import { GraphQLClient } from 'graphql-request';
import { graphql } from './gql/gql';

const queryClient = new QueryClient();
const gqlClient = new GraphQLClient('http://localhost:3000/graphql');

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Goodsoup />
    </QueryClientProvider>
  );
}

const getShoppingListsDocument = graphql(/* GraphQL */ `
  query GetShoppingLists {
    shoppingLists {
      id
      createdAt
    }
  }
`);

function Goodsoup() {
  const { data } = useQuery({
    queryKey: ['getShoppingLists'],
    queryFn: async () => gqlClient.request(getShoppingListsDocument),
  });

  return (
    <>
      <h1>Goodsoup</h1>
      <h2>Shopping Lists</h2>
      <ul>
        {data?.shoppingLists.map((list) => (
          <li key={list.id}>{list.createdAt}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
