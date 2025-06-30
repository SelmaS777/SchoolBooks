import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { savedSearchesService, SavedSearch, SaveSearchParams } from '../services/savedSearchesService';

interface SavedSearchesState {
  items: SavedSearch[];
  loading: boolean;
  error: string | null;
}

const initialState: SavedSearchesState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch user's saved searches
export const fetchSavedSearches = createAsyncThunk(
  'savedSearches/fetchSavedSearches',
  async (_, { rejectWithValue }) => {
    try {
      return await savedSearchesService.getSavedSearches();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Save a search query
export const saveSearch = createAsyncThunk(
  'savedSearches/saveSearch',
  async (params: SaveSearchParams, { rejectWithValue }) => {
    try {
      return await savedSearchesService.saveSearch(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a saved search
export const deleteSavedSearch = createAsyncThunk(
  'savedSearches/deleteSavedSearch',
  async (id: number, { rejectWithValue }) => {
    try {
      await savedSearchesService.deleteSavedSearch(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Clear all saved searches
export const clearSavedSearches = createAsyncThunk(
  'savedSearches/clearSavedSearches',
  async (_, { rejectWithValue }) => {
    try {
      await savedSearchesService.clearSavedSearches();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const savedSearchesSlice = createSlice({
  name: 'savedSearches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch saved searches
      .addCase(fetchSavedSearches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedSearches.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSavedSearches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Save search
      .addCase(saveSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(saveSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete saved search
      .addCase(deleteSavedSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSavedSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteSavedSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Clear saved searches
      .addCase(clearSavedSearches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearSavedSearches.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearSavedSearches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default savedSearchesSlice.reducer;