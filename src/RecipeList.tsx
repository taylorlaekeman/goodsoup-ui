import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
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
      <div className="indented flex-row">
        <MagnifyingGlassIcon />
        <input
          onChange={(event) => setSearchString(event.target.value ?? '')}
          value={searchString}
          type="text"
        />
        <button className="icon" onClick={onFinish}>
          <XMarkIcon />
        </button>
      </div>
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
            <li key={recipe.id}>
              <button className="text" onClick={() => onAdd(recipe.id)}>
                {recipe.name}
              </button>
            </li>
          ))}
      </ul>
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
