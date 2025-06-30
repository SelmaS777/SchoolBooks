import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cartService } from '../services/cartService';
import { Product } from '../utils/type';

// Define the cart item structure from the backend
interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  checkoutItems: CartItem[]; 
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  checkoutItems: [],
};

// Fetch user's cart items
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  'cart/addProduct',
  async (productId: number, { rejectWithValue }) => {
    try {
      return await cartService.addProduct(productId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove product from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeProduct',
  async (productId: number, { rejectWithValue }) => {
    try {
      await cartService.removeProduct(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const setCheckoutItems = createAsyncThunk(
  'cart/setCheckoutItems',
  async (items: CartItem[]) => {
    return items;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCheckoutItems: (state) => {
      state.checkoutItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // In case backend returns the updated cart
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        }
        // In case backend returns just the added item
        else if (action.payload && !Array.isArray(action.payload)) {
          // Check if item already exists
          const existingIndex = state.items.findIndex(
            item => item.product_id === action.payload.product_id
          );
          
          if (existingIndex >= 0) {
            state.items[existingIndex] = action.payload;
          } else {
            state.items.push(action.payload);
          }
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.product_id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Set checkout items
      .addCase(setCheckoutItems.fulfilled, (state, action) => {
        state.checkoutItems = action.payload;
      });
  },
});

export const { clearCheckoutItems } = cartSlice.actions;
export default cartSlice.reducer;