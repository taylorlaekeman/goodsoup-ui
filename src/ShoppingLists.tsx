import type { ShoppingList } from './gql/graphql';

export function ShoppingLists({
  lists,
  onSelect = () => {
    /* do nothing */
  },
}: {
  lists?: ShoppingList[];
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
          </li>
        ))}
      </ul>
    </>
  );
}
