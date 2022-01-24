/** @format */

import { React, PropTypes } from 'globals.jsx';
import { CircularProgress, Modal } from '@mui/material';

const LoadingOverlay = ({ open }) => (
  <Modal open={open} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.60)' }}>
    <CircularProgress
      color='secondary'
      size={100}
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  </Modal>
);

LoadingOverlay.propTypes = {
  open: PropTypes.bool,
};

export default LoadingOverlay;
