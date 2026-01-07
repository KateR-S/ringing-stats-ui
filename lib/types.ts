export interface Tower {
  uid: string;
  place: string;
  address: string;
  region: string;
  tenor_raw: string;
  tenor_weight?: number;
}

export interface DoveMatch {
  Place: string;
  Dedication: string;
  Place_2: string;
  Place_3: string;
  TowerID: string;
  score: number;
}

export interface CacheEntry {
  search: string;
  selected: string;
  checked_ok: boolean;
}

export interface Performance {
  [key: string]: any;
}

export interface ParsePerformancesResponse {
  performances: Performance[];
}

export interface DeduplicateResponse {
  towers: Tower[];
  cache_key: string;
}

export interface DoveLookupRequest {
  place: string;
  address: string;
  region: string;
  tenor_raw: string;
}

export interface CacheData {
  [key: string]: CacheEntry;
}
