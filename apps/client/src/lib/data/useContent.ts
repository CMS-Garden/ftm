import { readItem } from '@directus/sdk';
import { useQuery } from '@tanstack/react-query';
import { useDirectus } from '../directus';

export const useContent = (key: string) => {
  const directus = useDirectus();
  return useQuery({
    queryKey: ['content', key],
    queryFn: async () => {
      return await directus.request(readItem('Content' as any, key));
    },
  });
};
