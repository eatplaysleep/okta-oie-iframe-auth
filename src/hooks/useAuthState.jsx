/** @format */

import { useContext } from 'react';
import { AuthStateContext, AuthDispatchContext } from '../providers';

export const useAuthState = () => {
  const context = useContext(AuthStateContext);

  if (context === undefined) {
    throw new Error('useAuthState must be used within an AuthProvider!');
  }
  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);

  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within an AuthProvider!');
  }
  return context;
};
