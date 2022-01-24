/** @format */

import { React, PropTypes } from 'globals.jsx';
import { Box, CircularProgress } from '@mui/material';

const Loader = ({ size, overlay = false }) => (
  <Box
    sx={{
      backgroundColor: overlay ? 'rgba(255, 255, 255, 0.80)' : 'transparent',
      display: 'flex',
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      float: 'left',
      zIndex: 5000,
      position: 'absolute',
      right: 0,
      top: 0,
    }}
  >
    <CircularProgress
      color='secondary'
      size={size ?? 65}
      sx={{
        // position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  </Box>
);

Loader.propTypes = {
  size: PropTypes.number,
  overlay: PropTypes.boolean,
};

export default Loader;
