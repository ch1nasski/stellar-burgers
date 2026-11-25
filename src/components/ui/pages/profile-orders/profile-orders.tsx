import { ProfileMenu, OrdersList } from '@components';

import type { ProfileOrdersUIProps } from './type';

import styles from './profile-orders.module.css';

export const ProfileOrdersUI = ({
  orders,
  isLoading,
  error,
}: ProfileOrdersUIProps): React.JSX.Element => (
  <main className={`${styles.main}`}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <div className={`mt-10 ${styles.orders}`}>
      {isLoading ? (
        <p className="text text_type_main-default">Загрузка заказов…</p>
      ) : error ? (
        <p className="text text_type_main-default">{error}</p>
      ) : orders.length ? (
        <OrdersList orders={orders} />
      ) : (
        <p className="text text_type_main-default">Заказов пока нет</p>
      )}
    </div>
  </main>
);
