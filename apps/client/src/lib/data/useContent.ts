import { readItem } from '@directus/sdk';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDirectus } from '../directus';

export const useContent = (key: string) => {
  const directus = useDirectus();
  const { data } = useSuspenseQuery({
    queryKey: ['content', key],
    queryFn: async () => {
      const response = await directus.request(readItem('Content' as any, key));
      return response.content;
    },
  });
  return data;
};
