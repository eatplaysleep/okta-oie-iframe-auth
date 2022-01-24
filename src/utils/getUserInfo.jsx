/** @format */

export const getUserInfo = async (oktaAuth, dispatch) => {
  try {
    const isAuthenticated = await oktaAuth.isAuthenticated();

    if (dispatch) {
      dispatch({
        type: 'GET_USER',
        payload: { isAuthenticated: isAuthenticated },
      });
    }

    let payload = { isAuthenticated, isLoadingProfile: false };

    if (isAuthenticated) {
      console.debug('Fetching user info...');
      const user = await oktaAuth.getUser();

      if (user?.headers) {
        delete user.headers;
      }

      payload = { ...payload, isStaleAuthenticators: true, user };

      localStorage.setItem('user', JSON.stringify(user));

      if (dispatch) {
        dispatch({ type: 'GET_USER_SUCCESS', payload: payload });
      }
    }
    return payload;
  } catch (err) {
    if (dispatch) {
      console.error(err);
      dispatch({ type: 'LOGIN_ERROR', error: err });
    } else throw err;
  }
};
