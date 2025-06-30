import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ordersService, Order, CreateOrderParams } from '../services/ordersService';

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
  actionLoading: { [key: number]: boolean };
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
  actionLoading: {},
};

// Fetch user's orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await ordersService.getOrders();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create a new order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (params: CreateOrderParams, { rejectWithValue }) => {
    try {
      return await ordersService.createOrder(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Accept an order
export const acceptOrder = createAsyncThunk(
  'orders/acceptOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      await ordersService.acceptOrder(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Reject an order
export const rejectOrder = createAsyncThunk(
  'orders/rejectOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      await ordersService.rejectOrder(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Ship an order
export const shipOrder = createAsyncThunk(
  'orders/shipOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      await ordersService.shipOrder(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Complete an order
export const completeOrder = createAsyncThunk(
  'orders/completeOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      await ordersService.completeOrder(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Accept order
      .addCase(acceptOrder.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.actionLoading[action.payload] = false;
        const order = state.items.find(item => item.id === action.payload);
        if (order) {
          order.order_status = 'accepted';
          order.tracking_status = 'preparing';
          order.accepted_at = new Date().toISOString();
        }
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      })
      
      // Reject order
      .addCase(rejectOrder.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(rejectOrder.fulfilled, (state, action) => {
        state.actionLoading[action.payload] = false;
        const order = state.items.find(item => item.id === action.payload);
        if (order) {
          order.order_status = 'rejected';
        }
      })
      .addCase(rejectOrder.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      })
      
      // Ship order
      .addCase(shipOrder.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(shipOrder.fulfilled, (state, action) => {
        state.actionLoading[action.payload] = false;
        const order = state.items.find(item => item.id === action.payload);
        if (order) {
          order.order_status = 'accepted'; // Status remains accepted
          order.tracking_status = 'shipped';
          order.shipped_at = new Date().toISOString();
        }
      })
      .addCase(shipOrder.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      })
      
      // Complete order
      .addCase(completeOrder.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(completeOrder.fulfilled, (state, action) => {
        state.actionLoading[action.payload] = false;
        const order = state.items.find(item => item.id === action.payload);
        if (order) {
          order.order_status = 'completed';
          order.tracking_status = 'delivered';
          order.delivered_at = new Date().toISOString();
        }
      })
      .addCase(completeOrder.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;