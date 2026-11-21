import { RegisterUI } from '@ui-pages';
import { register } from '@slices/authSlice';
import { useDispatch, useSelector } from '@services/store';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    const result = await dispatch(
      register({ name: userName, email, password })
    );
    if (register.fulfilled.match(result)) {
      const from =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname ?? '/';
      void navigate(from, { replace: true });
    }
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
