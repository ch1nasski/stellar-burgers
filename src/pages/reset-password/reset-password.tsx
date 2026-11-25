import { resetPassword } from '@slices/authSlice';
import { ResetPasswordUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

export const ResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(resetPassword({ password, token })).then((result) => {
      if (resetPassword.fulfilled.match(result)) {
        localStorage.removeItem('resetPassword');
        void navigate('/login');
      }
    });
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
