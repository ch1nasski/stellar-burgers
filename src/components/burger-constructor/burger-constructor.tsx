import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from '@services/store';
import { useDispatch } from '@services/store';
import { clearOrder, createOrder } from '@slices/burgerConstructorSlice';

import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const constructorState = useSelector((state) => state.burgerConstructor);
  const constructorItems: TConstructorState = {
    bun: constructorState.bun,
    ingredients: constructorState.ingredients,
  };
  const orderRequest = constructorState.orderRequest;
  const orderError = constructorState.orderError;
  const orderModalData: TOrder | null = constructorState.orderModalData;
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = (): void => {
    if (orderRequest) return;
    if (!user) {
      void navigate('/login', { state: { from: location }, replace: true });
      return;
    }
    if (!constructorItems.bun) return;
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];
    void dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      orderError={orderError}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
