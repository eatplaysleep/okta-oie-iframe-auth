/** @format */
import { Fragment, useEffect, useState } from 'react';
import { Container, Grid, List, ListItem, ListItemText } from '@mui/material';
import { Authenticators, FactorModal, Loader, Paper, Typography } from 'components';
import { useAuthDispatch, useAuthState } from 'providers';

const OKTA_URL = process.env.REACT_APP_OKTA_URL;

export const Profile = () => {
  const dispatch = useAuthDispatch();
  const {
    user,
    factorModalIsVisible,
    isLoadingProfile,
    isStaleAuthenticators,
    isLoadingAuthenticators,
  } = useAuthState();
  const [profile, setProfile] = useState();
  const [authenticators, setAuthenticators] = useState();
  const [availableFactors, setAvailableFactors] = useState();

  useEffect(() => {
    const buildProfile = async () => {
      let profile = [],
        result;

      for (const [key, value] of Object.entries(user)) {
        if (key === 'address') {
          for (const [addressKey, addressValue] of Object.entries(value)) {
            profile.push({ key: addressKey, value: addressValue });
          }
        } else {
          profile.push({ key: key, value: value });
        }
      }

      if (profile.length > 0) {
        {
          result = profile.map((attribute) => (
            <ListItem key={attribute.key}>
              <ListItemText primary={attribute.key} secondary={attribute.value} />
            </ListItem>
          ));
        }
      }

      setProfile(() => result);
    };

    if (user?.updated_at) {
      dispatch({ type: 'USER_LOADING' });
      console.debug('building profile...');
      buildProfile().then(() => dispatch({ type: 'USER_LOADING_SUCCESS' }));
    }
  }, [user?.updated_at, dispatch]);

  useEffect(() => {
    const controller = new AbortController();

    const getIdpAuthenticators = async () => {
      let url = `${OKTA_URL}/idp/authenticators`;
      return fetch(url, { credentials: 'include' }).then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
      });
    };

    const getAvailableFactors = async () => {
      dispatch({ type: 'AUTHENTICATORS_LOADING' });

      let url = `${window.location.origin}/api/${user?.sub}/factors/catalog`;

      const _authenticators = await getIdpAuthenticators();

      return fetch(url, {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify(_authenticators),
      })
        .then((resp) => {
          return resp.json();
        })
        .then((resp) => {
          if (Array.isArray(resp) && resp.length > 0) {
            setAvailableFactors(resp);
          }
          return resp;
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            console.debug('successfully aborted');
          } else {
            console.error(err);
            dispatch({ type: 'FETCH_ERROR', error: err });
          }
        });
    };

    if (isStaleAuthenticators) {
      getAvailableFactors().then(() => dispatch({ type: 'AUTHENTICATORS_REFRESH_SUCCESS' }));
    }

    return () => controller.abort();
  }, [isStaleAuthenticators, dispatch]);

  useEffect(() => {
    if (availableFactors) {
      setAuthenticators(() => <Authenticators factors={availableFactors} />);
    }
  }, [availableFactors]);

  return (
    <Container component='section' sx={{ mt: 8, mb: 4 }}>
      <FactorModal open={factorModalIsVisible} onClose={() => {}} />
      <Typography variant='h4' marked='center' align='center' component='h2'>
        Profile
      </Typography>
      <Grid columns={2} spacing={3} container>
        <Grid item md={1}>
          <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography variant='h5' gutterBottom sx={{ mt: 2 }}>
              ATTRIBUTES
            </Typography>
            <List disablePadding>
              {isLoadingProfile && <Loader />}
              {profile}
            </List>
          </Paper>
        </Grid>
        <Grid item md={1}>
          <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography variant='h5' gutterBottom sx={{ mt: 2 }}>
              AUTHENTICATORS
            </Typography>
            <List disablePadding>
              {isLoadingAuthenticators && <Loader />}
              {authenticators}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
