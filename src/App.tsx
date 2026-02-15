import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import './App.css';
import { useState } from 'react';
import { graphql } from './gql/gql';
import { gqlClient } from './gqlClient';
import { ShoppingList } from './ShoppingList';
import { ShoppingLists } from './ShoppingLists';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Goodsoup />
      <ReactQueryDevtools position="right" />
    </QueryClientProvider>
  );
}

function Goodsoup() {
  const { data } = useQuery({
    queryKey: ['getShoppingLists'],
    queryFn: async () => gqlClient.request(getShoppingListsDocument),
  });

  const { mutate: createShoppingList } = useMutation({
    mutationKey: ['createShoppingList'],
    mutationFn: async () => gqlClient.request(createShoppingListDocument),
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
        <ShoppingLists
          lists={data?.shoppingLists}
          onCreate={() => createShoppingList()}
          onSelect={setListId}
        />
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

const createShoppingListDocument = graphql(/* GraphQL */ `
  mutation CreateShoppingList {
    createShoppingList {
      id
      createdAt
      name
    }
  }
`);

export default App;
