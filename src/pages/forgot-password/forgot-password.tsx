import { forgotPassword } from '@slices/authSlice';
import { ForgotPasswordUI } from '@ui-pages';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(forgotPassword(email))
      .unwrap()
      .then(
        () => {
          localStorage.setItem('resetPassword', 'true');
          void navigate('/reset-password', { replace: true });
        },
        (error: unknown) => {
          // Request errors are stored in auth.error and rendered by ForgotPasswordUI.
          if (typeof error !== 'object' || error === null || !('message' in error)) {
            console.error('Unexpected password recovery error', error);
          }
        }
      );
  };

  return (
    <ForgotPasswordUI
      errorText={error ?? undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
