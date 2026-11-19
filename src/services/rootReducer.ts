import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from './slices/authSlice';
import { burgerConstructorReducer } from './slices/burgerConstructorSlice';
import { feedReducer } from './slices/feedSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { ordersReducer } from './slices/ordersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  orders: ordersReducer,
});
