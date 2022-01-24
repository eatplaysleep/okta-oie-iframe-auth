/** @format */

import { React, PropTypes } from 'globals.jsx';
import { experimentalStyled as styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import MuiLoadingButton from '@mui/lab/LoadingButton';

const LoadingButtonRoot = styled(MuiLoadingButton)(({ theme, size }) => ({
  borderRadius: 0,
  fontWeight: theme.typography.fontWeightMedium,
  fontFamily: theme.typography.h1.fontFamily,
  padding: theme.spacing(2, 4),
  fontSize: theme.typography.pxToRem(14),
  boxShadow: 'none',
  '&:active, &:focus': {
    boxShadow: 'none',
  },
  ...(size === 'small' && {
    padding: theme.spacing(1, 3),
    fontSize: theme.typography.pxToRem(13),
  }),
  ...(size === 'large' && {
    padding: theme.spacing(2, 5),
    fontSize: theme.typography.pxToRem(16),
  }),
}));

// See https://mui.com/guides/typescript/#usage-of-component-prop for why the types uses `C`.
const LoadingButton = (props) => {
  const { loader } = props;

  const loaderProps = {
    color: 'secondary',
    size: 16,
    ...loader,
  };

  const loaderComponent = <CircularProgress {...loaderProps} />;

  const buttonProps = {
    loadingIndicator: loaderComponent,
    ...props,
  };
  return <LoadingButtonRoot {...buttonProps} />;
};

LoadingButton.propTypes = {
  loader: PropTypes.node,
};

export default LoadingButton;
