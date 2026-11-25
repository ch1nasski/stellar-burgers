import { login } from '@slices/authSlice';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(login({ email, password }));
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
