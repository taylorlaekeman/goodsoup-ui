import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { graphql } from './gql';
import { gqlClient } from './gqlClient';
import { getSectionsDocument } from './StoreSections';

export function Ingredients() {
  const { data: ingredientsData, refetch: refetchIngredients } = useQuery({
    queryKey: ['getAllIngredients'],
    queryFn: async () => gqlClient.request(getAllIngredientsDocument),
  });

  const { data: sectionsdata } = useQuery({
    queryKey: ['getAllSections'],
    queryFn: async () => gqlClient.request(getSectionsDocument),
  });

  const [isCreating, setIsCreating] = useState(false);

  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientSection, setNewIngredientSection] = useState('');

  const { mutate: createIngredient } = useMutation({
    mutationFn: async ({ name, section }: { name: string; section: string }) =>
      gqlClient.request(CREATE_INGREDIENT_DOCUMENT, { name, section }),
    onSuccess: refetchIngredients,
  });

  const { mutate: deleteIngredient } = useMutation({
    mutationFn: async (id: string) =>
      gqlClient.request(DELETE_INGREDIENT_DOCUMENT, { id }),
    onSuccess: refetchIngredients,
  });

  return (
    <>
      <h2>Ingredients</h2>
      <ul>
        {ingredientsData?.ingredients.map((ingredient) => (
          <li className="flex-row" key={ingredient.id}>
            <p>{`${ingredient.name} (${ingredient.section.name})`}</p>
            <button onClick={() => deleteIngredient(ingredient.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {isCreating ? (
        <>
          <input
            onChange={(event) => setNewIngredientName(event.target.value)}
            value={newIngredientName}
          />
          <select
            onChange={(event) => setNewIngredientSection(event.target.value)}
            value={newIngredientSection}
          >
            <option value="">Please Select</option>
            {sectionsdata?.sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (newIngredientName && newIngredientSection) {
                createIngredient({
                  name: newIngredientName,
                  section: newIngredientSection,
                });
                setNewIngredientName('');
                setNewIngredientSection('');
                setIsCreating(false);
              }
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

const getAllIngredientsDocument = graphql(/* GraphQL */ `
  query GetAllIngredients {
    ingredients {
      id
      name
      section {
        name
      }
    }
  }
`);

const CREATE_INGREDIENT_DOCUMENT = graphql(/* GraphQL */ `
  mutation CreateIngredient($name: String!, $section: ID!) {
    createIngredient(name: $name, section: $section) {
      id
      name
      section {
        id
        name
      }
    }
  }
`);

const DELETE_INGREDIENT_DOCUMENT = graphql(/* GraphQL */ `
  mutation DeleteIngredient($id: ID!) {
    deleteIngredient(id: $id) {
      id
      name
    }
  }
`);
