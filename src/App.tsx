import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import './App.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { graphql } from './gql/gql';
import { gqlClient } from './gqlClient';
import { Ingredients } from './Ingredients';
import { Recipes } from './Recipes';
import { ShoppingList } from './ShoppingList';
import { ShoppingLists } from './ShoppingLists';
import { StoreSections } from './StoreSections';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Goodsoup />
      <ReactQueryDevtools position="right" />
    </QueryClientProvider>
  );
}

function Goodsoup() {
  return (
    <>
      <h1>Goodsoup</h1>
      <main>
        <ShoppingLists />
        <Recipes />
        <Ingredients />
        <StoreSections />
      </main>
    </>
  );
}

export default App;
