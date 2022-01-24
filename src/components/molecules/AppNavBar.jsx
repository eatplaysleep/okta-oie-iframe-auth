/** @format */

import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  AuthModal,
  LinkIconButton,
  LoginButton,
  LogoutButton,
  Snackbar,
  Toolbar,
  Typography,
} from '../../components';
import { Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuthDispatch, useAuthState } from '../../providers';

export const AppNavBar = () => {
  const dispatch = useAuthDispatch();
  const {
    error,
    authModalIsVisible,
    isError,
    isAuthenticated,
    isLoadingLogin,
    isLoadingProfile,
    isLoadingLogout,
    silentAuth,
    user,
  } = useAuthState();

  const handleSnackbar = () => {
    dispatch({ type: 'DISMISS_ERROR' });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return silentAuth(dispatch);
    }
  }, []);

  return (
    <AppBar>
      <AuthModal loginHint={user?.login} open={authModalIsVisible} onClose={() => {}} />
      <Snackbar open={isError} onClose={handleSnackbar} severity='error' error={error} />
      <Toolbar>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          {isAuthenticated && (
            <div>
              <LinkIconButton to='/profile'>
                <AccountCircle />
                <Typography variant='subtitle1'>&nbsp;&nbsp;{user?.name}</Typography>
              </LinkIconButton>
            </div>
          )}
        </Box>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <Typography
            variant='h6'
            component='div'
            color='white'
            sx={{ fontSize: 24, textAlign: 'center' }}
          >
            Atko International
          </Typography>
        </Link>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {!isLoadingProfile && !isLoadingLogin && isAuthenticated && (
            <Fragment>
              <LogoutButton
                isIconButton={true}
                sx={{ color: 'secondary.main' }}
                loading={isLoadingLogout}
              />
            </Fragment>
          )}
          {(isLoadingLogin || isLoadingProfile || !isAuthenticated) && (
            <Fragment>
              <div>
                <LoginButton loading={isLoadingLogin || isLoadingProfile} />
              </div>
            </Fragment>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
