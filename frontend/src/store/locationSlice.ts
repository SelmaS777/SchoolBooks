// Create a new file called locationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appAxios from '../services/appAxios';

interface LocationState {
  cities: Record<string, string>;
  citiesLoading: boolean;
  citiesError: string | null;
}

const initialState: LocationState = {
  cities: {},
  citiesLoading: false,
  citiesError: null
};

// Fetch all cities
export const fetchCities = createAsyncThunk(
  'location/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appAxios.get<Record<string, string>>('/all-cities');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.citiesLoading = true;
        state.citiesError = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.citiesLoading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.citiesLoading = false;
        state.citiesError = action.payload as string;
      });
  }
});

export default locationSlice.reducer;