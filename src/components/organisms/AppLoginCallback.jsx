/** @format */
import { useEffect } from 'react';
import { LoadingOverlay } from '../../components';
import { useAuthActions, useAuthDispatch } from '../../providers';

export const AppLoginCallback = () => {
  const { login } = useAuthActions();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    return login(dispatch);
  }, [login, dispatch]);

  return (
    <div>
      <LoadingOverlay open={true} />
    </div>
  );
};
