import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import appAxios from '../services/appAxios.ts'
import { LoginFormData, RegistrationFormData, User } from '../utils/type';

// initialize from local storage
const userToken = localStorage.getItem('userToken') || null;
const userInfo = localStorage.getItem('userInfo') 
  ? JSON.parse(localStorage.getItem('userInfo') || '{}')
  : null;

const initialState = {
    loading: false,
    userInfo, // for user object
    userToken, // for storing the JWT
    error: null,
    success: false, // for monitoring the registration process.
    resetPasswordLoading: false,
    resetPasswordSuccess: false,
    resetPasswordError: null,
}


export const login = createAsyncThunk(
    'auth/login',
    async (data: LoginFormData, { rejectWithValue }) => {
        try {
          const response = await appAxios.post('/auth/login', {
              email: data.email,
              password: data.password
          });
          
          
          const { access_token, user } = response.data;
          
          // Make sure we have the expected data structure
          if (!access_token) {
            return rejectWithValue('Invalid token received from server');
          }
          
          // Save token and user info to localStorage
          localStorage.setItem('userToken', access_token);
          localStorage.setItem('userInfo', JSON.stringify(user));
          
          // Set the token for future API calls
          appAxios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          
          return { jwt: access_token, user };
        } catch (error: any) {
            // return custom error message from backend if present
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
  );

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegistrationFormData, { rejectWithValue }) => {
      try {
          const response = await appAxios.post('/auth/register', data);
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

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await appAxios.post('/auth/forgot-password', { email });
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

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data: { token: string; email: string; password: string; password_confirmation: string }, { rejectWithValue }) => {
        try {
            const response = await appAxios.post('/auth/reset-password', data);
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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userToken') 
            localStorage.removeItem('userInfo')
            state.loading = false
            state.userInfo = null
            state.userToken = null
            state.error = null
            state.success = false
        },
        clearResetPasswordState: (state) => {
            state.resetPasswordLoading = false;
            state.resetPasswordSuccess = false;
            state.resetPasswordError = null;
        }
    },
    extraReducers: (builder) => {
        // Login user
        builder.addCase(login.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(login.fulfilled, (state, action: any) => {
            state.loading = false
            state.userInfo = action.payload.user
            state.userToken = action.payload.jwt
            state.error = null
        })
        builder.addCase(login.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload;
            state.userToken = null; // Ensure token is null if login fails
            state.userInfo = null; // Clear user info on failure
        });

         // Register user
         builder.addCase(registerUser.pending, (state) => {
          state.loading = true
          state.error = null
      })
      builder.addCase(registerUser.fulfilled, (state) => {
          state.loading = false
          state.success = true
          state.error = null
      })
      builder.addCase(registerUser.rejected, (state, action: any) => {
          state.loading = false
          state.error = action.payload
      })

              // Forgot Password
        builder.addCase(forgotPassword.pending, (state) => {
            state.resetPasswordLoading = true;
            state.resetPasswordError = null;
        });
        builder.addCase(forgotPassword.fulfilled, (state) => {
            state.resetPasswordLoading = false;
            state.resetPasswordError = null;
        });
        builder.addCase(forgotPassword.rejected, (state, action: any) => {
            state.resetPasswordLoading = false;
            state.resetPasswordError = action.payload;
        });

        // Reset Password
        builder.addCase(resetPassword.pending, (state) => {
            state.resetPasswordLoading = true;
            state.resetPasswordError = null;
        });
        builder.addCase(resetPassword.fulfilled, (state) => {
            state.resetPasswordLoading = false;
            state.resetPasswordSuccess = true;
            state.resetPasswordError = null;
        });
        builder.addCase(resetPassword.rejected, (state, action: any) => {
            state.resetPasswordLoading = false;
            state.resetPasswordError = action.payload;
        });
       
    }
})

// ...
export const { logout, clearResetPasswordState } = authSlice.actions
export default authSlice.reducer