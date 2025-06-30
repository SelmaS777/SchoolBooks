import appAxios from './appAxios';

export interface SavedSearch {
  id: number;
  user_id: number;
  search_query: string;
  search_name: string;
  created_at: string;
  updated_at: string;
}

export interface SaveSearchParams {
  search_query: string;
  search_name: string;
}

export const savedSearchesService = {
  // Get all saved searches
  getSavedSearches: async (): Promise<SavedSearch[]> => {
    const response = await appAxios.get('/saved-searches');
    return response.data;
  },
  
  // Save a search query
  saveSearch: async (params: SaveSearchParams): Promise<SavedSearch> => {
    const response = await appAxios.post('/saved-searches', params);
    return response.data;
  },
  
  // Delete a saved search
  deleteSavedSearch: async (id: number): Promise<void> => {
    await appAxios.delete(`/saved-searches/${id}`);
  },
  
  // Clear all saved searches
  clearSavedSearches: async (): Promise<void> => {
    await appAxios.delete('/saved-searches/clear');
  }
};