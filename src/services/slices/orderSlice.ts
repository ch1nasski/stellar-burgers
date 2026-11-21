import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { clearConstructor } from '@slices/burgerConstructorSlice';

import type { TOrder } from '@utils-types';

type TOrderState = {
  createdOrder: TOrder | null;
  createRequest: boolean;
  createError: string | null;
  selectedOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  createdOrder: null,
  createRequest: false,
  createError: null,
  selectedOrder: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[], { dispatch }) => {
    const response = await orderBurgerApi(ingredientIds);
    dispatch(clearConstructor());
    return response.order;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0] ?? null;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCreatedOrder: (state) => {
      state.createdOrder = null;
      state.createRequest = false;
      state.createError = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.createRequest = true;
        state.createdOrder = null;
        state.createError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createRequest = false;
        state.createdOrder = action.payload;
        state.createError = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createRequest = false;
        state.createdOrder = null;
        state.createError = action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.selectedOrder = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});

export const { clearCreatedOrder, clearSelectedOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
