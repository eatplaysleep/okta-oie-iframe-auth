/** @format */

import * as _ from 'lodash';

export const initialState = {
  isError: false,
  isLoading: false,
  isLoadingLogin: false,
  isAuthenticated: false,
  isLoadingProfile: false,
};

export const AuthReducer = (state, action) => {
  // console.debug('======= current state =======');
  // console.debug(JSON.stringify(state, null, 2));
  // console.debug('=======    action     =======');
  // console.debug(JSON.stringify(action, null, 2));
  switch (action.type) {
    case 'DISMISS_ERROR':
      if (state?.error) {
        delete state.error;
      }
      return _.merge({}, state, action?.payload, { isError: false });
    case 'GET_USER':
    case 'USER_LOADING':
      return _.merge({}, state, action?.payload, { isLoadingProfile: true });
    case 'USER_LOADING_SUCCESS':
      return _.merge({}, state, action?.payload, {
        isLoadingProfile: false,
      });
    case 'LOGIN_AUTHORIZE':
    case 'LOGIN_STARTED':
      return _.merge({}, state, action?.payload, {
        iFrameIsVisible: true,
        authModalIsVisible: true,
        isLoadingLogin: false,
      });
    case 'SILENT_AUTH_START':
      return _.merge({}, state, action?.payload, {
        isLoadingLogin: true,
        authModalIsVisible: false,
        iFrameIsVisible: false,
      });
    case 'SILENT_AUTH_END':
      return _.merge({}, state, action?.payload, {
        isLoadingLogin: false,
        authModalIsVisible: false,
        iFrameIsVisible: false,
      });
    case 'LOGIN_START':
      return _.merge({}, state, action?.payload, { isLoadingLogin: true });
    case 'LOGIN_MODAL_START':
      return _.merge({}, state, action?.payload, {
        iFrameIsVisible: true,
        authModalIsVisible: true,
        isLoadingLogin: true,
      });
    case 'LOGIN_REDIRECT':
      return _.merge({}, state, action?.payload, { isLoadingLogin: true });
    case 'EXCHANGE_CODE':
    case 'LOGIN_COMPLETE':
      return _.merge({}, state, action?.payload, {
        isLoadingLogin: true,
        iFrameIsVisible: false,
        authModalIsVisible: false,
      });
    case 'AUTHENTICATORS_LOADING':
      return _.merge({}, state, action?.payload, {
        isLoadingAuthenticators: true,
      });
    case 'AUTHENTICATORS_REFRESH':
      return _.merge({}, state, action?.payload, {
        isStaleAuthenticators: true,
      });
    case 'AUTHENTICATORS_ENROLL_SUCCESS':
      return _.merge({}, state, action?.payload, {
        isStaleAuthenticators: true,
        isLoadingAuthenticators: true,
        factorModalIsVisible: false,
        factorEnrollUrl: undefined,
      });
    case 'AUTHENTICATORS_REFRESH_SUCCESS':
      return _.merge({}, state, action?.payload, {
        isLoadingAuthenticators: false,
        isStaleAuthenticators: false,
      });
    case 'AUTHENTICATORS_ENROLL_START':
      return _.merge({}, state, action?.payload, {
        factorModalIsVisible: true,
      });
    case 'AUTHENTICATORS_ENROLL_CANCEL':
      return _.merge({}, state, action?.payload, {
        isLoadingAuthenticators: false,
        factorModalIsVisible: false,
        factorEnrollUrl: undefined,
      });
    case 'GET_USER_SUCCESS':
    case 'SILENT_AUTH_SUCCESS':
    case 'LOGIN_SUCCESS':
      delete state.tokenParams;
      return _.merge({}, state, action?.payload, {
        isLoadingLogin: false,
      });
    case 'SUCCESS':
      return _.merge({}, state, action?.payload);
    case 'LOGIN_CANCEL':
      return _.merge({}, state, action?.payload, {
        isLoadingLogin: false,
        authModalIsVisible: false,
        iFrameIsVisible: false,
      });

    case 'LOGOUT_SUCCESS':
      return _.merge({}, state, action?.payload);
    // return _.merge({}, state, action?.payload, { isLoadingLogout: false });
    case 'LOGOUT':
      return _.merge({}, state, action?.payload, { isLoadingLogout: true });
    case 'ERROR':
    case 'FETCH_ERROR':
    case 'LOGIN_ERROR':
      let result = _.merge({}, state, initialState, action?.payload, {
        error: action?.error,
        isError: true,
      });
      if (action?.error) {
        console.error(action.error);
      }
      return result;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
