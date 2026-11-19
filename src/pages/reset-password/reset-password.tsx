import { ResetPasswordUI } from '@ui-pages';
import { resetPassword } from '@slices/authSlice';
import { useDispatch, useSelector } from '@services/store';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    const result = await dispatch(resetPassword({ password, token }));
    if (resetPassword.fulfilled.match(result)) {
      localStorage.removeItem('resetPassword');
      void navigate('/login');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error ?? undefined}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
