export interface WebsiteResponse {
  id: number;
  status: string;
  sort: any;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  url: string;
  versionmanager_id: any;
  siwecos_score: any;
  raw_versionmanager?: string;
  state_id: StateId;
  description?: string;
  category_id?: CategoryId;
  city_id?: CityId;
  agency_id: any;
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
  system: System;
  system_type?: SystemType;
  system_type_group?: SystemTypeGroup;
  detected_system_type?: DetectedSystemType;
  system_version?: SystemVersion;
  latest_version?: LatestVersion;
  cve?: Cve;
  tags: any[];
  lighthouse?: Lighthouse;
  original_url: string;
  id: number;
}

export interface System {
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
  asn_id?: number;
}

export interface SystemType {
  id: number;
  active: number;
  name: string;
  cve_url?: string;
}

export interface SystemTypeGroup {
  group_name: string;
  icon?: string;
  is_open_source: boolean;
}

export interface DetectedSystemType {
  id: number;
  active: number;
  name: string;
  cve_url?: string;
}

export interface SystemVersion {
  id: number;
  version: string;
  system_type: number;
  tarball: string;
  date: string;
}

export interface LatestVersion {
  id: number;
  version: string;
  system_type: number;
  tarball: string;
  date: string;
}

export interface Cve {
  id: number;
  system_version: number;
  count: number;
  highest: number;
  date: number;
  system_type: number;
}

export interface Lighthouse {
  id: number;
  system_id: number;
  crdate: number;
  performance: string;
  accessibility: string;
  best_practices: string;
  seo: string;
  pwa: string;
}
