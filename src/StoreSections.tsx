import { useQuery } from '@tanstack/react-query';
import { graphql } from './gql';
import { gqlClient } from './gqlClient';

export function StoreSections() {
  const { data } = useQuery({
    queryKey: ['getSections'],
    queryFn: async () => gqlClient.request(getSectionsDocument),
  });
  return (
    <>
      <h2>Sections</h2>
      <ul>
        {data?.sections.map((section) => (
          <li key={section.id}>{section.name}</li>
        ))}
      </ul>
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
