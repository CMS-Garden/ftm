import { readItems } from '@directus/sdk';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDirectus } from '../directus';

export interface Response {
  id: number;
  status: string;
  sort: any;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  url: string;
  versionmanager_id: any;
  agency_id: any;
  siwecos_score: any;
  raw_versionmanager?: string;
  state_id: StateId;
  category_id?: CategoryId;
  city_id?: CityId;
  versionmanager?: Versionmanager;
}

export interface StateId {
  id: number;
  status: string;
  sort: number;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  name: string;
  country_id: number;
}

export interface CategoryId {
  id: number;
  status: string;
  sort: any;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  name: string;
}

export interface CityId {
  id: number;
  status: string;
  sort: any;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  Name: string;
  state_id: number;
  country_id: number;
  wikidata_id: any;
  population: number;
}

export interface Versionmanager {
  id: number;
  usergroup: number;
  userid: number;
  label: any;
  title: string;
  url: string;
  systemtype?: number;
  detected_system_type?: number;
  ignore_system_type: boolean;
  wartung: boolean;
  partner: any;
  partnermail: any;
  aktversion?: string;
  date: number;
  crdate: number;
  partneranrede: any;
  detection_accuracy?: number;
  cert_auth?: string;
  cert_expires?: string;
  notes: any;
  autocrawl: boolean;
  status_code: number;
  favicon?: string;
  original_url: string;
  asn_name?: string;
}

export const useWebsites = () => {
  const directus = useDirectus();
  const { data } = useSuspenseQuery({
    queryKey: ['websites'],
    queryFn: async () => {
      const response = await directus.request(
        readItems('domain' as any, {
          limit: 9999999,
          deep: {
            state: {},
            category: {},
          },
          fields: [
            '*',
            { state_id: ['*'], category_id: ['*'], city_id: ['*'] },
          ],
        })
      );
      const withVersionManager = response.map((p) => ({
        ...p,
        versionmanager: JSON.parse(p.raw_versionmanager)?.sort(
          (a: any, b: any) => a.date - b.date
        )?.[0],
      })) as Response[];
      console.log(withVersionManager);
      return withVersionManager;
    },
  });
  return data;
};
