import { logout } from '@slices/authSlice';
import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const handleLogout = (): void => {
    void dispatch(logout());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} error={error} />;
};
