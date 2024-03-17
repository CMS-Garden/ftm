import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import {
  DirectusClient,
  RestClient,
  createDirectus,
  rest,
} from '@directus/sdk';

type Schema = any;

const DirectusContext = createContext<
  (DirectusClient<Schema> & RestClient<Schema>) | null
>(null);

export const DirectusProvider = ({ children }: PropsWithChildren) => {
  const client: DirectusClient<Schema> & RestClient<Schema> = useMemo(
    () =>
      createDirectus<Schema>(
        import.meta.env.VITE_DIRECTUS_URL ?? missingDirectusUrl()
      ).with(rest()),
    []
  );

  return (
    <DirectusContext.Provider value={client}>
      {children}
    </DirectusContext.Provider>
  );
};

export const useDirectus = () => useContext(DirectusContext)!;

const missingDirectusUrl = () => {
  throw new Error('VITE_DIRECTUS_URL environment variable is required');
};
