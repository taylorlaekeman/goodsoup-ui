import { Fragment } from 'react/jsx-runtime';
import type { Ingredient, Section, ShoppingList } from './gql/graphql';
import { RecipeList } from './RecipeList';

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
  return (
    <>
      <button onClick={onBack}>Back</button>
      <RecipeList recipes={list.recipes} />
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
