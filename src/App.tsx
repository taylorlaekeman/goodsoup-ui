import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import './App.css';
import { useState } from 'react';
import { graphql } from './gql/gql';
import { gqlClient } from './gqlClient';
import { ShoppingList } from './ShoppingList';
import { ShoppingLists } from './ShoppingLists';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Goodsoup />
    </QueryClientProvider>
  );
}

function Goodsoup() {
  const { data } = useQuery({
    queryKey: ['getShoppingLists'],
    queryFn: async () => gqlClient.request(getShoppingListsDocument),
  });

  const [listId, setListId] = useState<string | undefined>();
  return (
    <>
      <h1>Goodsoup</h1>
      {listId ? (
        <ShoppingList
          list={data?.shoppingLists.find((list) => list.id === listId)}
        />
      ) : (
        <ShoppingLists lists={data?.shoppingLists} onSelect={setListId} />
      )}
    </>
  );
}

const getShoppingListsDocument = graphql(/* GraphQL */ `
  query GetShoppingLists {
    shoppingLists {
      id
      createdAt
      updatedAt
      name
      recipes {
        id
        name
        createdAt
        updatedAt
        ingredients {
          id
          name
          createdAt
          updatedAt
          section {
            id
            name
            createdAt
            updatedAt
          }
        }
      }
      ingredients {
        id
        name
        createdAt
        updatedAt
        section {
          id
          name
          createdAt
          updatedAt
        }
      }
    }
  }
`);

export default App;
