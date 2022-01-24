/** @format */

import { React, Fragment, PropTypes } from 'globals.jsx';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  Apple,
  CheckCircleOutline,
  EmailOutlined,
  Fingerprint,
  LocalPhoneOutlined,
  Lock,
  SmsOutlined,
} from '@mui/icons-material';
import { useAuthDispatch } from 'providers';

export const Authenticators = ({ factors }) => {
  const dispatch = useAuthDispatch();

  const handleSetup = (authenticatorId) => {
    const url = `${process.env.REACT_APP_OKTA_URL}/idp/authenticators/setup/${authenticatorId}`;

    dispatch({ type: 'AUTHENTICATORS_ENROLL_START', payload: { factorEnrollUrl: url } });
    // window.open(url);
  };

  return (
    <Fragment>
      {factors?.map(
        ({
          key,
          _id,
          name,
          factorType,
          provider,
          enrollment,
          status,
          _embedded,
          authenticators,
        }) => {
          let enrolledAuthenticators = [],
            setupText = 'Setup';

          if (authenticators.length > 0) {
            authenticators.forEach((authenticator) => {
              const { profile, name, type } = authenticator;

              let item = authenticator;

              switch (type) {
                case 'security_key':
                  item = {
                    ...item,
                    icon: name.startsWith('Mac') ? (
                      <Apple fontSize='small' />
                    ) : (
                      <Fingerprint fontSize='small' />
                    ),
                    value: name,
                  };
                  break;
                case 'email':
                  item = {
                    ...item,
                    icon: <EmailOutlined fontSize='small' />,
                    value: profile?.email,
                  };
                  break;
                case 'phone':
                  item = {
                    ...item,
                    icon: key.startsWith('sms') ? (
                      <SmsOutlined fontSize='small' />
                    ) : (
                      <LocalPhoneOutlined fontSize='small' />
                    ),
                    value: profile?.phoneNumber,
                  };
                  break;
                case 'app':
                  item = {
                    ...item,
                    icon: <CheckCircleOutline fontSize='small' />,
                    value: profile?.deviceName,
                  };
                  break;
                default:
                  item = {
                    ...item,
                    icon: <Lock fontSize='small' />,
                    value: name,
                  };
                  break;
              }

              if (authenticator?.status === 'ACTIVE') {
                enrolledAuthenticators.push(item);
              }
            });
          }

          const buildEnrolledAuthenticators = () =>
            enrolledAuthenticators.map((authenticator) => (
              <List key={`${authenticator.type}-${authenticator.id}`} disablePadding>
                <ListItem key={authenticator.id} sx={{ pl: 4 }}>
                  <ListItemIcon>{authenticator?.icon}</ListItemIcon>
                  <ListItemText primary={authenticator?.value} />
                </ListItem>
              </List>
            ));

          if (enrolledAuthenticators?.length > 0) {
            setupText = 'Add Another';
          }

          return (
            <Fragment key={key}>
              <ListItem
                key={key}
                alignItems='flex-start'
                secondaryAction={
                  <ListItemButton onClick={() => handleSetup(_id)}>{_id}</ListItemButton>
                }
              >
                <ListItemText primary={name} />
              </ListItem>
              {buildEnrolledAuthenticators()}
            </Fragment>
          );
        }
      )}
    </Fragment>
  );
};

Authenticators.defaultProps = {
  factors: [],
};

Authenticators.propTypes = {
  factors: PropTypes.array,
};

export default Authenticators;
