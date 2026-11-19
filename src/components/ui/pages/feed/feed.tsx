import { OrdersList, FeedInfo } from '@components';
import { RefreshButton } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';

import type { FeedUIProps } from './type';

import styles from './feed.module.css';

export const FeedUI = memo(function FeedUI({
  orders,
  handleGetFeeds,
  error,
}: FeedUIProps): React.JSX.Element {
  return (
    <main className={styles.containerMain}>
      <div className={`${styles.titleBox} mt-10 mb-5`}>
        <h1 className="text text_type_main-large">Лента заказов</h1>
        <RefreshButton text="Обновить" onClick={handleGetFeeds} extraClass={'ml-30'} />
      </div>
      {error && (
        <p className="text text_type_main-default text_color_inactive">{error}</p>
      )}
      <div className={styles.main}>
        <div className={styles.columnOrders}>
          {orders.length ? (
            <OrdersList orders={orders} />
          ) : (
            <p className="text text_type_main-default">Заказов пока нет</p>
          )}
        </div>
        <div className={styles.columnInfo}>
          <FeedInfo />
        </div>
      </div>
    </main>
  );
});
