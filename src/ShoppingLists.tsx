import type { ShoppingList } from './gql/graphql';

export function ShoppingLists({
  lists,
  onCreate = () => {
    /* do nothing */
  },
  onDelete = () => {
    /* do nothing */
  },
  onSelect = () => {
    /* do nothing */
  },
}: {
  lists?: ShoppingList[];
  onCreate?: () => void;
  onDelete?: (input: string) => void;
  onSelect?: (input: string) => void;
}) {
  return (
    <>
      <h2>Shopping Lists</h2>
      <ul>
        {lists?.map((list) => (
          <li key={list.id}>
            <button onClick={() => onSelect(list.id)}>
              {new Date(list.createdAt).toDateString()}
            </button>
            <button onClick={() => onDelete(list.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={onCreate}>+ Add</button>
    </>
  );
}
