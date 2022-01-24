/** @format */

import { Alert } from '../../components';
import { Snackbar as MuiSnackbar } from '@mui/material';

export const Snackbar = (props) => {
  const { onClose, open, duration, severity, children, error } = props || {};

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    return onClose();
  };

  let customProps = {
    ...props,
  };

  switch (severity) {
    case 'error':
    case 'warning':
      customProps.anchorOrigin = { vertical: 'top', horizontal: 'center' };
      break;
    default:
      customProps.anchorOrigin = { vertical: 'bottom', horizontal: 'left' };
      break;
  }

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={duration ?? 6000}
      onClose={handleClose}
      {...customProps}
    >
      <Alert onClose={onClose ?? handleClose} severity={severity ?? 'info'} sx={{ w: '100%' }}>
        {error?.message}
        {children ?? 'This is a message'}
      </Alert>
    </MuiSnackbar>
  );
};
