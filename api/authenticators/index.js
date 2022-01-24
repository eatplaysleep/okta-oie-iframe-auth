/** @format */

import * as okta from '@okta/okta-sdk-nodejs';

const API_KEY = process.env.API_KEY,
  ORG_URL = process.env.REACT_APP_OKTA_URL,
  client = new okta.Client({ orgUrl: ORG_URL, token: API_KEY });

const parseAuthenticators = async (res, filter) => {
  try {
    if (res.ok) {
      const body = await res.json();

      let authenticators = [];
      //   console.debug('==== authenticators ====');
      //   console.debug(JSON.stringify(body, null, 2));
      body.forEach((authenticator) => {
        delete authenticator._links;
        authenticators.push(authenticator);
      });

      return authenticators;
    } else {
      throw new Error(`Response not ok! [${res}]`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAuthenticators = async (raw = false) => {
  try {
    const url = `${ORG_URL}/api/v1/authenticators`;

    const request = {
      method: 'get',
    };

    const response = await client.http.http(url, request);

    let authenticators = await response.json();

    if (!raw) {
      authenticators = await parseAuthenticators(response);
    }

    return { status: 200, authenticators };
  } catch (error) {
    console.error(error);
    return { status: 500, error };
  }
};

const index = (req, res) => {
  try {
    return getAuthenticators().then((resp) => res.status(resp?.status).send(resp?.authenticators));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export default index;
