import { FeedInfoUI } from '@ui';

import { useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

const maxOrdersToShow = 15;

const getOrders = (orders: TOrder[], status: TOrder['status']): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, maxOrdersToShow);

export const FeedInfo = (): React.JSX.Element => {
  const feed = useSelector((state) => state.feed);
  const readyOrders = getOrders(feed.orders, 'done');
  const pendingOrders = getOrders(feed.orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
