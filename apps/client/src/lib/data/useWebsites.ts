import { readItems } from '@directus/sdk';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDirectus } from '../directus';
import { WebsiteResponse } from './types';

export const useWebsites = () => {
  const directus = useDirectus();
  const { data } = useSuspenseQuery({
    queryKey: ['websites'],
    queryFn: async () => {
      const response = await directus.request(
        readItems('domain' as any, {
          limit: 9999999,
          status: {
            _eq: 'published',
          },
          deep: {
            state: {},
            category: {},
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
      return withVersionManager;
    },
  });
  return data;
};
