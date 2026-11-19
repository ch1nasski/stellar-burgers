import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

type TBurgerConstructorState = TConstructorState & {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null,
};

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredientIds: string[], { dispatch }) => {
    const response = await orderBurgerApi(ingredientIds);
    dispatch(clearConstructor());
    return response.order;
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length
      ) {
        return;
      }
      const [ingredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, ingredient);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    clearOrder: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.orderError = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = null;
        state.orderError = action.error.message ?? 'Не удалось оформить заказ';
      });
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrder,
} = burgerConstructorSlice.actions;

export const createConstructorIngredient = (
  ingredient: TConstructorIngredient
): TConstructorIngredient => ({
  ...ingredient,
  id: nanoid(),
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
