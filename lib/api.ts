import axios from 'axios';
import type {
  Tower,
  DoveMatch,
  CacheEntry,
  Performance,
  DeduplicateResponse,
  DoveLookupRequest,
  CacheData,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  towers: {
    deduplicate: async (file: File): Promise<DeduplicateResponse> => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<DeduplicateResponse>(
        '/api/towers/deduplicate',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },

    doveLookup: async (tower: DoveLookupRequest): Promise<DoveMatch[]> => {
      const response = await apiClient.post<DoveMatch[]>(
        '/api/towers/dove-lookup',
        tower
      );
      return response.data;
    },
  },

  performances: {
    parse: async (file: File): Promise<Performance[]> => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<Performance[]>(
        '/api/performances/parse',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
  },

  cache: {
    getUser: async (): Promise<CacheData> => {
      const response = await apiClient.get<CacheData>('/api/cache/user');
      return response.data;
    },

    saveEntry: async (cacheKey: string, entry: CacheEntry): Promise<void> => {
      await apiClient.post('/api/cache/user', {
        cache_key: cacheKey,
        ...entry,
      });
    },
  },
};
