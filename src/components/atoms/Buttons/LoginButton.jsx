/** @format */
import { React } from 'globals.jsx';
import LoadingButton from './LoadingButton';
import { useAuthState, useAuthDispatch } from 'providers';

export const LoginButton = (props) => {
  const dispatch = useAuthDispatch();
  const { isLoadingLogin, isLoadingProfile } = useAuthState();

  props = {
    onClick: () => dispatch({ type: 'LOGIN_MODAL_START' }),
    color: 'primary',
    children: 'Login',
    loading: isLoadingLogin ?? isLoadingProfile ?? false,
    variant: 'outline',
    ...props,
  };

  return <LoadingButton {...props} />;
};
