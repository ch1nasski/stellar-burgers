import { ProfileMenuUI } from '@ui';
import { logout } from '@slices/authSlice';
import { useDispatch, useSelector } from '@services/store';
import { useLocation, useNavigate } from 'react-router-dom';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const handleLogout = async (): Promise<void> => {
    const result = await dispatch(logout());
    if (logout.fulfilled.match(result)) {
      void navigate('/login', { replace: true });
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} error={error} />;
};
