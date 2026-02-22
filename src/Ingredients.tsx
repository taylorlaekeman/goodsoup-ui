import { useQuery } from '@tanstack/react-query';
import { graphql } from './gql';
import { gqlClient } from './gqlClient';

export function Ingredients() {
  const { data } = useQuery({
    queryKey: ['getAllIngredients'],
    queryFn: async () => gqlClient.request(getAllIngredientsDocument),
  });
  return (
    <>
      <h2>Ingredients</h2>
      <ul>
        {data?.ingredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.name}</li>
        ))}
      </ul>
    </>
  );
}

const getAllIngredientsDocument = graphql(/* GraphQL */ `
  query GetAllIngredients {
    ingredients {
      id
      name
    }
  }
`);
