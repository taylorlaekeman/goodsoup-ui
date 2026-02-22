import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { graphql } from './gql';
import { gqlClient } from './gqlClient';

export function StoreSections() {
  const { data, refetch } = useQuery({
    queryKey: ['getSections'],
    queryFn: async () => gqlClient.request(getSectionsDocument),
  });

  const [isCreating, setIsCreating] = useState(false);
  const [newSection, setNewSection] = useState('');

  const { mutate: createSection } = useMutation({
    mutationFn: async (name: string) =>
      gqlClient.request(CREATE_SECTION_DOCUMENT, { name }),
    onSuccess: () => {
      refetch();
      setNewSection('');
      setIsCreating(false);
    },
  });

  return (
    <>
      <h2>Sections</h2>
      <ul>
        {data?.sections.map((section) => (
          <li key={section.id}>{section.name}</li>
        ))}
      </ul>
      {isCreating ? (
        <>
          <input
            onChange={(event) => setNewSection(event.target.value)}
            value={newSection}
          />
          <button onClick={() => createSection(newSection)}>Save</button>
          <button onClick={() => setIsCreating(false)}>Cancel</button>
        </>
      ) : (
        <button onClick={() => setIsCreating(true)}>+ New</button>
      )}
    </>
  );
}

const getSectionsDocument = graphql(/* GraphQL */ `
  query GetSections {
    sections {
      id
      name
    }
  }
`);

const CREATE_SECTION_DOCUMENT = graphql(/* GraphQL */ `
  mutation CreateSection($name: String!) {
    createSection(name: $name) {
      id
      name
    }
  }
`);
