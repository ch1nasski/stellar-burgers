import { getOrderByNumber } from '@slices/orderSlice';
import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const cachedOrder = useSelector((state) =>
    [...state.feed.orders, ...state.orders.orders].find(
      (order) => order.number === Number(number)
    )
  );
  const {
    selectedOrder,
    isLoading,
    error: orderError,
  } = useSelector((state) => state.order);
  const currentOrder = cachedOrder ?? selectedOrder;

  useEffect(() => {
    if (number && !cachedOrder && selectedOrder?.number !== Number(number)) {
      void dispatch(getOrderByNumber(Number(number)));
    }
  }, [cachedOrder, dispatch, number, selectedOrder?.number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total,
    };
  }, [currentOrder, ingredients]);

  if (!orderInfo) {
    if (orderError) {
      return <p className="text text_type_main-default">{orderError}</p>;
    }
    if (!isLoading && !currentOrder) {
      return <p className="text text_type_main-default">Заказ не найден</p>;
    }
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
