import { getIngredients, ingredientsReducer } from '../ingredientsSlice';

import type { TIngredient } from '@utils-types';

const ingredient: TIngredient = {
  _id: 'bun-id',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
};

describe('ingredientsReducer', () => {
  it('returns the initial state for an unknown action and undefined state', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  it('marks ingredients as loading when the request starts', () => {
    expect(
      ingredientsReducer(
        { ingredients: [ingredient], isLoading: false, error: 'Previous error' },
        getIngredients.pending('request-id')
      )
    ).toEqual({ ingredients: [ingredient], isLoading: true, error: null });
  });

  it('stores ingredients when the request succeeds', () => {
    expect(
      ingredientsReducer(
        { ingredients: [], isLoading: true, error: null },
        getIngredients.fulfilled([ingredient], 'request-id')
      )
    ).toEqual({ ingredients: [ingredient], isLoading: false, error: null });
  });

  it('stores the request error when loading fails', () => {
    expect(
      ingredientsReducer(
        { ingredients: [], isLoading: true, error: null },
        getIngredients.rejected(new Error('Network error'), 'request-id')
      )
    ).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Network error',
    });
  });
});
