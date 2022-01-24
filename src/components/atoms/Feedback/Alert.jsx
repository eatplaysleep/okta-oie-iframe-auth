/** @format */

import { React, PropTypes } from 'globals.jsx';
import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef((props, ref) => (
//   <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
// ));

const Alert = ({ elevation, variant, ...props }) => (
  <MuiAlert elevation={elevation} variant={variant} {...props} />
);

Alert.defaultProps = {
  elevation: 6,
  variant: 'filled',
};

Alert.propTypes = {
  elevation: PropTypes.number,
  variant: PropTypes.string,
};

export default Alert;
