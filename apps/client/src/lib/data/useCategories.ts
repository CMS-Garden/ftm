import { readItems } from '@directus/sdk';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDirectus } from '../directus';

export const useCategories = () => {
  const directus = useDirectus();
  const { data } = useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = (await directus.request(
        readItems('category' as any, {})
      )) as {
        name: string;
        id: number;
      }[];
      return response;
    },
  });
  return data;
};
