import {
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from '../burgerConstructorSlice';
import { createOrder } from '../orderSlice';

import type { TConstructorIngredient, TConstructorState } from '@utils-types';

const bun: TConstructorIngredient = {
  _id: 'bun-id',
  id: 'bun-instance-id',
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

const filling: TConstructorIngredient = {
  ...bun,
  _id: 'filling-id',
  id: 'filling-instance-id',
  name: 'Тестовая начинка',
  type: 'main',
  price: 3000,
};

const sauce: TConstructorIngredient = {
  ...bun,
  _id: 'sauce-id',
  id: 'sauce-instance-id',
  name: 'Тестовый соус',
  type: 'sauce',
  price: 80,
};

const populatedState: TConstructorState = {
  bun,
  ingredients: [filling, sauce],
};

describe('burgerConstructorReducer', () => {
  it('returns the initial state for an unknown action and undefined state', () => {
    expect(burgerConstructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('adds a bun and replaces the previously selected bun', () => {
    const replacementBun = { ...bun, _id: 'replacement-bun-id' };

    expect(
      burgerConstructorReducer({ bun, ingredients: [] }, addIngredient(replacementBun))
    ).toEqual({ bun: replacementBun, ingredients: [] });
  });

  it('adds non-bun ingredients in order', () => {
    expect(
      burgerConstructorReducer(
        { bun: null, ingredients: [filling] },
        addIngredient(sauce)
      )
    ).toEqual({ bun: null, ingredients: [filling, sauce] });
  });

  it('removes an ingredient by its constructor instance id', () => {
    expect(
      burgerConstructorReducer(populatedState, removeIngredient(filling.id))
    ).toEqual({ bun, ingredients: [sauce] });
  });

  it('moves an ingredient to the requested position', () => {
    expect(
      burgerConstructorReducer(
        populatedState,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      )
    ).toEqual({ bun, ingredients: [sauce, filling] });
  });

  it('leaves ingredients unchanged when a move index is out of bounds', () => {
    expect(
      burgerConstructorReducer(
        populatedState,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      )
    ).toEqual(populatedState);
  });

  it('clears the bun and all ingredients', () => {
    expect(burgerConstructorReducer(populatedState, clearConstructor())).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it.each([
    ['pending', createOrder.pending('request-id', ['bun-id'])],
    [
      'fulfilled',
      createOrder.fulfilled(
        {
          _id: 'order-id',
          status: 'done',
          name: 'Тестовый заказ',
          createdAt: '2026-11-25T10:00:00.000Z',
          updatedAt: '2026-11-25T10:00:00.000Z',
          number: 123456,
          ingredients: ['bun-id'],
        },
        'request-id',
        ['bun-id']
      ),
    ],
    [
      'rejected',
      createOrder.rejected(new Error('Request failed'), 'request-id', ['bun-id']),
    ],
  ])('does not alter constructor state on the order request %s action', (_, action) => {
    expect(burgerConstructorReducer(populatedState, action)).toEqual(populatedState);
  });
});
