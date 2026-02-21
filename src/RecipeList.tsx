import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { graphql } from './gql';
import type { Recipe } from './gql/graphql';
import { gqlClient } from './gqlClient';

export function RecipeList({
  onAdd = () => {
    /* empty */
  },
  onRemove = () => {
    /* empty */
  },
  recipes = [],
}: {
  onAdd?: (id: string) => void;
  onRemove?: (id: string) => void;
  recipes?: Recipe[];
}) {
  const [isAddingRecipe, setIsAddingRecipe] = useState<boolean>(false);
  return (
    <>
      <h2>Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            {recipe.name}
            <button>Edit</button>
            <button onClick={() => onRemove(recipe.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {!isAddingRecipe && (
        <button onClick={() => setIsAddingRecipe(true)}>+ Add</button>
      )}
      {isAddingRecipe && (
        <RecipeAdder onAdd={onAdd} onFinish={() => setIsAddingRecipe(false)} />
      )}
    </>
  );
}

function RecipeAdder({
  onAdd = () => {
    /* empty */
  },
  onFinish = () => {
    /* empty */
  },
}: {
  onAdd?: (id: string) => void;
  onFinish?: () => void;
}) {
  const { data } = useQuery({
    queryKey: ['getRecipes'],
    queryFn: async () => gqlClient.request(getRecipesDocument),
  });
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
              <button onClick={() => onAdd(recipe.id)}>{recipe.name}</button>
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

const getRecipesDocument = graphql(/* GraphQL */ `
  query GetRecipes {
    recipes {
      id
      name
    }
  }
`);
