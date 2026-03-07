import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { graphql } from './gql';
import type { Recipe } from './gql/graphql';
import { gqlClient } from './gqlClient';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
      <header>
        <h3>Recipes</h3>
        {!isAddingRecipe && (
          <button className="icon" onClick={() => setIsAddingRecipe(true)}>
            <PlusIcon />
          </button>
        )}
      </header>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <p>{recipe.name}</p>
            <button className="icon" onClick={() => onRemove(recipe.id)}>
              <XMarkIcon />
            </button>
          </li>
        ))}
      </ul>
      {isAddingRecipe && (
        <RecipeAdder
          existingRecipes={recipes}
          onAdd={onAdd}
          onFinish={() => setIsAddingRecipe(false)}
        />
      )}
    </>
  );
}

function RecipeAdder({
  existingRecipes = [],
  onAdd = () => {
    /* empty */
  },
  onFinish = () => {
    /* empty */
  },
}: {
  existingRecipes?: Recipe[];
  onAdd?: (id: string) => void;
  onFinish?: () => void;
}) {
  const { data } = useQuery({
    queryKey: ['getRecipes'],
    queryFn: async () => gqlClient.request(getRecipesDocument),
  });
  const [searchString, setSearchString] = useState<string>('');
  const existingRecipeIds = useMemo(
    () => existingRecipes.map((recipe) => recipe.id),
    [existingRecipes],
  );
  return (
    <>
      <input
        value={searchString}
        onChange={(event) => setSearchString(event.target.value ?? '')}
      />
      <ul>
        {data?.recipes
          .filter((recipe) => !existingRecipeIds.includes(recipe.id))
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
