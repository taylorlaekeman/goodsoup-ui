import { useState } from 'react';

export function SearchSelect() {
  const [searchString, setSearchString] = useState<string>('');
  return (
    <>
      <input
        value={searchString}
        onChange={(event) => setSearchString(event.target.value ?? '')}
      />
      <ul>
        {data?.recipes
          .filter((recipe) =>
            recipe.name
              .replace(' ', '')
              .toLowerCase()
              .includes(searchString.replace(' ', '').toLowerCase()),
          )
          .map((recipe) => (
            <div key={recipe.id}>
              <button>{recipe.name}</button>
              <button>Edit</button>
              <button>Delete</button>
            </div>
          ))}
      </ul>
      <button>+ New Recipe</button>
      <div>
        <button onClick={onFinish}>Cancel</button>
      </div>
    </>
  );
}
