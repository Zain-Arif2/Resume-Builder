import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/services/baseApi';
import authReducer from '@/features/auth/authSlice';
import creditReducer from '@/features/credits/creditSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    credits: creditReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
  devTools: import.meta.env.MODE !== 'production',
});
