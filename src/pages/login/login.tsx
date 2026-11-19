import { LoginUI } from '@ui-pages';
import { login } from '@slices/authSlice';
import { useDispatch, useSelector } from '@services/store';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      const from =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname ?? '/';
      void navigate(from, { replace: true });
    }
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
