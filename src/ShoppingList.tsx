import { Fragment } from 'react/jsx-runtime';
import type { Ingredient, Section, ShoppingList } from './gql/graphql';
import { RecipeList } from './RecipeList';
import { useMutation } from '@tanstack/react-query';
import { gqlClient } from './gqlClient';
import { graphql } from './gql/gql';

export function ShoppingList({
  list,
  onBack = () => {
    /* empty */
  },
}: {
  list: ShoppingList;
  onBack?: () => void;
}) {
  const { ingredientsBySectionId, sectionsById } = parseSections(list);
  const { mutate: addRecipe } = useMutation({
    mutationFn: async ({ shoppingListId, recipeIds }) =>
      gqlClient.request(addRecipeDocument, { shoppingListId, recipeIds }),
  });
  return (
    <>
      <button onClick={onBack}>Back</button>
      <RecipeList
        onAdd={(id) =>
          addRecipe({
            shoppingListId: list.id,
            recipeIds: [...list.recipes.map((recipe) => recipe.id), id],
          })
        }
        recipes={list.recipes}
      />
      <h2>Ingredients</h2>
      {Object.entries(ingredientsBySectionId).map(
        ([sectionId, ingredients]) => {
          return (
            <Fragment key={sectionId}>
              <h3>{sectionsById[sectionId]?.name}</h3>
              <ul>
                {ingredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.name}</li>
                ))}
              </ul>
            </Fragment>
          );
        },
      )}
    </>
  );
}

function parseSections(list: ShoppingList) {
  const recipeIngredients = list.recipes.flatMap(
    (recipe) => recipe.ingredients,
  );
  const allIngredients = [...recipeIngredients, ...list.ingredients];
  const ingredientsById = allIngredients.reduce<Record<string, Ingredient>>(
    (result, ingredient) => ({
      ...result,
      [ingredient.id]: ingredient,
    }),
    {},
  );
  const uniqueIngredients = Object.values(ingredientsById);
  const sectionsById = uniqueIngredients.reduce<Record<string, Section>>(
    (result, ingredient) => ({
      ...result,
      [ingredient.section.id]: ingredient.section,
    }),
    {},
  );
  const ingredientsBySectionId = uniqueIngredients.reduce<
    Record<string, Ingredient[]>
  >((result, ingredient) => {
    const sectionSoFar = result[ingredient.section.id] ?? [];
    return {
      ...result,
      [ingredient.section.id]: [...sectionSoFar, ingredient],
    };
  }, {});
  return { ingredientsBySectionId, sectionsById };
}

const addRecipeDocument = graphql(/* GraphQL */ `
  mutation AddRecipeToShoppingList($shoppingListId: ID!, $recipeIds: [ID!]!) {
    updateShoppingList(id: $shoppingListId, recipes: $recipeIds) {
      id
      recipes {
        id
        name
      }
    }
  }
`);
