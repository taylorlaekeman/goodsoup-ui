import {
  CheckIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
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

  const { mutate: deleteSection } = useMutation({
    mutationFn: async (id: string) =>
      gqlClient.request(DELETE_SECTION_DOCUMENT, { id }),
    onSuccess: refetch,
  });

  return (
    <section>
      <header>
        <h2>Sections</h2>
        {!isCreating && (
          <button className="icon" onClick={() => setIsCreating(true)}>
            <PlusIcon />
          </button>
        )}
      </header>
      {isCreating && (
        <div className="flex-row">
          <input
            onChange={(event) => setNewSection(event.target.value)}
            type="text"
            value={newSection}
          />
          <button className="icon" onClick={() => createSection(newSection)}>
            <CheckIcon />
          </button>
          <button className="icon" onClick={() => setIsCreating(false)}>
            <XMarkIcon />
          </button>
        </div>
      )}
      <ul>
        {data?.sections.map((section) => (
          <li className="flex-row" key={section.id}>
            <p>{section.name}</p>
            <button
              className="delete"
              onClick={() => deleteSection(section.id)}
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const getSectionsDocument = graphql(/* GraphQL */ `
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

const DELETE_SECTION_DOCUMENT = graphql(/* GraphQL */ `
  mutation DeleteSection($id: ID!) {
    deleteSection(id: $id) {
      id
      name
    }
  }
`);
