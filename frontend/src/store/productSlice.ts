//product slice
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import appAxios from '../services/appAxios';
import { Product, Category, NewProduct, State } from '../utils/type';
import { RootState } from './index';
import { ProductStatus } from '../utils/type';

// Define the structure for paginated response
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  from?: number;
  to?: number;
  total?: number;
  per_page?: number;
  last_page?: number;
}

// Define product query parameters
export interface ProductQueryParams {
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort_price?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
  city_id?: number; 
}

interface StateState {
  states: State[];
  loading: boolean;
  error: string | null;
}

interface CityState {
  cities: Record<string, string>;
  loading: boolean;
  error: string | null;
}

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: number | string, { rejectWithValue, dispatch }) => {
    let retries = 0;
    const maxRetries = 5;
    const baseRetryDelay = 10000; // 10 seconds base delay
    
    while (retries < maxRetries) {
      try {
        const response = await appAxios.get<Product>(`/products/${productId}`);
        return response.data;
      } catch (error: any | unknown) {
        retries++;
        if (retries >= maxRetries) {
          if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
          } else {
            return rejectWithValue(error.message || 'Failed to load product');
          }
        }
        
        // Exponential backoff - increase delay with each retry
        const currentDelay = baseRetryDelay * Math.pow(1.5, retries);
        console.log(`Retry ${retries}/${maxRetries} for product ${productId}. Waiting ${currentDelay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await appAxios.get<PaginatedResponse<Product>>('/products', { 
        params 
      });
      return response.data;
    } catch (error: any | unknown) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchUserProducts = createAsyncThunk(
  'products/fetchUserProducts',
  async ({ userId, status }: { userId: number, status: ProductStatus }, { rejectWithValue }) => {
    try {
      let endpoint;
      switch (status) {
        case ProductStatus.SELLING:
          endpoint = `/users/${userId}/selling-products`;
          break;
        case ProductStatus.SOLD:
          endpoint = `/users/${userId}/sold-products`;
          break;
        case ProductStatus.BOUGHT:
          endpoint = `/users/${userId}/bought-products`;
          break;
        default:
          endpoint = `/users/${userId}/selling-products`;
      }
      
      const response = await appAxios.get<Product[]>(endpoint);
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

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    const { categories } = (getState() as RootState).categories;
    if (categories.length > 0) {
      return categories;
    }
    try {
      const response = await appAxios.get<Category[]>('/categories');
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

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (newProduct: NewProduct, { rejectWithValue }) => {
    try {
      const response = await appAxios.post<Product>('/products', newProduct);
      return response.data;
    } catch (error: any | unknown) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchStates = createAsyncThunk(
  'states/fetchStates',
  async (_, { getState, rejectWithValue }) => {
    const { states } = (getState() as RootState).states;
    // Return cached states if available
    if (states.length > 0) {
      return states;
    }
    try {
      const response = await appAxios.get<State[]>('/states');
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

export const fetchCities = createAsyncThunk(
  'cities/fetchCities',
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

// Add product update functionality
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: number; data: Partial<NewProduct> }, { rejectWithValue }) => {
    try {
      const response = await appAxios.put<Product>(`/products/${id}`, data);
      return response.data;
    } catch (error: any | unknown) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Add product delete functionality
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await appAxios.delete(`/products/${id}`);
      return id; // Return the ID to remove it from state
    } catch (error: any | unknown) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Updated product state to handle pagination
interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  loading: boolean;
  error: string | null;
  userProducts: Product[];
  userProductsLoading: boolean;
  userProductsError: string | null;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialProductState: ProductState = {
  products: [],
  currentProduct: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  perPage: 15,
  loading: false,
  error: null,
  userProducts: [],
  userProductsLoading: false,
  userProductsError: null,
};

const initialCategoryState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const initialStateState: StateState = {
  states: [],
  loading: false,
  error: null,
};

const initialCityState: CityState = {
  cities: {},
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState: initialProductState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
    },
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.error = null;
      state.loading = true; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the paginated response
        state.products = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page || 1;
        state.totalItems = action.payload.total || action.payload.data.length;
        state.perPage = action.payload.per_page || 15;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        // Just add the new product to the existing list
        // In a real application, you might want to refetch
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload ?? null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Update the product in the list
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // Also update current product if it's the same one
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the product from the list
        state.products = state.products.filter(product => product.id !== action.payload);
        // Clear current product if it's the same one
        if (state.currentProduct && state.currentProduct.id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProducts.pending, (state) => {
        state.userProductsLoading = true;
        state.userProductsError = null;
      })
      .addCase(fetchUserProducts.fulfilled, (state, action) => {
        state.userProductsLoading = false;
        state.userProducts = action.payload;
      })
      .addCase(fetchUserProducts.rejected, (state, action) => {
        state.userProductsLoading = false;
        state.userProductsError = action.payload as string;
      });

      
      
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: initialCategoryState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

const stateSlice = createSlice({
  name: 'states',
  initialState: initialStateState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

const citySlice = createSlice({
  name: 'cities',
  initialState: initialCityState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setCurrentPage, setPerPage, clearCurrentProduct } = productSlice.actions;
export const productReducer = productSlice.reducer;
export const categoryReducer = categorySlice.reducer;
export const stateReducer = stateSlice.reducer;
export const cityReducer = citySlice.reducer;