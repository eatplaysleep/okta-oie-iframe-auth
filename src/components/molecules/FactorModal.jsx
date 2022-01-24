/** @format */

import { React, useEffect, PropTypes } from 'globals.jsx';
import { IconButton, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AuthDialog } from 'components';
import { useAuthDispatch, useAuthState } from 'providers';

const ENV = process.env.NODE_ENV;
const ORIGINS = process.env.REACT_APP_ORIGIN_ALLOW?.split(/, {0,2}/) || [window.location.origin];

const FactorModal = (props) => {
  const { onClose } = props;
  const dispatch = useAuthDispatch();
  const { factorModalIsVisible, factorEnrollUrl } = useAuthState();

  const ALLOW = process.env.REACT_APP_STEP_UP_ALLOW,
    modalWidth = '400px',
    modalHeight = '700px';

  const onCancel = () => {
    dispatch({ type: 'AUTHENTICATORS_ENROLL_CANCEL' });
    return onClose();
  };

  useEffect(() => {
    const responseHandler = ({ origin, data }) => {
      if (ENV === 'production') {
        const isAllowed = ORIGINS.includes(origin);
        if (!isAllowed) {
          return dispatch({
            type: 'ERROR',
            payload: { factorModalIsVisible: false },
            error: `'origin' [${origin}] not allowed`,
          });
        }
      }

      if (data?.type === 'onsuccess' && data?.result === 'success') {
        return dispatch({ type: 'AUTHENTICATORS_ENROLL_SUCCESS' });
      }
    };

    const resolve = (error) => {
      if (error) {
        throw error;
      }

      console.debug('removing listener...');
      window.removeEventListener('message', responseHandler);
    };

    if (factorModalIsVisible) {
      console.debug('adding listener...');
      window.addEventListener('message', responseHandler);
    }

    return () => resolve();
  }, [factorModalIsVisible]);

  return (
    <AuthDialog open={factorModalIsVisible ?? false} onClose={onClose}>
      <DialogTitle>
        <IconButton
          edge='end'
          size='small'
          onClick={onCancel}
          sx={{
            color: 'white',
            position: 'absolute',
            borderRadius: 25,
            background: 'rgba(0, 0, 0, 0.53)',
            right: -15,
            top: -15,
            'z-index': '10',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ width: modalWidth, height: modalHeight }}>
        {factorModalIsVisible && factorEnrollUrl && (
          <iframe
            src={factorEnrollUrl}
            name='iframe-factor-enrollment'
            title='Factor Enrollment'
            width={modalWidth}
            height={modalHeight}
            frameBorder='0'
            style={{ display: 'block', borderRadius: '4px' }}
            allow={ALLOW}
          />
        )}
      </DialogContent>
    </AuthDialog>
  );
};

FactorModal.defaultProps = {
  open: false,
};

FactorModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default FactorModal;
