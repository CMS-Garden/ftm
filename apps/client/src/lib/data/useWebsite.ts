import { readItems } from '@directus/sdk';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDirectus } from '../directus';
import { WebsiteResponse } from './types';

export const useWebsite = (domain: string) => {
  const directus = useDirectus();
  const { data } = useSuspenseQuery({
    queryKey: ['websites', domain],
    queryFn: async () => {
      const response = await directus.request(
        readItems('domain' as any, {
          limit: 1,
          deep: {
            state: {},
            category: {},
          },
          filter: {
            status: {
              _eq: 'published',
            },
            url: {
              _contains: domain,
            },
          },
          fields: [
            '*',
            {
              state_id: ['*'],
              category_id: ['*'],
              city_id: ['*'],
              agency_id: ['*'],
            },
          ],
        })
      );
      const withVersionManager = response.map((p) => ({
        ...p,
        versionmanager: JSON.parse(p.raw_versionmanager)?.sort(
          (a: any, b: any) => a.date - b.date
        )?.[0],
      })) as WebsiteResponse[];
      if (!withVersionManager) throw new Error('Website not found.');
      return withVersionManager[0];
    },
  });
  return data;
};
