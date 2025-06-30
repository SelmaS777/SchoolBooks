import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import appAxios from '../services/appAxios';
import { RootState } from './index';

export interface ProfileState {
  userProfile: {
    id?: number;
    full_name: string;
    email: string;
    phone_number: string;
    image_url?: string;
    personal_details?: string;
    city_id?: number | string;
    tier_id?: number;
    created_at?: string;
    updated_at?: string;
    tier?: {
      id: number;
      name: string;
      description: string;
      price: string;
      max_listings: number;
      featured_listings: boolean;
      priority_support: boolean;
      created_at: string;
      updated_at: string;
    };
    city?: {
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
    };
    cards?: Array<{
      id: number;
      user_id: number;
      card_type: string;
      last_four: string;
      cardholder_name: string;
      expiry_month: string;
      expiry_year: string;
      is_default: boolean;
      created_at: string;
      updated_at: string;
    }>;
  } | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  tierUpdateLoading: boolean;
  tierUpdateSuccess: boolean;
  tierUpdateError: string | null;
}

const initialState: ProfileState = {
  userProfile: null,
  loading: false,
  error: null,
  success: false,
  tierUpdateLoading: false,
  tierUpdateSuccess: false,
  tierUpdateError: null
};

export interface UpdateProfileData {
  full_name: string;
  phone_number: string;
  city_id?: string | number;
  personal_details?: string;
  image_url?: string;
}

export interface UpdateTierData {
  tier_id: number;
}

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get token from state
      const token = (getState() as RootState).auth.userToken;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await appAxios.get('/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

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

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data: UpdateProfileData, { rejectWithValue, getState }) => {
    try {
      // Get token from state
      const token = (getState() as RootState).auth.userToken;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await appAxios.put(
        '/profile',
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

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

// Update user tier
export const updateUserTier = createAsyncThunk(
  'profile/updateTier',
  async (data: UpdateTierData, { rejectWithValue, getState }) => {
    try {
      // Get token from state
      const token = (getState() as RootState).auth.userToken;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await appAxios.put(
        '/profile/tier',
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

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

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileErrors: (state) => {
      state.error = null;
      state.success = false;
    },
    setProfile: (state, action: PayloadAction<ProfileState['userProfile']>) => {
      state.userProfile = action.payload;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    clearTierUpdateState: (state) => {
      state.tierUpdateLoading = false;
      state.tierUpdateSuccess = false;
      state.tierUpdateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload.user || action.payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Update tier cases
      .addCase(updateUserTier.pending, (state) => {
        state.tierUpdateLoading = true;
        state.tierUpdateError = null;
        state.tierUpdateSuccess = false;
      })
      .addCase(updateUserTier.fulfilled, (state, action) => {
        state.tierUpdateLoading = false;
        state.userProfile = action.payload;
        state.tierUpdateSuccess = true;
      })
      .addCase(updateUserTier.rejected, (state, action) => {
        state.tierUpdateLoading = false;
        state.tierUpdateError = action.payload as string;
        state.tierUpdateSuccess = false;
      });
  }
});

export const { clearProfileErrors, setProfile, resetSuccess, clearTierUpdateState } = profileSlice.actions;
export default profileSlice.reducer;