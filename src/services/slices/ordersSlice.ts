import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, getOrdersApi } from '@api';

import type { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
  orderError: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  orderData: null,
  isLoading: false,
  error: null,
  orderError: null,
};

export const getOrders = createAsyncThunk('orders/getOrders', async () =>
  getOrdersApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0] ?? null;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Не удалось загрузить историю заказов';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderData = null;
        state.isLoading = true;
        state.orderError = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload;
        state.isLoading = false;
        state.orderError = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.orderError = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});

export const ordersReducer = ordersSlice.reducer;
