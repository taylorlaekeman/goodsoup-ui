import { useMutation } from '@tanstack/react-query';
import { Fragment } from 'react/jsx-runtime';
import { graphql } from './gql/gql';
import type { Ingredient, Section, ShoppingList } from './gql/graphql';
import { gqlClient } from './gqlClient';
import { RecipeList } from './RecipeList';

export function ShoppingList({
  list,
  onBack = () => {
    /* empty */
  },
  onChange = () => {
    /* empty */
  },
}: {
  list: ShoppingList;
  onBack?: () => void;
  onChange?: () => void;
}) {
  const { ingredientsBySectionId, sectionsById } = parseSections(list);
  const { mutate: updateRecipes } = useMutation({
    mutationFn: async ({ shoppingListId, recipes }) =>
      gqlClient.request(updateRecipesDocument, { shoppingListId, recipes }),
    onSuccess: () => onChange(),
  });
  return (
    <>
      <button onClick={onBack}>Back</button>
      <RecipeList
        onAdd={(id) =>
          updateRecipes({
            shoppingListId: list.id,
            recipes: [...list.recipes.map((recipe) => recipe.id), id],
          })
        }
        onRemove={(id) =>
          updateRecipes({
            shoppingListId: list.id,
            recipes: [
              ...list.recipes
                .filter((recipe) => recipe.id !== id)
                .map((recipe) => recipe.id),
            ],
          })
        }
        recipes={list.recipes}
      />
      <h3>Ingredients</h3>
      {Object.entries(ingredientsBySectionId).map(
        ([sectionId, ingredients]) => {
          return (
            <div className="indented" key={sectionId}>
              <h4>{sectionsById[sectionId]?.name}</h4>
              <ul className="indented">
                {ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    <p>{ingredient.name}</p>
                  </li>
                ))}
              </ul>
            </div>
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

const updateRecipesDocument = graphql(/* GraphQL */ `
  mutation UpdateShoppingListRecipes($shoppingListId: ID!, $recipes: [ID!]!) {
    updateShoppingList(id: $shoppingListId, recipes: $recipes) {
      id
      recipes {
        id
        name
      }
    }
  }
`);
