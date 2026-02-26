import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { graphql } from './gql';
import { gqlClient } from './gqlClient';

export function Recipes() {
  const { data: recipesData, refetch } = useQuery({
    queryKey: ['getAllRecipes'],
    queryFn: async () => gqlClient.request(getAllRecipesDocument),
  });

  const [isCreating, setIsCreating] = useState(false);

  const [newRecipeName, setNewRecipeName] = useState('');

  const { data: ingredientsData } = useQuery({
    queryKey: ['getAllIngredientsForRecipeCreator'],
    queryFn: async () => gqlClient.request(GET_ALL_INGREDIENTS_DOCUMENT),
  });

  const [newRecipeIngredients, setNewRecipeIngredients] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const { mutate: createRecipe } = useMutation({
    mutationFn: async ({
      name,
      ingredients,
    }: {
      name: string;
      ingredients: string[];
    }) => gqlClient.request(CREATE_RECIPE_DOCUMENT, { name, ingredients }),
    onSuccess: refetch,
  });

  return (
    <>
      <h2>Recipes</h2>
      <ul>
        {recipesData?.recipes.map((recipe) => (
          <li key={recipe.id}>{recipe.name}</li>
        ))}
      </ul>
      {isCreating ? (
        <>
          <input
            onChange={(event) => setNewRecipeName(event.target.value)}
            value={newRecipeName}
          />
          <p>Recipe Ingredients</p>
          <ul>
            {newRecipeIngredients.map((ingredient) => (
              <li key={ingredient.id}>
                <p>{ingredient.name}</p>
                <button
                  onClick={() =>
                    setNewRecipeIngredients((oldValue) =>
                      oldValue.filter(
                        (oldIngredient) => oldIngredient.id !== ingredient.id,
                      ),
                    )
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p>Other Ingredients</p>
          <ul>
            {ingredientsData?.ingredients
              .filter(
                (ingredient) => !newRecipeIngredients.includes(ingredient),
              )
              .map((ingredient) => (
                <li key={ingredient.id}>
                  <p>{ingredient.name}</p>
                  <button
                    onClick={() =>
                      setNewRecipeIngredients((oldValue) => [
                        ...oldValue,
                        ingredient,
                      ])
                    }
                  >
                    Add
                  </button>
                </li>
              ))}
          </ul>
          <button
            onClick={() => {
              createRecipe({
                name: newRecipeName,
                ingredients: newRecipeIngredients.map(
                  (ingredient) => ingredient.id,
                ),
              });
              setNewRecipeName('');
              setNewRecipeIngredients([]);
              setIsCreating(false);
            }}
          >
            Save
          </button>
          <button onClick={() => setIsCreating(false)}>Cancel</button>
        </>
      ) : (
        <button onClick={() => setIsCreating(true)}>+ New</button>
      )}
    </>
  );
}

const getAllRecipesDocument = graphql(/* GraphQL */ `
  query GetAllRecipes {
    recipes {
      id
      name
    }
  }
`);

const GET_ALL_INGREDIENTS_DOCUMENT = graphql(/* GraphQL */ `
  query GetAllIngredientsForRecipeCreator {
    ingredients {
      id
      name
    }
  }
`);

const CREATE_RECIPE_DOCUMENT = graphql(/* GraphQL */ `
  mutation CreateRecipe($name: String!, $ingredients: [ID!]!) {
    createRecipe(name: $name, ingredients: $ingredients) {
      id
      name
    }
  }
`);
