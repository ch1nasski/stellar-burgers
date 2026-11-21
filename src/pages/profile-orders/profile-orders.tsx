import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '@services/store';
import { getOrders } from '@slices/ordersSlice';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    void dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} isLoading={isLoading} error={error} />;
};
