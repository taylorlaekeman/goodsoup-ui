import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
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
      <header>
        <h2>Shopping Lists</h2>
        <button className="icon" onClick={onCreate}>
          <PlusIcon />
        </button>
      </header>
      <ul>
        {lists?.map((list) => (
          <li className="flex-row" key={list.id}>
            <button className="text" onClick={() => onSelect(list.id)}>
              {new Date(list.createdAt).toDateString()}
            </button>
            <button className="delete" onClick={() => onDelete(list.id)}>
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
