import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { graphql } from './gql';
import { gqlClient } from './gqlClient';
import { ShoppingList } from './ShoppingList';

export function ShoppingLists({
  onCreate = () => {
    /* do nothing */
  },
  onDelete = () => {
    /* do nothing */
  },
}: {
  onCreate?: () => void;
  onDelete?: (input: string) => void;
}) {
  const [listId, setListId] = useState<string | undefined>();
  const { data, refetch } = useQuery({
    queryKey: ['getShoppingLists'],
    queryFn: async () => gqlClient.request(getShoppingListsDocument),
  });
  const { mutate: createShoppingList } = useMutation({
    mutationKey: ['createShoppingList'],
    mutationFn: async () => gqlClient.request(createShoppingListDocument),
    onSuccess: refetch,
  });
  const { mutate: deleteShoppingList } = useMutation({
    mutationKey: ['deleteShoppingList'],
    mutationFn: async ({ id }: { id: string }) =>
      gqlClient.request(deleteShoppingListDocument, { id }),
    onSuccess: refetch,
  });
  return (
    <section>
      <header>
        <h2>Shopping Lists</h2>
        <button className="icon" onClick={() => createShoppingList()}>
          <PlusIcon />
        </button>
      </header>
      {listId ? (
        <ShoppingList
          list={data?.shoppingLists.find((list) => list.id === listId)}
          onBack={() => setListId(undefined)}
          onChange={() => refetch()}
        />
      ) : (
        <ul>
          {data?.shoppingLists?.map((list) => (
            <li className="flex-row" key={list.id}>
              <button className="text" onClick={() => setListId(list.id)}>
                {new Date(list.createdAt).toDateString()}
              </button>
              <button
                className="delete"
                onClick={() => deleteShoppingList({ id: list.id })}
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
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

const deleteShoppingListDocument = graphql(/* GraphQL */ `
  mutation DeleteShoppingList($id: ID!) {
    deleteShoppingList(id: $id) {
      id
      createdAt
      name
    }
  }
`);
