import { ForgotPasswordUI } from '@ui-pages';
import { forgotPassword } from '@slices/authSlice';
import { useDispatch, useSelector } from '@services/store';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    const result = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(result)) {
      localStorage.setItem('resetPassword', 'true');
      void navigate('/reset-password', { replace: true });
    }
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
