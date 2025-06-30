// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import profileReducer from './profileSlice';
import savedSearchesReducer from './savedSearchesSlice';
import { productReducer, categoryReducer, stateReducer } from './productSlice';
import { cityReducer } from './productSlice';
import notificationServiceReducer from './notificationSlice';
import ordersSlice from './ordersSlice';

const store = configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      profile: profileReducer,
      products: productReducer,
      categories: categoryReducer,
      states: stateReducer,
      cities: cityReducer,
      wishlist: wishlistReducer,
      savedSearches: savedSearchesReducer,
      notificationSlice: notificationServiceReducer,
      orders:ordersSlice,
    },
  });

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>();

export default store;
