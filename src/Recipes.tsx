import { useQuery } from '@tanstack/react-query';
import { graphql } from './gql';
import { gqlClient } from './gqlClient';

export function Recipes() {
  const { data } = useQuery({
    queryKey: ['getAllRecipes'],
    queryFn: async () => gqlClient.request(getAllRecipesDocument),
  });
  return (
    <>
      <h2>Recipes</h2>
      <ul>
        {data?.recipes.map((recipe) => (
          <li key={recipe.id}>{recipe.name}</li>
        ))}
      </ul>
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
