import { readItems } from '@directus/sdk';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDirectus } from '../directus';

export const useCities = () => {
  const directus = useDirectus();
  const { data } = useSuspenseQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = (await directus.request(
        readItems('City' as any, {
          limit: 999999999,
          status: {
            _eq: 'published',
          },
        })
      )) as {
        Name: string;
        id: number;
        country_id: number;
        state_id: number;
        wikidata_id: string;
      }[];
      return response;
    },
  });
  return data;
};
