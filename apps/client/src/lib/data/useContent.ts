import { readItems } from '@directus/sdk';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDirectus } from '../directus';

export const useContent = (key: string, lang: string) => {
  const directus = useDirectus();
  const { data } = useSuspenseQuery({
    queryKey: ['content', key],
    queryFn: async () => {
      const response = await directus.request(
        readItems('website_content' as any, {
          ['deep' as any]: {
            ['website_content_translations' as any]: {
              ['_filter' as any]: {
                ['_and' as any]: [
                  {
                    languages: { _eq: lang },
                  },
                  {
                    slug: { _eq: key },
                  },
                ],
              },
            },
          },
          fields: ['*', { translations: ['*'] }],
          limit: 1,
        })
      );
      return response[0]?.translations?.[0]?.content ?? key;
    },
  });
  return data;
};
