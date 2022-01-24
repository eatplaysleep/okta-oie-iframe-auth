/** @format */

import React, { Suspense } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, SecureRoute } from '@okta/okta-react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { authConfig, routes } from './config';
import { AuthProvider } from './providers';
import { Theme } from './styles/Theme';
import './styles/App.css';
import { AppNavBar, Seo } from './components';

const oktaAuth = new OktaAuth(authConfig.oidc);

oktaAuth.start();

const App = () => {
  const history = useHistory();
  const restoreOriginalUri = async (_oktaAuth, originalUri) =>
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  const customAuthHandler = () => {
    history.push('/');
  };

  return (
    <ThemeProvider theme={Theme}>
      <Seo />
      <CssBaseline />
      <Suspense fallback={<div>Loading...</div>}>
        <Security
          oktaAuth={oktaAuth}
          restoreOriginalUri={restoreOriginalUri}
          onAuthRequired={customAuthHandler}
        >
          <AuthProvider>
            <AppNavBar />
            <div>
              <Switch>
                {routes.map((route) => {
                  if (route?.isSecure) {
                    return (
                      <SecureRoute
                        key={route.path}
                        path={route.path}
                        exact={route?.isExact ?? false}
                        component={route.component}
                      />
                    );
                  } else {
                    return (
                      <Route
                        key={route.path}
                        path={route.path}
                        exact={route?.isExact ?? false}
                        component={route.component}
                      />
                    );
                  }
                })}
              </Switch>
            </div>
          </AuthProvider>
        </Security>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
