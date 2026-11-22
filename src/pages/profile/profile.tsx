import { updateUser } from '@slices/authSlice';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const updateUserError = useSelector((state) => state.auth.error) ?? undefined;
  const profileUser = user ?? { name: '', email: '' };

  const [formValue, setFormValue] = useState({
    name: profileUser.name,
    email: profileUser.email,
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: profileUser.name,
      email: profileUser.email,
    }));
  }, [profileUser.name, profileUser.email]);

  const isFormChanged =
    formValue.name !== profileUser.name ||
    formValue.email !== profileUser.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password ? { password: formValue.password } : {}),
      })
    ).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setFormValue((current) => ({ ...current, password: '' }));
      }
    });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: profileUser.name,
      email: profileUser.email,
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={updateUserError}
    />
  );
};
