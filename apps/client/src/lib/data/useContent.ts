import { readItems } from '@directus/sdk';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDirectus } from '../directus';

export const useContent = (slug: string, lang: string) => {
  const directus = useDirectus();
  const { data } = useSuspenseQuery({
    queryKey: ['content', slug],
    queryFn: async () => {
      const response = await directus.request(
        readItems('website_content' as any, {
          filter: {
            page: { _eq: slug },
            status: {
              _eq: 'published',
            },
          },
          ['deep' as any]: {
            ['translations' as any]: {
              ['_filter' as any]: {
                ['_and' as any]: [
                  {
                    lang_code: { _eq: lang },
                  },
                ],
              },
            },
          },
          fields: ['*', { translations: ['content'] }],
          limit: 1,
        })
      );
      return response[0]?.translations?.[0]?.content ?? '';
    },
  });
  return data;
};
